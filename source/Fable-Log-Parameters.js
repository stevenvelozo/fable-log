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
		var _Log = false;

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
		}

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
					]
			});

			// Now mash them together.  The order of priority:
			//  1. Anything passed in as a constructor parameter which will OVERRIDE
			//  2. Anything part of the Config file which will OVERRIDE
			//  3. Anything in the defaults structure above
			_Parameters = libUnderscore.extend({}, tmpDefaultParameters, _FileParameters, _PassedParameters);
		}

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableLogParametersObject = (
		{
			initializeConfiguration:initializeConfiguration,
			loadConfiguration:loadConfiguration,

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
}



module.exports = new FableLogParameters();