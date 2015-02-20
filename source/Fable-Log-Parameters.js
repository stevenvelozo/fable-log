/**
* Logfile Parameters Object
*
* @class FableLogParameters
* @constructor
*/
// We use Underscore.js for utility
var libUnderscore = require('underscore');

// NConf for settings
var libConfig = require('nconf');

var FableLogParameters = function()
{
	function createNew(pFromParameters)
	{
		libConfig.clear();

		var _PassedParameters = (typeof(pFromParameters) === 'undefined') ? {} : pFromParameters;

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
		var loadConfiguration = function(pConfigurationFile, pConfigurationContext)
		{
			var tmpConfigurationFile = (typeof(pConfigurationFile) === 'undefined') ? './Fable-Log-Config.json' : __dirname+'/'+pConfigurationFile;
			var tmpConfigurationContext = (typeof(pConfigurationContext) === 'undefined') ? 'LoadedFile' : pConfigurationContext;
			libConfig.file(tmpConfigurationContext, tmpConfigurationFile);
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
			var tmpDefaultSettings = (
			{
				Product: 'Fable',
				ProductVersion: '00.00.000',
				// This is the default development server setup for Logging, which is inefficient for production.
				UUID: (
					{
						DataCenter: 0,
						Worker: 0
					})
			});

			// Now mash them together.  The order of priority:
			//  1. Anything passed in as a constructor parameter which will OVERRIDE
			//  2. Anything part of the Config file which will OVERRIDE
			//  3. Anything in the defaults structure above
			_Parameters = libUnderscore.extend({}, tmpDefaultSettings, libConfig.get(), _PassedParameters);
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

	return { new: createNew };
}



module.exports = new FableLogParameters();