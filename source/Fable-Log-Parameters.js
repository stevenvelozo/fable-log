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

		var _GelfStream = false;
		var _LogStashStream = false;
		var _ESStream = false;

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
				ProductVersion: '0.0.0',
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
					]
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
						case 'prettystream':
							// Add a "pretty stream" (which is like piping output through bunyan)
							var libPrettyStream = require('bunyan-prettystream');
							var tmpPrettyStream = new libPrettyStream();
							tmpPrettyStream.pipe(process.stdout);
							tmpStreams.push({ level:tmpLogLevel, type: 'raw', stream:tmpPrettyStream});
							break;
						case 'graylog':
							var libGelf = require('gelf-stream');
							var tmpServer = pLogStreams[i].server || '127.0.0.1';
							var tmpPort = pLogStreams[i].port || 12201;
							_GelfStream = libGelf.forBunyan(tmpServer, tmpPort);
							tmpStreams.push({ level:tmpLogLevel, type: 'raw', stream:_GelfStream});
							break;
						case 'logstash':
							var libStash = require('bunyan-logstash-tcp');
							var tmpServer = pLogStreams[i].server || '127.0.0.1';
							var tmpPort = pLogStreams[i].port || 5000;
							_LogStashStream = libStash.createStream({
								host: tmpServer,
								port: tmpPort,
								max_connect_retries: -1,
								retry_interval: 5000
							});
							_LogStashStream.on('error', function (err) {
								console.log('[fable-log] logstash Stream Error:', err);
							  });
							tmpStreams.push({ level:tmpLogLevel, type: 'raw', stream:_LogStashStream});
							break;
						case 'elasticsearch':
							var libES = require('bunyan-elasticsearch');
							var tmpIndexPattern = pLogStreams[i].indexPattern || '[logs-]YYYY.MM.DD';
							var tmpServer = pLogStreams[i].server || '127.0.0.1';
							var tmpPort = pLogStreams[i].port || 9200;
							_ESStream = new libES({
								indexPattern: tmpIndexPattern,
								type: 'logs',
								host: tmpServer + ':' + tmpPort
							});
							_ESStream.on('error', function (err) {
							  console.log('[fable-log] Elasticsearch Stream Error:', err.stack);
							});
							tmpStreams.push({ level:tmpLogLevel, stream:_ESStream});
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
							// Lazily initialize the parameters if they aren't there.
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