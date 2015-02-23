/**
* Fable Logging Add-on
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable Logger
*/

/**
* Fable Solution Log Wrapper Main Class
*
* @class FableLog
* @constructor
*/
var FableLog = function()
{
	function createNew(pFromParameters)
	{
		var _Parameters = require('./Fable-Log-Parameters.js').new(pFromParameters);

		var _Log = false;

		var _UUID = false;

		var initialize = function(pConfigurationFileName)
		{
			var tmpConfigurationFileName = (typeof(pConfigurationFileName) === 'string') ? pConfigurationFileName : false;

			// Load the configuration file for log parameters, if one exists
			if (tmpConfigurationFileName)
			{
				_Parameters.loadConfiguration(tmpConfigurationFileName);
			}

			// Now create the Bunyan log object
			_Log = require('bunyan').createLogger(
				{
					name: _Parameters.parameters.Product+'-'+_Parameters.parameters.ProductVersion,
					streams: _Parameters.parameters.LogStreams
				});

			// Only create a UUID if one wasn't previously set.
			if (!_UUID)
			{
				// Generate a per-instantiation UUID, using flake-idgen and biguint-format
				var libFlakeIDGen = require('flake-idgen');
				var FlakeIDGen = new libFlakeIDGen({ datacenter:_Parameters.parameters.UUID.DataCenter, worker:_Parameters.parameters.UUID.Worker });
				var libIntFormat = require('biguint-format');

				_UUID = libIntFormat(FlakeIDGen.next(), 'hex', { prefix: '0x' });
			}	
		};


		/**
		* Write a message to the TRACE stream.
		*
		* @method logTrace
		* @param {String} pMessage A short text description of the event
		* @param {Object} pDatum Any objects that are important to this event
		* @return {Boolean} Returns whether the log event worked.
		*/
		var logTrace = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.trace({UUID:_UUID, datum:tmpDatum}, tmpMessage);
			return true;
		};

		/**
		* Write a message to the DEBUG stream.
		*
		* @method logDebug
		* @param {String} pMessage A short text description of the event
		* @param {Object} pDatum Any objects that are important to this event
		* @return {Boolean} Returns whether the log event worked.
		*/
		var logDebug = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.debug({UUID:_UUID, datum:tmpDatum}, tmpMessage);
			return true;
		};

		/**
		* Write a message to the INFO stream.
		*
		* @method logInfo
		* @param {String} pMessage A short text description of the event
		* @param {Object} pDatum Any objects that are important to this event
		* @return {Boolean} Returns whether the log event worked.
		*/
		var logInfo = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.info({UUID:_UUID, datum:tmpDatum}, tmpMessage);
			return true;
		};

		/**
		* Write a message to the WARNING stream.
		*
		* @method logWarn
		* @param {String} pMessage A short text description of the event
		* @param {Object} pDatum Any objects that are important to this event
		* @return {Boolean} Returns whether the log event worked.
		*/
		var logWarn = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.warn({UUID:_UUID, datum:tmpDatum}, tmpMessage);
			return true;
		};

		/**
		* Write a message to the ERROR stream.
		*
		* @method logError
		* @param {String} pMessage A short text description of the event
		* @param {Object} pDatum Any objects that are important to this event
		* @return {Boolean} Returns whether the log event worked.
		*/
		var logError = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.error({UUID:_UUID, datum:tmpDatum}, tmpMessage);
			return true;
		};

		/**
		* Write a message to the FATAL stream.
		*
		* @method logFatal
		* @param {String} pMessage A short text description of the event
		* @param {Object} pDatum Any objects that are important to this event
		* @return {Boolean} Returns whether the log event worked.
		*/
		var logFatal = function(pMessage, pDatum)
		{
			if (!_Log)
			{
				return false;
			}

			var tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
			var tmpMessage = (typeof(pMessage) !== 'string') ? 'No message' : pMessage;

			_Log.fatal({UUID:_UUID, datum:tmpDatum}, tmpMessage);
			return true;
		};


		/**
		* Container Object for our Factory Pattern
		*/
		var tmpNewFableLogObject = (
		{
			initialize: initialize,

			trace: logTrace,
			debug: logDebug,
			info: logInfo,
			warn: logWarn,
			error: logError,
			fatal: logFatal,

			new: createNew
		});

		/**
		 * Raw Bunyan Logger
		 *
		 * This is exposed for complex logging calls.  Only recommended for debug and 
		 * lower level logging.
		 *
		 * @property logger
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableLogObject, 'logger',
			{
				get: function() { return _Log; },
				enumerable: false
			});

		/**
		 * Log File Parameters
		 *
		 * @property parameters
		 * @type Object
		 */
		Object.defineProperty(tmpNewFableLogObject, 'parameters',
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
		Object.defineProperty(tmpNewFableLogObject, 'uuid',
			{
				get: function() { return _UUID; },
				set: function(pUUID) { _UUID = pUUID; },
				enumerable: true
			});

		return tmpNewFableLogObject;
	}

	return createNew();
};

module.exports = new FableLog();
