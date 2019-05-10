(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
* Random Byte Generator - Browser version
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
class RandomBytes
{
	constructor()
	{

		// getRandomValues needs to be invoked in a context where "this" is a Crypto
		// implementation. Also, find the complete implementation of crypto on IE11.
		this.getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      		(typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));
	}

	// WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
	generateWhatWGBytes()
	{
		let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

		this.getRandomValues(tmpBuffer);
		return tmpBuffer;
	}

	// Math.random()-based (RNG)
	generateRandomBytes()
	{
		//
		// If all else fails, use Math.random().  It's fast, but is of unspecified
		// quality.
		let tmpBuffer = new Uint8Array(16); // eslint-disable-line no-undef

		for (let i = 0, tmpValue; i < 16; i++)
		{
			if ((i & 0x03) === 0)
			{
				tmpValue = Math.random() * 0x100000000;
			}

			tmpBuffer[i] = tmpValue >>> ((i & 0x03) << 3) & 0xff;
		}

		return tmpBuffer;
	}

	generate()
	{
		if (this.getRandomValues)
		{
			return generateWhatWGBytes();
		}
		else
		{
			return generateRandomBytes();
		}
	}
}

module.exports = RandomBytes;

},{}],2:[function(require,module,exports){
/**
* Fable UUID Generator
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
* @module Fable UUID
*/

/**
* Fable Solution UUID Generation Main Class
*
* @class FableUUID
* @constructor
*/

var libRandomByteGenerator = require('./Fable-UUID-Random.js')

class FableUUID
{
	constructor(pSettings)
	{
		// Determine if the module is in "Random UUID Mode" which means just use the random character function rather than the v4 random UUID spec.
		// Note this allows UUIDs of various lengths (including very short ones) although guaranteed uniqueness goes downhill fast.
		this._UUIDModeRandom = (typeof(pSettings) === 'object') && (pSettings.hasOwnProperty('UUIDModeRandom')) ? (pSettings.UUIDModeRandom == true) : false;
		// These two properties are only useful if we are in Random mode.  Otherwise it generates a v4 spec
		// Length for "Random UUID Mode" is set -- if not set it to 8
		this._UUIDLength = (typeof(pSettings) === 'object') && (pSettings.hasOwnProperty('UUIDLength')) ? (pSettings.UUIDLength + 0) : 8;
		// Dictionary for "Random UUID Mode"
		this._UUIDRandomDictionary = (typeof(pSettings) === 'object') && (pSettings.hasOwnProperty('UUIDDictionary')) ? (pSettings.UUIDDictionary + 0) : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

		this.randomByteGenerator = new libRandomByteGenerator();

		// Lookup table for hex codes
		this._HexLookup = [];
		for (let i = 0; i < 256; ++i)
		{
			this._HexLookup[i] = (i + 0x100).toString(16).substr(1);
		}
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	bytesToUUID(pBuffer)
	{
		let i = 0;
		// join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
		return ([
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], 
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], '-',
					this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]], this._HexLookup[pBuffer[i++]]
				]).join('');
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	generateUUIDv4()
	{
		let tmpBuffer = new Array(16);
		var tmpRandomBytes = this.randomByteGenerator.generate();

		// Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
		tmpRandomBytes[6] = (tmpRandomBytes[6] & 0x0f) | 0x40;
		tmpRandomBytes[8] = (tmpRandomBytes[8] & 0x3f) | 0x80;

		return this.bytesToUUID(tmpRandomBytes);
	}

	// Simple random UUID generation
	generateRandom()
	{
		let tmpUUID = '';

		for (let i = 0; i < this._UUIDLength; i++)
		{
			tmpUUID += this._UUIDRandomDictionary.charAt(Math.floor(Math.random() * (this._UUIDRandomDictionary.length-1)));
		}

		return tmpUUID;
	}

	// Adapted from node-uuid (https://github.com/kelektiv/node-uuid)
	getUUID()
	{
		if (this._UUIDModeRandom)
		{
			return this.generateRandom();
		}
		else
		{
			return this.generateUUIDv4();
		}
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableUUID(pSettings);
}


module.exports = {new:autoConstruct, FableUUID:FableUUID};

},{"./Fable-UUID-Random.js":1}],3:[function(require,module,exports){
/**
* Base Logger Class
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/
const libFableUUID = new (require('fable-uuid').FableUUID)();

class BaseLogger
{
	constructor(pLogStreamSettings, pFableLog)
	{
		// This should not possibly be able to be instantiated without a settings object
		this._Settings = pLogStreamSettings;
		
		// The base logger does nothing but associate a UUID with itself
		this.loggerUUID = libFableUUID.getUUID();
	}

	initialize()
	{
		// No operation.
	}

	trace(pLogText, pLogObject)
	{
		this.write("trace", pLogText, pLogObject);
	}

	debug(pLogText, pLogObject)
	{
		this.write("debug", pLogText, pLogObject);
	}

	info(pLogText, pLogObject)
	{
		this.write("info", pLogText, pLogObject);
	}

	warn(pLogText, pLogObject)
	{
		this.write("warn", pLogText, pLogObject);
	}

	error(pLogText, pLogObject)
	{
		this.write("error", pLogText, pLogObject);
	}

	fatal(pLogText, pLogObject)
	{
		this.write("fatal", pLogText, pLogObject);
	}

	write(pLogLevel, pLogText, pLogObject)
	{
		// The base logger does nothing.
		return true;
	}
}

module.exports = BaseLogger;

},{"fable-uuid":2}],4:[function(require,module,exports){
/**
* Default Logger Provider Function --- Browser
*
* @license MIT
*
* @author Steven Velozo <steven@velozo.com>
*/

// Return the providers that are available without extensions loaded
getDefaultProviders = () =>
{
	let tmpDefaultProviders = {};

	tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');

	return tmpDefaultProviders;
}

module.exports = getDefaultProviders();
},{"./Fable-Log-Logger-Console.js":6}],5:[function(require,module,exports){
module.exports=[
    {
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
    }
]
},{}],6:[function(require,module,exports){
let libBaseLogger = require('./Fable-Log-BaseLogger.js');

class ConsoleLogger extends libBaseLogger
{
	constructor(pLogStreamSettings, pFableLog)
	{
		super(pLogStreamSettings)

		this._ShowTimeStamps = pLogStreamSettings.hasOwnProperty('ShowTimeStamps') ? (pLogStreamSettings.ShowTimeStamps == true) : false;
		this._FormattedTimeStamps = pLogStreamSettings.hasOwnProperty('FormattedTimeStamps') ? (pLogStreamSettings.FormattedTimeStamps == true) : false;

		this._ContextMessage = pLogStreamSettings.hasOwnProperty('Context') ? ` (${pLogStreamSettings.Context})` : 
								pFableLog._Settings.hasOwnProperty('Product') ? ` (${pFableLog._Settings.Product})` :
								'';
	}

	write(pLevel, pLogText, pObject)
	{
		if (this._ShowTimeStamps && this._FormattedTimeStamps)
		{
			let tmpDate = (new Date()).toISOString();
			console.log(`${tmpDate} [${pLevel}]${this._ContextMessage} ${pLogText}`);
		}
		else if (this._ShowTimeStamps)
		{
			let tmpDate = +new Date();
			console.log(`${tmpDate} [${pLevel}]${this._ContextMessage} ${pLogText}`);
		}
		else
		{
			console.log(`[${pLevel}]${this._ContextMessage} ${pLogText}`);
		}

		// Write out the object on a separate line if it is passed in
		if (typeof(pObject) !== 'undefined')
		{
			console.log(JSON.stringify(pObject, null, 4));
		}
	}

}

module.exports = ConsoleLogger;
},{"./Fable-Log-BaseLogger.js":3}],7:[function(require,module,exports){
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
class FableLog
{
	constructor(pFableSettings, pFable)
	{
		let tmpSettings = (typeof(pFableSettings) === 'object') ? pFableSettings : {}
		this._Settings = tmpSettings;

		this._Providers = require('./Fable-Log-DefaultProviders.js');

		this._StreamDefinitions = (tmpSettings.hasOwnProperty('LogStreams')) ? tmpSettings.LogStreams : require('./Fable-Log-DefaultStreams.json');

		this.logStreams = [];

		// This object gets decorated for one-time instantiated providers that
		//  have multiple outputs, such as bunyan.
		this.logProviders = {};

		// A hash list of the GUIDs for each log stream, so they can't be added to the set more than one time
		this.activeLogStreams = {};

		this.logStreamsTrace = [];
		this.logStreamsDebug = [];
		this.logStreamsInfo = [];
		this.logStreamsWarn = [];
		this.logStreamsError = [];
		this.logStreamsFatal = [];

		this.uuid = (typeof(tmpSettings.Product) === 'string') ? tmpSettings.Product : 'Default';
	}

	addLogger(pLogger, pLevel)
	{
		// Bail out if we've already created one.
		if (this.activeLogStreams.hasOwnProperty(pLogger.loggerUUID))
		{
			return false;
		}

		// Add it to the streams and to the mutex
		this.logStreams.push(pLogger);
		this.activeLogStreams[pLogger.loggerUUID] = true;

		// Make sure a kosher level was passed in
		switch (pLevel)
		{
			case 'trace':
				this.logStreamsTrace.push(pLogger);
			case 'debug':
				this.logStreamsDebug.push(pLogger);
			case 'info':
				this.logStreamsInfo.push(pLogger);
			case 'warn':
				this.logStreamsWarn.push(pLogger);
			case 'error':
				this.logStreamsError.push(pLogger);
			case 'fatal':
				this.logStreamsFatal.push(pLogger);
				break;
		}

		return true;
	}

	trace(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsTrace.length; i++)
		{
			this.logStreamsTrace[i].trace(pMessage, pDatum);
		}
	}

	debug(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsDebug.length; i++)
		{
			this.logStreamsDebug[i].debug(pMessage, pDatum);
		}
	}

	info(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsInfo.length; i++)
		{
			this.logStreamsInfo[i].info(pMessage, pDatum);
		}
	}

	warn(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsWarn.length; i++)
		{
			this.logStreamsWarn[i].warn(pMessage, pDatum);
		}
	}

	error(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsError.length; i++)
		{
			this.logStreamsError[i].error(pMessage, pDatum);
		}
	}

	fatal(pMessage, pDatum)
	{
		for (let i = 0; i < this.logStreamsFatal.length; i++)
		{
			this.logStreamsFatal[i].fatal(pMessage, pDatum);
		}
	}

	initialize()
	{
		// "initialize" each logger as defined in the logging parameters
		for (let i = 0; i < this._StreamDefinitions.length; i++)
		{
			let tmpStreamDefinition = Object.assign({loggertype:'console',streamtype:'console',level:'info'},this._StreamDefinitions[i]);

			if (!this._Providers.hasOwnProperty(tmpStreamDefinition.loggertype))
			{
				console.log(`Error initializing log stream: bad loggertype in stream definition ${JSON.stringify(tmpStreamDefinition)}`);
			}
			else
			{
				this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);				
			}
		}

		// Now initialize each one.
		for (let i = 0; i < this.logStreams.length; i++)
		{
			this.logStreams[i].initialize();
		}
	}

	logTime(pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time';
		let tmpTime = new Date();
		this.info(`${tmpMessage} ${tmpTime} (epoch ${+tmpTime})`, pDatum);
	}

	// Get a timestamp 
	getTimeStamp()
	{
		return +new Date();
	}

	getTimeDelta(pTimeStamp)
	{
		let tmpEndTime = +new Date();
		return tmpEndTime-pTimeStamp;
	}

	// Log the delta between a timestamp, and now with a message
	logTimeDelta(pTimeDelta, pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';
		let tmpDatum = (typeof(pDatum) === 'object') ? pDatum : {};

		let tmpEndTime = +new Date();

		this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms)`, pDatum);
	}

	logTimeDeltaHuman(pTimeDelta, pMessage, pDatum)
	{
		let tmpMessage = (typeof(pMessage) !== 'undefined') ? pMessage : 'Time Measurement';

		let tmpEndTime = +new Date();

		let tmpMs = parseInt(pTimeDelta%1000);
		let tmpSeconds = parseInt((pTimeDelta/1000)%60);
		let tmpMinutes = parseInt((pTimeDelta/(1000*60))%60);
		let tmpHours = parseInt(pTimeDelta/(1000*60*60));

		tmpMs = (tmpMs < 10) ? "00"+tmpMs : (tmpMs < 100) ? "0"+tmpMs : tmpMs;
		tmpSeconds = (tmpSeconds < 10) ? "0"+tmpSeconds : tmpSeconds;
		tmpMinutes = (tmpMinutes < 10) ? "0"+tmpMinutes : tmpMinutes;
		tmpHours = (tmpHours < 10) ? "0"+tmpHours : tmpHours;

		this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms) or (${tmpHours}:${tmpMinutes}:${tmpSeconds}.${tmpMs})`, pDatum);
	}

	logTimeDeltaRelative(pStartTime, pMessage, pDatum)
	{
		this.logTimeDelta(this.getTimeDelta(pStartTime), pMessage, pDatum);
	}

	logTimeDeltaRelativeHuman(pStartTime, pMessage, pDatum)
	{
		this.logTimeDeltaHuman(this.getTimeDelta(pStartTime), pMessage, pDatum);
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableLog(pSettings);
}


module.exports = {new:autoConstruct, FableLog:FableLog};

},{"./Fable-Log-DefaultProviders.js":4,"./Fable-Log-DefaultStreams.json":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmFibGUtdXVpZC9zb3VyY2UvRmFibGUtVVVJRC1SYW5kb20tQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS11dWlkL3NvdXJjZS9GYWJsZS1VVUlELmpzIiwic291cmNlL0ZhYmxlLUxvZy1CYXNlTG9nZ2VyLmpzIiwic291cmNlL0ZhYmxlLUxvZy1EZWZhdWx0UHJvdmlkZXJzLUJyb3dzZXIuanMiLCJzb3VyY2UvRmFibGUtTG9nLURlZmF1bHRTdHJlYW1zLmpzb24iLCJzb3VyY2UvRmFibGUtTG9nLUxvZ2dlci1Db25zb2xlLmpzIiwic291cmNlL0ZhYmxlLUxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiogUmFuZG9tIEJ5dGUgR2VuZXJhdG9yIC0gQnJvd3NlciB2ZXJzaW9uXG4qXG4qIEBsaWNlbnNlIE1JVFxuKlxuKiBAYXV0aG9yIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cblxuLy8gQWRhcHRlZCBmcm9tIG5vZGUtdXVpZCAoaHR0cHM6Ly9naXRodWIuY29tL2tlbGVrdGl2L25vZGUtdXVpZClcbi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBJbiB0aGVcbi8vIGJyb3dzZXIgdGhpcyBpcyBhIGxpdHRsZSBjb21wbGljYXRlZCBkdWUgdG8gdW5rbm93biBxdWFsaXR5IG9mIE1hdGgucmFuZG9tKClcbi8vIGFuZCBpbmNvbnNpc3RlbnQgc3VwcG9ydCBmb3IgdGhlIGBjcnlwdG9gIEFQSS4gIFdlIGRvIHRoZSBiZXN0IHdlIGNhbiB2aWFcbi8vIGZlYXR1cmUtZGV0ZWN0aW9uXG5jbGFzcyBSYW5kb21CeXRlc1xue1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblxuXHRcdC8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0b1xuXHRcdC8vIGltcGxlbWVudGF0aW9uLiBBbHNvLCBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gb24gSUUxMS5cblx0XHR0aGlzLmdldFJhbmRvbVZhbHVlcyA9ICh0eXBlb2YoY3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pKSB8fFxuICAgICAgICAgICAgICAgICAgICAgIFx0XHQodHlwZW9mKG1zQ3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93Lm1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKSk7XG5cdH1cblxuXHQvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cblx0Z2VuZXJhdGVXaGF0V0dCeXRlcygpXG5cdHtcblx0XHRsZXQgdG1wQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cblx0XHR0aGlzLmdldFJhbmRvbVZhbHVlcyh0bXBCdWZmZXIpO1xuXHRcdHJldHVybiB0bXBCdWZmZXI7XG5cdH1cblxuXHQvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG5cdGdlbmVyYXRlUmFuZG9tQnl0ZXMoKVxuXHR7XG5cdFx0Ly9cblx0XHQvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuXHRcdC8vIHF1YWxpdHkuXG5cdFx0bGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIHRtcFZhbHVlOyBpIDwgMTY7IGkrKylcblx0XHR7XG5cdFx0XHRpZiAoKGkgJiAweDAzKSA9PT0gMClcblx0XHRcdHtcblx0XHRcdFx0dG1wVmFsdWUgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG5cdFx0XHR9XG5cblx0XHRcdHRtcEJ1ZmZlcltpXSA9IHRtcFZhbHVlID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRtcEJ1ZmZlcjtcblx0fVxuXG5cdGdlbmVyYXRlKClcblx0e1xuXHRcdGlmICh0aGlzLmdldFJhbmRvbVZhbHVlcylcblx0XHR7XG5cdFx0XHRyZXR1cm4gZ2VuZXJhdGVXaGF0V0dCeXRlcygpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGdlbmVyYXRlUmFuZG9tQnl0ZXMoKTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSYW5kb21CeXRlcztcbiIsIi8qKlxuKiBGYWJsZSBVVUlEIEdlbmVyYXRvclxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiogQG1vZHVsZSBGYWJsZSBVVUlEXG4qL1xuXG4vKipcbiogRmFibGUgU29sdXRpb24gVVVJRCBHZW5lcmF0aW9uIE1haW4gQ2xhc3NcbipcbiogQGNsYXNzIEZhYmxlVVVJRFxuKiBAY29uc3RydWN0b3JcbiovXG5cbnZhciBsaWJSYW5kb21CeXRlR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9GYWJsZS1VVUlELVJhbmRvbS5qcycpXG5cbmNsYXNzIEZhYmxlVVVJRFxue1xuXHRjb25zdHJ1Y3RvcihwU2V0dGluZ3MpXG5cdHtcblx0XHQvLyBEZXRlcm1pbmUgaWYgdGhlIG1vZHVsZSBpcyBpbiBcIlJhbmRvbSBVVUlEIE1vZGVcIiB3aGljaCBtZWFucyBqdXN0IHVzZSB0aGUgcmFuZG9tIGNoYXJhY3RlciBmdW5jdGlvbiByYXRoZXIgdGhhbiB0aGUgdjQgcmFuZG9tIFVVSUQgc3BlYy5cblx0XHQvLyBOb3RlIHRoaXMgYWxsb3dzIFVVSURzIG9mIHZhcmlvdXMgbGVuZ3RocyAoaW5jbHVkaW5nIHZlcnkgc2hvcnQgb25lcykgYWx0aG91Z2ggZ3VhcmFudGVlZCB1bmlxdWVuZXNzIGdvZXMgZG93bmhpbGwgZmFzdC5cblx0XHR0aGlzLl9VVUlETW9kZVJhbmRvbSA9ICh0eXBlb2YocFNldHRpbmdzKSA9PT0gJ29iamVjdCcpICYmIChwU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ1VVSURNb2RlUmFuZG9tJykpID8gKHBTZXR0aW5ncy5VVUlETW9kZVJhbmRvbSA9PSB0cnVlKSA6IGZhbHNlO1xuXHRcdC8vIFRoZXNlIHR3byBwcm9wZXJ0aWVzIGFyZSBvbmx5IHVzZWZ1bCBpZiB3ZSBhcmUgaW4gUmFuZG9tIG1vZGUuICBPdGhlcndpc2UgaXQgZ2VuZXJhdGVzIGEgdjQgc3BlY1xuXHRcdC8vIExlbmd0aCBmb3IgXCJSYW5kb20gVVVJRCBNb2RlXCIgaXMgc2V0IC0tIGlmIG5vdCBzZXQgaXQgdG8gOFxuXHRcdHRoaXMuX1VVSURMZW5ndGggPSAodHlwZW9mKHBTZXR0aW5ncykgPT09ICdvYmplY3QnKSAmJiAocFNldHRpbmdzLmhhc093blByb3BlcnR5KCdVVUlETGVuZ3RoJykpID8gKHBTZXR0aW5ncy5VVUlETGVuZ3RoICsgMCkgOiA4O1xuXHRcdC8vIERpY3Rpb25hcnkgZm9yIFwiUmFuZG9tIFVVSUQgTW9kZVwiXG5cdFx0dGhpcy5fVVVJRFJhbmRvbURpY3Rpb25hcnkgPSAodHlwZW9mKHBTZXR0aW5ncykgPT09ICdvYmplY3QnKSAmJiAocFNldHRpbmdzLmhhc093blByb3BlcnR5KCdVVUlERGljdGlvbmFyeScpKSA/IChwU2V0dGluZ3MuVVVJRERpY3Rpb25hcnkgKyAwKSA6ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWic7XG5cblx0XHR0aGlzLnJhbmRvbUJ5dGVHZW5lcmF0b3IgPSBuZXcgbGliUmFuZG9tQnl0ZUdlbmVyYXRvcigpO1xuXG5cdFx0Ly8gTG9va3VwIHRhYmxlIGZvciBoZXggY29kZXNcblx0XHR0aGlzLl9IZXhMb29rdXAgPSBbXTtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDI1NjsgKytpKVxuXHRcdHtcblx0XHRcdHRoaXMuX0hleExvb2t1cFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gQWRhcHRlZCBmcm9tIG5vZGUtdXVpZCAoaHR0cHM6Ly9naXRodWIuY29tL2tlbGVrdGl2L25vZGUtdXVpZClcblx0Ynl0ZXNUb1VVSUQocEJ1ZmZlcilcblx0e1xuXHRcdGxldCBpID0gMDtcblx0XHQvLyBqb2luIHVzZWQgdG8gZml4IG1lbW9yeSBpc3N1ZSBjYXVzZWQgYnkgY29uY2F0ZW5hdGlvbjogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzE3NSNjNFxuXHRcdHJldHVybiAoW1xuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCAnLScsXG5cdFx0XHRcdFx0dGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXVxuXHRcdFx0XHRdKS5qb2luKCcnKTtcblx0fVxuXG5cdC8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG5cdGdlbmVyYXRlVVVJRHY0KClcblx0e1xuXHRcdGxldCB0bXBCdWZmZXIgPSBuZXcgQXJyYXkoMTYpO1xuXHRcdHZhciB0bXBSYW5kb21CeXRlcyA9IHRoaXMucmFuZG9tQnl0ZUdlbmVyYXRvci5nZW5lcmF0ZSgpO1xuXG5cdFx0Ly8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuXHRcdHRtcFJhbmRvbUJ5dGVzWzZdID0gKHRtcFJhbmRvbUJ5dGVzWzZdICYgMHgwZikgfCAweDQwO1xuXHRcdHRtcFJhbmRvbUJ5dGVzWzhdID0gKHRtcFJhbmRvbUJ5dGVzWzhdICYgMHgzZikgfCAweDgwO1xuXG5cdFx0cmV0dXJuIHRoaXMuYnl0ZXNUb1VVSUQodG1wUmFuZG9tQnl0ZXMpO1xuXHR9XG5cblx0Ly8gU2ltcGxlIHJhbmRvbSBVVUlEIGdlbmVyYXRpb25cblx0Z2VuZXJhdGVSYW5kb20oKVxuXHR7XG5cdFx0bGV0IHRtcFVVSUQgPSAnJztcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fVVVJRExlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRtcFVVSUQgKz0gdGhpcy5fVVVJRFJhbmRvbURpY3Rpb25hcnkuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLl9VVUlEUmFuZG9tRGljdGlvbmFyeS5sZW5ndGgtMSkpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdG1wVVVJRDtcblx0fVxuXG5cdC8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG5cdGdldFVVSUQoKVxuXHR7XG5cdFx0aWYgKHRoaXMuX1VVSURNb2RlUmFuZG9tKVxuXHRcdHtcblx0XHRcdHJldHVybiB0aGlzLmdlbmVyYXRlUmFuZG9tKCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZW5lcmF0ZVVVSUR2NCgpO1xuXHRcdH1cblx0fVxufVxuXG4vLyBUaGlzIGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuZnVuY3Rpb24gYXV0b0NvbnN0cnVjdChwU2V0dGluZ3MpXG57XG5cdHJldHVybiBuZXcgRmFibGVVVUlEKHBTZXR0aW5ncyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7bmV3OmF1dG9Db25zdHJ1Y3QsIEZhYmxlVVVJRDpGYWJsZVVVSUR9O1xuIiwiLyoqXG4qIEJhc2UgTG9nZ2VyIENsYXNzXG4qXG4qIEBsaWNlbnNlIE1JVFxuKlxuKiBAYXV0aG9yIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cbmNvbnN0IGxpYkZhYmxlVVVJRCA9IG5ldyAocmVxdWlyZSgnZmFibGUtdXVpZCcpLkZhYmxlVVVJRCkoKTtcblxuY2xhc3MgQmFzZUxvZ2dlclxue1xuXHRjb25zdHJ1Y3RvcihwTG9nU3RyZWFtU2V0dGluZ3MsIHBGYWJsZUxvZylcblx0e1xuXHRcdC8vIFRoaXMgc2hvdWxkIG5vdCBwb3NzaWJseSBiZSBhYmxlIHRvIGJlIGluc3RhbnRpYXRlZCB3aXRob3V0IGEgc2V0dGluZ3Mgb2JqZWN0XG5cdFx0dGhpcy5fU2V0dGluZ3MgPSBwTG9nU3RyZWFtU2V0dGluZ3M7XG5cdFx0XG5cdFx0Ly8gVGhlIGJhc2UgbG9nZ2VyIGRvZXMgbm90aGluZyBidXQgYXNzb2NpYXRlIGEgVVVJRCB3aXRoIGl0c2VsZlxuXHRcdHRoaXMubG9nZ2VyVVVJRCA9IGxpYkZhYmxlVVVJRC5nZXRVVUlEKCk7XG5cdH1cblxuXHRpbml0aWFsaXplKClcblx0e1xuXHRcdC8vIE5vIG9wZXJhdGlvbi5cblx0fVxuXG5cdHRyYWNlKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcInRyYWNlXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdGRlYnVnKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcImRlYnVnXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdGluZm8ocExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHR0aGlzLndyaXRlKFwiaW5mb1wiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHR3YXJuKHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0dGhpcy53cml0ZShcIndhcm5cIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0ZXJyb3IocExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHR0aGlzLndyaXRlKFwiZXJyb3JcIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0ZmF0YWwocExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHR0aGlzLndyaXRlKFwiZmF0YWxcIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0d3JpdGUocExvZ0xldmVsLCBwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdC8vIFRoZSBiYXNlIGxvZ2dlciBkb2VzIG5vdGhpbmcuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlTG9nZ2VyO1xuIiwiLyoqXG4qIERlZmF1bHQgTG9nZ2VyIFByb3ZpZGVyIEZ1bmN0aW9uIC0tLSBCcm93c2VyXG4qXG4qIEBsaWNlbnNlIE1JVFxuKlxuKiBAYXV0aG9yIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKi9cblxuLy8gUmV0dXJuIHRoZSBwcm92aWRlcnMgdGhhdCBhcmUgYXZhaWxhYmxlIHdpdGhvdXQgZXh0ZW5zaW9ucyBsb2FkZWRcbmdldERlZmF1bHRQcm92aWRlcnMgPSAoKSA9Plxue1xuXHRsZXQgdG1wRGVmYXVsdFByb3ZpZGVycyA9IHt9O1xuXG5cdHRtcERlZmF1bHRQcm92aWRlcnMuY29uc29sZSA9IHJlcXVpcmUoJy4vRmFibGUtTG9nLUxvZ2dlci1Db25zb2xlLmpzJyk7XG5cblx0cmV0dXJuIHRtcERlZmF1bHRQcm92aWRlcnM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGVmYXVsdFByb3ZpZGVycygpOyIsIm1vZHVsZS5leHBvcnRzPVtcbiAgICB7XG4gICAgICAgIFwibG9nZ2VydHlwZVwiOiBcImNvbnNvbGVcIixcbiAgICAgICAgXCJzdHJlYW10eXBlXCI6IFwiY29uc29sZVwiLFxuICAgICAgICBcImxldmVsXCI6IFwidHJhY2VcIlxuICAgIH1cbl0iLCJsZXQgbGliQmFzZUxvZ2dlciA9IHJlcXVpcmUoJy4vRmFibGUtTG9nLUJhc2VMb2dnZXIuanMnKTtcblxuY2xhc3MgQ29uc29sZUxvZ2dlciBleHRlbmRzIGxpYkJhc2VMb2dnZXJcbntcblx0Y29uc3RydWN0b3IocExvZ1N0cmVhbVNldHRpbmdzLCBwRmFibGVMb2cpXG5cdHtcblx0XHRzdXBlcihwTG9nU3RyZWFtU2V0dGluZ3MpXG5cblx0XHR0aGlzLl9TaG93VGltZVN0YW1wcyA9IHBMb2dTdHJlYW1TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnU2hvd1RpbWVTdGFtcHMnKSA/IChwTG9nU3RyZWFtU2V0dGluZ3MuU2hvd1RpbWVTdGFtcHMgPT0gdHJ1ZSkgOiBmYWxzZTtcblx0XHR0aGlzLl9Gb3JtYXR0ZWRUaW1lU3RhbXBzID0gcExvZ1N0cmVhbVNldHRpbmdzLmhhc093blByb3BlcnR5KCdGb3JtYXR0ZWRUaW1lU3RhbXBzJykgPyAocExvZ1N0cmVhbVNldHRpbmdzLkZvcm1hdHRlZFRpbWVTdGFtcHMgPT0gdHJ1ZSkgOiBmYWxzZTtcblxuXHRcdHRoaXMuX0NvbnRleHRNZXNzYWdlID0gcExvZ1N0cmVhbVNldHRpbmdzLmhhc093blByb3BlcnR5KCdDb250ZXh0JykgPyBgICgke3BMb2dTdHJlYW1TZXR0aW5ncy5Db250ZXh0fSlgIDogXG5cdFx0XHRcdFx0XHRcdFx0cEZhYmxlTG9nLl9TZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnUHJvZHVjdCcpID8gYCAoJHtwRmFibGVMb2cuX1NldHRpbmdzLlByb2R1Y3R9KWAgOlxuXHRcdFx0XHRcdFx0XHRcdCcnO1xuXHR9XG5cblx0d3JpdGUocExldmVsLCBwTG9nVGV4dCwgcE9iamVjdClcblx0e1xuXHRcdGlmICh0aGlzLl9TaG93VGltZVN0YW1wcyAmJiB0aGlzLl9Gb3JtYXR0ZWRUaW1lU3RhbXBzKVxuXHRcdHtcblx0XHRcdGxldCB0bXBEYXRlID0gKG5ldyBEYXRlKCkpLnRvSVNPU3RyaW5nKCk7XG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0bXBEYXRlfSBbJHtwTGV2ZWx9XSR7dGhpcy5fQ29udGV4dE1lc3NhZ2V9ICR7cExvZ1RleHR9YCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRoaXMuX1Nob3dUaW1lU3RhbXBzKVxuXHRcdHtcblx0XHRcdGxldCB0bXBEYXRlID0gK25ldyBEYXRlKCk7XG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0bXBEYXRlfSBbJHtwTGV2ZWx9XSR7dGhpcy5fQ29udGV4dE1lc3NhZ2V9ICR7cExvZ1RleHR9YCk7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhgWyR7cExldmVsfV0ke3RoaXMuX0NvbnRleHRNZXNzYWdlfSAke3BMb2dUZXh0fWApO1xuXHRcdH1cblxuXHRcdC8vIFdyaXRlIG91dCB0aGUgb2JqZWN0IG9uIGEgc2VwYXJhdGUgbGluZSBpZiBpdCBpcyBwYXNzZWQgaW5cblx0XHRpZiAodHlwZW9mKHBPYmplY3QpICE9PSAndW5kZWZpbmVkJylcblx0XHR7XG5cdFx0XHRjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShwT2JqZWN0LCBudWxsLCA0KSk7XG5cdFx0fVxuXHR9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25zb2xlTG9nZ2VyOyIsIi8qKlxuKiBGYWJsZSBMb2dnaW5nIEFkZC1vblxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiogQG1vZHVsZSBGYWJsZSBMb2dnZXJcbiovXG5cbi8qKlxuKiBGYWJsZSBTb2x1dGlvbiBMb2cgV3JhcHBlciBNYWluIENsYXNzXG4qXG4qIEBjbGFzcyBGYWJsZUxvZ1xuKiBAY29uc3RydWN0b3JcbiovXG5jbGFzcyBGYWJsZUxvZ1xue1xuXHRjb25zdHJ1Y3RvcihwRmFibGVTZXR0aW5ncywgcEZhYmxlKVxuXHR7XG5cdFx0bGV0IHRtcFNldHRpbmdzID0gKHR5cGVvZihwRmFibGVTZXR0aW5ncykgPT09ICdvYmplY3QnKSA/IHBGYWJsZVNldHRpbmdzIDoge31cblx0XHR0aGlzLl9TZXR0aW5ncyA9IHRtcFNldHRpbmdzO1xuXG5cdFx0dGhpcy5fUHJvdmlkZXJzID0gcmVxdWlyZSgnLi9GYWJsZS1Mb2ctRGVmYXVsdFByb3ZpZGVycy5qcycpO1xuXG5cdFx0dGhpcy5fU3RyZWFtRGVmaW5pdGlvbnMgPSAodG1wU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ0xvZ1N0cmVhbXMnKSkgPyB0bXBTZXR0aW5ncy5Mb2dTdHJlYW1zIDogcmVxdWlyZSgnLi9GYWJsZS1Mb2ctRGVmYXVsdFN0cmVhbXMuanNvbicpO1xuXG5cdFx0dGhpcy5sb2dTdHJlYW1zID0gW107XG5cblx0XHQvLyBUaGlzIG9iamVjdCBnZXRzIGRlY29yYXRlZCBmb3Igb25lLXRpbWUgaW5zdGFudGlhdGVkIHByb3ZpZGVycyB0aGF0XG5cdFx0Ly8gIGhhdmUgbXVsdGlwbGUgb3V0cHV0cywgc3VjaCBhcyBidW55YW4uXG5cdFx0dGhpcy5sb2dQcm92aWRlcnMgPSB7fTtcblxuXHRcdC8vIEEgaGFzaCBsaXN0IG9mIHRoZSBHVUlEcyBmb3IgZWFjaCBsb2cgc3RyZWFtLCBzbyB0aGV5IGNhbid0IGJlIGFkZGVkIHRvIHRoZSBzZXQgbW9yZSB0aGFuIG9uZSB0aW1lXG5cdFx0dGhpcy5hY3RpdmVMb2dTdHJlYW1zID0ge307XG5cblx0XHR0aGlzLmxvZ1N0cmVhbXNUcmFjZSA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc0RlYnVnID0gW107XG5cdFx0dGhpcy5sb2dTdHJlYW1zSW5mbyA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc1dhcm4gPSBbXTtcblx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvciA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc0ZhdGFsID0gW107XG5cblx0XHR0aGlzLnV1aWQgPSAodHlwZW9mKHRtcFNldHRpbmdzLlByb2R1Y3QpID09PSAnc3RyaW5nJykgPyB0bXBTZXR0aW5ncy5Qcm9kdWN0IDogJ0RlZmF1bHQnO1xuXHR9XG5cblx0YWRkTG9nZ2VyKHBMb2dnZXIsIHBMZXZlbClcblx0e1xuXHRcdC8vIEJhaWwgb3V0IGlmIHdlJ3ZlIGFscmVhZHkgY3JlYXRlZCBvbmUuXG5cdFx0aWYgKHRoaXMuYWN0aXZlTG9nU3RyZWFtcy5oYXNPd25Qcm9wZXJ0eShwTG9nZ2VyLmxvZ2dlclVVSUQpKVxuXHRcdHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBBZGQgaXQgdG8gdGhlIHN0cmVhbXMgYW5kIHRvIHRoZSBtdXRleFxuXHRcdHRoaXMubG9nU3RyZWFtcy5wdXNoKHBMb2dnZXIpO1xuXHRcdHRoaXMuYWN0aXZlTG9nU3RyZWFtc1twTG9nZ2VyLmxvZ2dlclVVSURdID0gdHJ1ZTtcblxuXHRcdC8vIE1ha2Ugc3VyZSBhIGtvc2hlciBsZXZlbCB3YXMgcGFzc2VkIGluXG5cdFx0c3dpdGNoIChwTGV2ZWwpXG5cdFx0e1xuXHRcdFx0Y2FzZSAndHJhY2UnOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNUcmFjZS5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnZGVidWcnOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNEZWJ1Zy5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnaW5mbyc6XG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0luZm8ucHVzaChwTG9nZ2VyKTtcblx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNXYXJuLnB1c2gocExvZ2dlcik7XG5cdFx0XHRjYXNlICdlcnJvcic6XG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0Vycm9yLnB1c2gocExvZ2dlcik7XG5cdFx0XHRjYXNlICdmYXRhbCc6XG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0ZhdGFsLnB1c2gocExvZ2dlcik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0dHJhY2UocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dTdHJlYW1zVHJhY2UubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dTdHJlYW1zVHJhY2VbaV0udHJhY2UocE1lc3NhZ2UsIHBEYXR1bSk7XG5cdFx0fVxuXHR9XG5cblx0ZGVidWcocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dTdHJlYW1zRGVidWcubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dTdHJlYW1zRGVidWdbaV0uZGVidWcocE1lc3NhZ2UsIHBEYXR1bSk7XG5cdFx0fVxuXHR9XG5cblx0aW5mbyhwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNJbmZvLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0luZm9baV0uaW5mbyhwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHR3YXJuKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc1dhcm4ubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dTdHJlYW1zV2FybltpXS53YXJuKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGVycm9yKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc0Vycm9yLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0Vycm9yW2ldLmVycm9yKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGZhdGFsKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc0ZhdGFsLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0ZhdGFsW2ldLmZhdGFsKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGluaXRpYWxpemUoKVxuXHR7XG5cdFx0Ly8gXCJpbml0aWFsaXplXCIgZWFjaCBsb2dnZXIgYXMgZGVmaW5lZCBpbiB0aGUgbG9nZ2luZyBwYXJhbWV0ZXJzXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9TdHJlYW1EZWZpbml0aW9ucy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHRsZXQgdG1wU3RyZWFtRGVmaW5pdGlvbiA9IE9iamVjdC5hc3NpZ24oe2xvZ2dlcnR5cGU6J2NvbnNvbGUnLHN0cmVhbXR5cGU6J2NvbnNvbGUnLGxldmVsOidpbmZvJ30sdGhpcy5fU3RyZWFtRGVmaW5pdGlvbnNbaV0pO1xuXG5cdFx0XHRpZiAoIXRoaXMuX1Byb3ZpZGVycy5oYXNPd25Qcm9wZXJ0eSh0bXBTdHJlYW1EZWZpbml0aW9uLmxvZ2dlcnR5cGUpKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZyhgRXJyb3IgaW5pdGlhbGl6aW5nIGxvZyBzdHJlYW06IGJhZCBsb2dnZXJ0eXBlIGluIHN0cmVhbSBkZWZpbml0aW9uICR7SlNPTi5zdHJpbmdpZnkodG1wU3RyZWFtRGVmaW5pdGlvbil9YCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlXG5cdFx0XHR7XG5cdFx0XHRcdHRoaXMuYWRkTG9nZ2VyKG5ldyB0aGlzLl9Qcm92aWRlcnNbdG1wU3RyZWFtRGVmaW5pdGlvbi5sb2dnZXJ0eXBlXSh0bXBTdHJlYW1EZWZpbml0aW9uLCB0aGlzKSwgdG1wU3RyZWFtRGVmaW5pdGlvbi5sZXZlbCk7XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBOb3cgaW5pdGlhbGl6ZSBlYWNoIG9uZS5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtcy5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNbaV0uaW5pdGlhbGl6ZSgpO1xuXHRcdH1cblx0fVxuXG5cdGxvZ1RpbWUocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGxldCB0bXBNZXNzYWdlID0gKHR5cGVvZihwTWVzc2FnZSkgIT09ICd1bmRlZmluZWQnKSA/IHBNZXNzYWdlIDogJ1RpbWUnO1xuXHRcdGxldCB0bXBUaW1lID0gbmV3IERhdGUoKTtcblx0XHR0aGlzLmluZm8oYCR7dG1wTWVzc2FnZX0gJHt0bXBUaW1lfSAoZXBvY2ggJHsrdG1wVGltZX0pYCwgcERhdHVtKTtcblx0fVxuXG5cdC8vIEdldCBhIHRpbWVzdGFtcCBcblx0Z2V0VGltZVN0YW1wKClcblx0e1xuXHRcdHJldHVybiArbmV3IERhdGUoKTtcblx0fVxuXG5cdGdldFRpbWVEZWx0YShwVGltZVN0YW1wKVxuXHR7XG5cdFx0bGV0IHRtcEVuZFRpbWUgPSArbmV3IERhdGUoKTtcblx0XHRyZXR1cm4gdG1wRW5kVGltZS1wVGltZVN0YW1wO1xuXHR9XG5cblx0Ly8gTG9nIHRoZSBkZWx0YSBiZXR3ZWVuIGEgdGltZXN0YW1wLCBhbmQgbm93IHdpdGggYSBtZXNzYWdlXG5cdGxvZ1RpbWVEZWx0YShwVGltZURlbHRhLCBwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0bGV0IHRtcE1lc3NhZ2UgPSAodHlwZW9mKHBNZXNzYWdlKSAhPT0gJ3VuZGVmaW5lZCcpID8gcE1lc3NhZ2UgOiAnVGltZSBNZWFzdXJlbWVudCc7XG5cdFx0bGV0IHRtcERhdHVtID0gKHR5cGVvZihwRGF0dW0pID09PSAnb2JqZWN0JykgPyBwRGF0dW0gOiB7fTtcblxuXHRcdGxldCB0bXBFbmRUaW1lID0gK25ldyBEYXRlKCk7XG5cblx0XHR0aGlzLmluZm8oYCR7dG1wTWVzc2FnZX0gbG9nZ2VkIGF0IChlcG9jaCAkeyt0bXBFbmRUaW1lfSkgdG9vayAoJHtwVGltZURlbHRhfW1zKWAsIHBEYXR1bSk7XG5cdH1cblxuXHRsb2dUaW1lRGVsdGFIdW1hbihwVGltZURlbHRhLCBwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0bGV0IHRtcE1lc3NhZ2UgPSAodHlwZW9mKHBNZXNzYWdlKSAhPT0gJ3VuZGVmaW5lZCcpID8gcE1lc3NhZ2UgOiAnVGltZSBNZWFzdXJlbWVudCc7XG5cblx0XHRsZXQgdG1wRW5kVGltZSA9ICtuZXcgRGF0ZSgpO1xuXG5cdFx0bGV0IHRtcE1zID0gcGFyc2VJbnQocFRpbWVEZWx0YSUxMDAwKTtcblx0XHRsZXQgdG1wU2Vjb25kcyA9IHBhcnNlSW50KChwVGltZURlbHRhLzEwMDApJTYwKTtcblx0XHRsZXQgdG1wTWludXRlcyA9IHBhcnNlSW50KChwVGltZURlbHRhLygxMDAwKjYwKSklNjApO1xuXHRcdGxldCB0bXBIb3VycyA9IHBhcnNlSW50KHBUaW1lRGVsdGEvKDEwMDAqNjAqNjApKTtcblxuXHRcdHRtcE1zID0gKHRtcE1zIDwgMTApID8gXCIwMFwiK3RtcE1zIDogKHRtcE1zIDwgMTAwKSA/IFwiMFwiK3RtcE1zIDogdG1wTXM7XG5cdFx0dG1wU2Vjb25kcyA9ICh0bXBTZWNvbmRzIDwgMTApID8gXCIwXCIrdG1wU2Vjb25kcyA6IHRtcFNlY29uZHM7XG5cdFx0dG1wTWludXRlcyA9ICh0bXBNaW51dGVzIDwgMTApID8gXCIwXCIrdG1wTWludXRlcyA6IHRtcE1pbnV0ZXM7XG5cdFx0dG1wSG91cnMgPSAodG1wSG91cnMgPCAxMCkgPyBcIjBcIit0bXBIb3VycyA6IHRtcEhvdXJzO1xuXG5cdFx0dGhpcy5pbmZvKGAke3RtcE1lc3NhZ2V9IGxvZ2dlZCBhdCAoZXBvY2ggJHsrdG1wRW5kVGltZX0pIHRvb2sgKCR7cFRpbWVEZWx0YX1tcykgb3IgKCR7dG1wSG91cnN9OiR7dG1wTWludXRlc306JHt0bXBTZWNvbmRzfS4ke3RtcE1zfSlgLCBwRGF0dW0pO1xuXHR9XG5cblx0bG9nVGltZURlbHRhUmVsYXRpdmUocFN0YXJ0VGltZSwgcE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdHRoaXMubG9nVGltZURlbHRhKHRoaXMuZ2V0VGltZURlbHRhKHBTdGFydFRpbWUpLCBwTWVzc2FnZSwgcERhdHVtKTtcblx0fVxuXG5cdGxvZ1RpbWVEZWx0YVJlbGF0aXZlSHVtYW4ocFN0YXJ0VGltZSwgcE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdHRoaXMubG9nVGltZURlbHRhSHVtYW4odGhpcy5nZXRUaW1lRGVsdGEocFN0YXJ0VGltZSksIHBNZXNzYWdlLCBwRGF0dW0pO1xuXHR9XG59XG5cbi8vIFRoaXMgaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5mdW5jdGlvbiBhdXRvQ29uc3RydWN0KHBTZXR0aW5ncylcbntcblx0cmV0dXJuIG5ldyBGYWJsZUxvZyhwU2V0dGluZ3MpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge25ldzphdXRvQ29uc3RydWN0LCBGYWJsZUxvZzpGYWJsZUxvZ307XG4iXX0=
