/**
* Logfile Parameters Object
*
* @class FableLogParameters
* @constructor
*/
// Underscore.js for utility
var libUnderscore = require('underscore');

var FableLogParameters = function()
{
	function createNew(pFromParameters)
	{
		var _PassedParameters = (typeof(pFromParameters) === 'undefined') ? {} : pFromParameters;
		var _FileParameters = {};

		var _Parameters = false;

		/**
		* Load a configuration file.
		*
		* Defaults to ./Fable-Log-Config.json
		*
		* @method loadConfiguration
		* @param {Object} pConfigurationFile A file to load as the configuration
		*/
		var loadConfiguration = function(pConfigurationFile)
		{
			var tmpConfigurationFile = (typeof(pConfigurationFile) === 'undefined') ? __dirname+'/Fable-Log-Config.json' : __dirname+'/'+pConfigurationFile;
			var tmpConfigurationData = {};

			// Optimistically expect the file to exist.  If it doesn't, quietly continue.
			// Logging should not bring down the app.
			try
			{
				tmpConfigurationData = require(tmpConfigurationFile);
			}
			catch (pException)
			{
				console.log('Fable Log Loader Error: Configuration File Not Found at '+tmpConfigurationFile);
			}

			_FileParameters = tmpConfigurationData;
		};


		/**
		* Initialize any configuration for the parameters that don't exist, copy them to the Parameters object.
		*
		* @method initializeConfiguration
		* @return {Boolean} Whether the object was initialized
		*/
		var initializeConfiguration = function()
		{
			// Set the default settings
			var tmpDefaultParameters = (
			{
				Product: 'Fable',
				ProductVersion: '00.00.000',
				// This is the default development server setup for Logging, which is inefficient for production.
				UUID: (
					{
						DataCenter: 0,
						Worker: 0
					}),
				LogStreams:
					[
						{
							level: "trace",
							stream: process.stdout
						}
					],
				MongoDBURL: 'mongodb://127.0.0.1:27017/Headlight'
			});

			// Now mash them together.  The order of priority:
			//  1. Anything passed in as a constructor parameter which will OVERRIDE
			//  2. Anything part of the Config file which will OVERRIDE
			//  3. Anything in the defaults structure above
			_Parameters = libUnderscore.extend({}, tmpDefaultParameters, _FileParameters, _PassedParameters);
		};


		/**
		* Parse log Streams so we can use Log Objects
		*
		* @method parseLogStreams
		* @param {Array} pLogStreams
		* @return {Array} The parsed log stream object
		*/
		var parseLogStreams = function(pLogStreams)
		{
			// Because we can't json-encode the process.stdout, etc. this has to translate.
			var tmpStreams = [];
			var tmpDefaultStream = [ { level: 'trace', stream: process.stdout } ];
			var tmpLogLevel = 'info';

			if (!Array.isArray(pLogStreams))
			{
				// No valid stream array, return default.
				return tmpDefaultStream;
			}

//			console.log(stringifyOnce(pLogStreams))

			for (var i = 0; i < pLogStreams.length; i++)
			{
				if (typeof(pLogStreams[i]) !== 'object')
				{
					console.log('Invalid log definition: '+JSON.stringify(pLogStreams[i]));
					continue;
				}

				// Validate that the log entry has the expected values
				// Entries look like {path:'/tmp/somelog.log',level:'info'}
				if (!pLogStreams[i].hasOwnProperty('level'))
				{
					console.log('Log definition does not contain a .level property; defaulting to info');
				}
				else
				{
					tmpLogLevel = pLogStreams[i].level;
				}

				if (typeof(pLogStreams[i].streamtype) === 'string')
				{
					switch(pLogStreams[i].streamtype)
					{
						case 'process.stdout':
							// Add a stdout stream appender
							tmpStreams.push({ level:tmpLogLevel, stream:process.stdout});
							break;
						case 'process.stderr':
							// Add a stderr stream appender
							tmpStreams.push({ level:tmpLogLevel, stream:process.stderr});
							break;
						case 'mongodb':
								var libMongoClient = require('mongodb');

								var libBunyanMongo = require('bunyan-mongo');
								var tmpBunyanMongoStream = new libBunyanMongo();

								console.log("Attempting to connect to MongoDB for logging...");
								libMongoClient.Db.connect(_Parameters.MongoDBURL, 
									function(pError, pDatabase)
									{
										console.log("...Checking MongoDB connection...");
										if (pError === null)
											console.log("Connected correctly to MongoDB Server!");
										else
											console.log("Error connecting to MongoDB: "+pError);
										tmpBunyanMongoStream.setDB(pDatabase);
										// Add a mongodb stream appender
										tmpStreams.push({ type:'raw', stream:tmpBunyanMongoStream});
									}
								);
							break;						
					}
				}
				else if (typeof(pLogStreams[i].stream) === 'object')
				{
					// Add a passed-in stream provider
					tmpStreams.push({ level:tmpLogLevel, stream:pLogStreams[i].stream});
				}
				else if (pLogStreams[i].hasOwnProperty('path'))
				{
					// Add a file-based stream appender
					tmpStreams.push({ level:tmpLogLevel, path:pLogStreams[i].path});
				}
				else
				{
					console.log('Log stream definition is invalid - no parsable stream route.  Ignoring entry # '+i);
				}
			}

			if (tmpStreams.length < 1)
			{
				// Load the default stream if nothing came in.
				tmpStreams = tmpDefaultStream;
			}

			return tmpStreams;
		};


		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableLogParametersObject = (
		{
			initializeConfiguration:initializeConfiguration,
			loadConfiguration:loadConfiguration,

			parseLogStreams:parseLogStreams,

			new:createNew
		});

		/**
		 * Log Parameters
		 *
		 * @property parameters
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableLogParametersObject, 'parameters',
			{
				get: function()
						{
							// Lazily load the parameters
							if (!_Parameters)
							{
								initializeConfiguration();
							}
							return _Parameters;
						},
				set: function(pParameters) { _Parameters = pParameters; },
				enumerable: true
			});


		return tmpNewFableLogParametersObject;
	}

	return createNew();
};



module.exports = new FableLogParameters();