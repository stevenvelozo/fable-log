/**
* FoxHound Query Generation Library
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module FoxHound
*/

// The logger uses Bunyan to write logs
/**
* Logging Abstraction
*
*/
var libBunyan = require('bunyan');
var libFableLogParameters = require('./Fable-Log-Parameters.js');

module.exports = Logger;

var FoxHound = function()
{
	function createNew(pFromParameters)
	{
		var _DefaultParameters = pFromParameters;
		var _Parameters = false;

		var _UUID = false;

		var initialize(pConfigurationFile)
		{
			// Create a clean-slate log parameters object
			_Parameters = libFableLogParameters.new(_DefaultParameters);

			// Load the configuration file for log parameters, if one exists
			_Parameters.loadConfiguration(pConfigurationFile);

			// Load the defaults over any empty configuration values
			_Parameters.initializeConfiguration();

			// Each query object gets a UUID, using flake-idgen and biguint-format
			var libFlakeIDGen = require('flake-idgen');
			var flakeIDGen = new libFlakeIDGen();
			var libIntFormat = require('biguint-format');

			// Now create the log object
			var libLog = require('bunyan').createLogger(
				{
					name: libConfig.get('Product')+'-'+libConfig.get('ProductVersion'),
					streams: libConfig.get('LogStreams')
				});

			// Only create a UUID if one wasn't previously set.
			if (!_UUID)
			{
				_UUID = libIntFormat(flakeIDGen.next(), 'hex', { prefix: '0x' });
			}
			
		}

		var logInfo = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.info({UUID:_UUID, datum:tmpDatum}, tmpMessage);
		}

		var logError = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.info({UUID:_UUID, datum:tmpDatum}, tmpMessage);
		}

		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableLogObject = (
		{
			resetParameters: resetParameters,
			mergeParameters: mergeParameters,

			setLogLevel: setLogLevel,

			setScope: setScope,
			dataElements: setDataElements,
			setBegin: setBegin,
			setCap: setCap,

			setDialect: setDialect,
			buildReadQuery: buildReadQuery,

			clone: clone,
			new: createNew
		});

		/**
		 * Query
		 *
		 * @property query
		 * @type Object
		 */
		Object.defineProperty(tmpNewFoxHoundObject, 'query',
			{
				get: function() { return _Query; },
				set: function(pQuery) { _Query = pQuery; },
				enumerable: true
			});

		/**
		 * Query Parameters
		 *
		 * @property parameters
		 * @type Object
		 */
		Object.defineProperty(tmpNewFoxHoundObject, 'parameters',
			{
				get: function() { return _Parameters; },
				set: function(pParameters) { _Parameters = pParameters; },
				enumerable: true
			});

		/**
		 * Universally Unique Identifier
		 *
		 * @property uuid
		 * @type string
		 */
		Object.defineProperty(tmpNewFoxHoundObject, 'uuid',
			{
				get: function() { return _UUID; },
				enumerable: true
			});

		return tmpNewFableLogObject;
	}

	return createNew();
};

module.exports = new FoxHound();
