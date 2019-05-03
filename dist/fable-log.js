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
	constructor(pSettings, pFableLog)
	{
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

		this._Settings = (typeof(pLogStreamSettings) === 'object') ? pLogStreamSettings : {};

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
		let tmpLevel = (typeof(pLevel) === 'string') ? pLevel : 'info';

		// Bail out if we've already created one.
		if (this.activeLogStreams.hasOwnProperty(pLogger.loggerUUID))
		{
			return false;
		}

		// Add it to the streams and to the mutex
		this.logStreams.push(pLogger);
		this.activeLogStreams[pLogger.loggerUUID] = true;

		// Make sure a kosher level was passed in
		switch (tmpLevel)
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
			default:
				// By default (invalid string) make it an "info" logger
				this.logStreamsInfo.push(pLogger);
				this.logStreamsWarn.push(pLogger);
				this.logStreamsError.push(pLogger);
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
				return false;
			}

			this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);
		}

		// Now initialize each one.
		for (let i = 0; i < this.logStreams.length; i++)
		{
			this.logStreams[i].initialize();
		}
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableLog(pSettings);
}


module.exports = {new:autoConstruct, FableLog:FableLog};

},{"./Fable-Log-DefaultProviders.js":4,"./Fable-Log-DefaultStreams.json":5}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmFibGUtdXVpZC9zb3VyY2UvRmFibGUtVVVJRC1SYW5kb20tQnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9mYWJsZS11dWlkL3NvdXJjZS9GYWJsZS1VVUlELmpzIiwic291cmNlL0ZhYmxlLUxvZy1CYXNlTG9nZ2VyLmpzIiwic291cmNlL0ZhYmxlLUxvZy1EZWZhdWx0UHJvdmlkZXJzLUJyb3dzZXIuanMiLCJzb3VyY2UvRmFibGUtTG9nLURlZmF1bHRTdHJlYW1zLmpzb24iLCJzb3VyY2UvRmFibGUtTG9nLUxvZ2dlci1Db25zb2xlLmpzIiwic291cmNlL0ZhYmxlLUxvZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4qIFJhbmRvbSBCeXRlIEdlbmVyYXRvciAtIEJyb3dzZXIgdmVyc2lvblxuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5cbi8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG4vLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuY2xhc3MgUmFuZG9tQnl0ZXNcbntcblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cblx0XHQvLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cblx0XHQvLyBpbXBsZW1lbnRhdGlvbi4gQWxzbywgZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIG9uIElFMTEuXG5cdFx0dGhpcy5nZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICBcdFx0KHR5cGVvZihtc0NyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0bykpO1xuXHR9XG5cblx0Ly8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG5cdGdlbmVyYXRlV2hhdFdHQnl0ZXMoKVxuXHR7XG5cdFx0bGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG5cdFx0dGhpcy5nZXRSYW5kb21WYWx1ZXModG1wQnVmZmVyKTtcblx0XHRyZXR1cm4gdG1wQnVmZmVyO1xuXHR9XG5cblx0Ly8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuXHRnZW5lcmF0ZVJhbmRvbUJ5dGVzKClcblx0e1xuXHRcdC8vXG5cdFx0Ly8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcblx0XHQvLyBxdWFsaXR5LlxuXHRcdGxldCB0bXBCdWZmZXIgPSBuZXcgVWludDhBcnJheSgxNik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuXHRcdGZvciAobGV0IGkgPSAwLCB0bXBWYWx1ZTsgaSA8IDE2OyBpKyspXG5cdFx0e1xuXHRcdFx0aWYgKChpICYgMHgwMykgPT09IDApXG5cdFx0XHR7XG5cdFx0XHRcdHRtcFZhbHVlID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuXHRcdFx0fVxuXG5cdFx0XHR0bXBCdWZmZXJbaV0gPSB0bXBWYWx1ZSA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuXHRcdH1cblxuXHRcdHJldHVybiB0bXBCdWZmZXI7XG5cdH1cblxuXHRnZW5lcmF0ZSgpXG5cdHtcblx0XHRpZiAodGhpcy5nZXRSYW5kb21WYWx1ZXMpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIGdlbmVyYXRlV2hhdFdHQnl0ZXMoKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJldHVybiBnZW5lcmF0ZVJhbmRvbUJ5dGVzKCk7XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmFuZG9tQnl0ZXM7XG4iLCIvKipcbiogRmFibGUgVVVJRCBHZW5lcmF0b3JcbipcbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEBhdXRob3IgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qIEBtb2R1bGUgRmFibGUgVVVJRFxuKi9cblxuLyoqXG4qIEZhYmxlIFNvbHV0aW9uIFVVSUQgR2VuZXJhdGlvbiBNYWluIENsYXNzXG4qXG4qIEBjbGFzcyBGYWJsZVVVSURcbiogQGNvbnN0cnVjdG9yXG4qL1xuXG52YXIgbGliUmFuZG9tQnl0ZUdlbmVyYXRvciA9IHJlcXVpcmUoJy4vRmFibGUtVVVJRC1SYW5kb20uanMnKVxuXG5jbGFzcyBGYWJsZVVVSURcbntcblx0Y29uc3RydWN0b3IocFNldHRpbmdzKVxuXHR7XG5cdFx0Ly8gRGV0ZXJtaW5lIGlmIHRoZSBtb2R1bGUgaXMgaW4gXCJSYW5kb20gVVVJRCBNb2RlXCIgd2hpY2ggbWVhbnMganVzdCB1c2UgdGhlIHJhbmRvbSBjaGFyYWN0ZXIgZnVuY3Rpb24gcmF0aGVyIHRoYW4gdGhlIHY0IHJhbmRvbSBVVUlEIHNwZWMuXG5cdFx0Ly8gTm90ZSB0aGlzIGFsbG93cyBVVUlEcyBvZiB2YXJpb3VzIGxlbmd0aHMgKGluY2x1ZGluZyB2ZXJ5IHNob3J0IG9uZXMpIGFsdGhvdWdoIGd1YXJhbnRlZWQgdW5pcXVlbmVzcyBnb2VzIGRvd25oaWxsIGZhc3QuXG5cdFx0dGhpcy5fVVVJRE1vZGVSYW5kb20gPSAodHlwZW9mKHBTZXR0aW5ncykgPT09ICdvYmplY3QnKSAmJiAocFNldHRpbmdzLmhhc093blByb3BlcnR5KCdVVUlETW9kZVJhbmRvbScpKSA/IChwU2V0dGluZ3MuVVVJRE1vZGVSYW5kb20gPT0gdHJ1ZSkgOiBmYWxzZTtcblx0XHQvLyBUaGVzZSB0d28gcHJvcGVydGllcyBhcmUgb25seSB1c2VmdWwgaWYgd2UgYXJlIGluIFJhbmRvbSBtb2RlLiAgT3RoZXJ3aXNlIGl0IGdlbmVyYXRlcyBhIHY0IHNwZWNcblx0XHQvLyBMZW5ndGggZm9yIFwiUmFuZG9tIFVVSUQgTW9kZVwiIGlzIHNldCAtLSBpZiBub3Qgc2V0IGl0IHRvIDhcblx0XHR0aGlzLl9VVUlETGVuZ3RoID0gKHR5cGVvZihwU2V0dGluZ3MpID09PSAnb2JqZWN0JykgJiYgKHBTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnVVVJRExlbmd0aCcpKSA/IChwU2V0dGluZ3MuVVVJRExlbmd0aCArIDApIDogODtcblx0XHQvLyBEaWN0aW9uYXJ5IGZvciBcIlJhbmRvbSBVVUlEIE1vZGVcIlxuXHRcdHRoaXMuX1VVSURSYW5kb21EaWN0aW9uYXJ5ID0gKHR5cGVvZihwU2V0dGluZ3MpID09PSAnb2JqZWN0JykgJiYgKHBTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnVVVJRERpY3Rpb25hcnknKSkgPyAocFNldHRpbmdzLlVVSUREaWN0aW9uYXJ5ICsgMCkgOiAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonO1xuXG5cdFx0dGhpcy5yYW5kb21CeXRlR2VuZXJhdG9yID0gbmV3IGxpYlJhbmRvbUJ5dGVHZW5lcmF0b3IoKTtcblxuXHRcdC8vIExvb2t1cCB0YWJsZSBmb3IgaGV4IGNvZGVzXG5cdFx0dGhpcy5fSGV4TG9va3VwID0gW107XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAyNTY7ICsraSlcblx0XHR7XG5cdFx0XHR0aGlzLl9IZXhMb29rdXBbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xuXHRcdH1cblx0fVxuXG5cdC8vIEFkYXB0ZWQgZnJvbSBub2RlLXV1aWQgKGh0dHBzOi8vZ2l0aHViLmNvbS9rZWxla3Rpdi9ub2RlLXV1aWQpXG5cdGJ5dGVzVG9VVUlEKHBCdWZmZXIpXG5cdHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0Ly8gam9pbiB1c2VkIHRvIGZpeCBtZW1vcnkgaXNzdWUgY2F1c2VkIGJ5IGNvbmNhdGVuYXRpb246IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxNzUjYzRcblx0XHRyZXR1cm4gKFtcblx0XHRcdFx0XHR0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgJy0nLFxuXHRcdFx0XHRcdHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV0sIHRoaXMuX0hleExvb2t1cFtwQnVmZmVyW2krK11dLCB0aGlzLl9IZXhMb29rdXBbcEJ1ZmZlcltpKytdXSwgdGhpcy5fSGV4TG9va3VwW3BCdWZmZXJbaSsrXV1cblx0XHRcdFx0XSkuam9pbignJyk7XG5cdH1cblxuXHQvLyBBZGFwdGVkIGZyb20gbm9kZS11dWlkIChodHRwczovL2dpdGh1Yi5jb20va2VsZWt0aXYvbm9kZS11dWlkKVxuXHRnZW5lcmF0ZVVVSUR2NCgpXG5cdHtcblx0XHRsZXQgdG1wQnVmZmVyID0gbmV3IEFycmF5KDE2KTtcblx0XHR2YXIgdG1wUmFuZG9tQnl0ZXMgPSB0aGlzLnJhbmRvbUJ5dGVHZW5lcmF0b3IuZ2VuZXJhdGUoKTtcblxuXHRcdC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcblx0XHR0bXBSYW5kb21CeXRlc1s2XSA9ICh0bXBSYW5kb21CeXRlc1s2XSAmIDB4MGYpIHwgMHg0MDtcblx0XHR0bXBSYW5kb21CeXRlc1s4XSA9ICh0bXBSYW5kb21CeXRlc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuXHRcdHJldHVybiB0aGlzLmJ5dGVzVG9VVUlEKHRtcFJhbmRvbUJ5dGVzKTtcblx0fVxuXG5cdC8vIFNpbXBsZSByYW5kb20gVVVJRCBnZW5lcmF0aW9uXG5cdGdlbmVyYXRlUmFuZG9tKClcblx0e1xuXHRcdGxldCB0bXBVVUlEID0gJyc7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX1VVSURMZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0bXBVVUlEICs9IHRoaXMuX1VVSURSYW5kb21EaWN0aW9uYXJ5LmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5fVVVJRFJhbmRvbURpY3Rpb25hcnkubGVuZ3RoLTEpKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRtcFVVSUQ7XG5cdH1cblxuXHQvLyBBZGFwdGVkIGZyb20gbm9kZS11dWlkIChodHRwczovL2dpdGh1Yi5jb20va2VsZWt0aXYvbm9kZS11dWlkKVxuXHRnZXRVVUlEKClcblx0e1xuXHRcdGlmICh0aGlzLl9VVUlETW9kZVJhbmRvbSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gdGhpcy5nZW5lcmF0ZVJhbmRvbSgpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHRoaXMuZ2VuZXJhdGVVVUlEdjQoKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gVGhpcyBpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbmZ1bmN0aW9uIGF1dG9Db25zdHJ1Y3QocFNldHRpbmdzKVxue1xuXHRyZXR1cm4gbmV3IEZhYmxlVVVJRChwU2V0dGluZ3MpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge25ldzphdXRvQ29uc3RydWN0LCBGYWJsZVVVSUQ6RmFibGVVVUlEfTtcbiIsIi8qKlxuKiBCYXNlIExvZ2dlciBDbGFzc1xuKlxuKiBAbGljZW5zZSBNSVRcbipcbiogQGF1dGhvciBTdGV2ZW4gVmVsb3pvIDxzdGV2ZW5AdmVsb3pvLmNvbT5cbiovXG5jb25zdCBsaWJGYWJsZVVVSUQgPSBuZXcgKHJlcXVpcmUoJ2ZhYmxlLXV1aWQnKS5GYWJsZVVVSUQpKCk7XG5cbmNsYXNzIEJhc2VMb2dnZXJcbntcblx0Y29uc3RydWN0b3IocFNldHRpbmdzLCBwRmFibGVMb2cpXG5cdHtcblx0XHQvLyBUaGUgYmFzZSBsb2dnZXIgZG9lcyBub3RoaW5nIGJ1dCBhc3NvY2lhdGUgYSBVVUlEIHdpdGggaXRzZWxmXG5cdFx0dGhpcy5sb2dnZXJVVUlEID0gbGliRmFibGVVVUlELmdldFVVSUQoKTtcblx0fVxuXG5cdGluaXRpYWxpemUoKVxuXHR7XG5cdFx0Ly8gTm8gb3BlcmF0aW9uLlxuXHR9XG5cblx0dHJhY2UocExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHR0aGlzLndyaXRlKFwidHJhY2VcIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0ZGVidWcocExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHR0aGlzLndyaXRlKFwiZGVidWdcIiwgcExvZ1RleHQsIHBMb2dPYmplY3QpO1xuXHR9XG5cblx0aW5mbyhwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJpbmZvXCIsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KTtcblx0fVxuXG5cdHdhcm4ocExvZ1RleHQsIHBMb2dPYmplY3QpXG5cdHtcblx0XHR0aGlzLndyaXRlKFwid2FyblwiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHRlcnJvcihwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJlcnJvclwiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHRmYXRhbChwTG9nVGV4dCwgcExvZ09iamVjdClcblx0e1xuXHRcdHRoaXMud3JpdGUoXCJmYXRhbFwiLCBwTG9nVGV4dCwgcExvZ09iamVjdCk7XG5cdH1cblxuXHR3cml0ZShwTG9nTGV2ZWwsIHBMb2dUZXh0LCBwTG9nT2JqZWN0KVxuXHR7XG5cdFx0Ly8gVGhlIGJhc2UgbG9nZ2VyIGRvZXMgbm90aGluZy5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VMb2dnZXI7XG4iLCIvKipcbiogRGVmYXVsdCBMb2dnZXIgUHJvdmlkZXIgRnVuY3Rpb24gLS0tIEJyb3dzZXJcbipcbiogQGxpY2Vuc2UgTUlUXG4qXG4qIEBhdXRob3IgU3RldmVuIFZlbG96byA8c3RldmVuQHZlbG96by5jb20+XG4qL1xuXG4vLyBSZXR1cm4gdGhlIHByb3ZpZGVycyB0aGF0IGFyZSBhdmFpbGFibGUgd2l0aG91dCBleHRlbnNpb25zIGxvYWRlZFxuZ2V0RGVmYXVsdFByb3ZpZGVycyA9ICgpID0+XG57XG5cdGxldCB0bXBEZWZhdWx0UHJvdmlkZXJzID0ge307XG5cblx0dG1wRGVmYXVsdFByb3ZpZGVycy5jb25zb2xlID0gcmVxdWlyZSgnLi9GYWJsZS1Mb2ctTG9nZ2VyLUNvbnNvbGUuanMnKTtcblxuXHRyZXR1cm4gdG1wRGVmYXVsdFByb3ZpZGVycztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXREZWZhdWx0UHJvdmlkZXJzKCk7IiwibW9kdWxlLmV4cG9ydHM9W1xuICAgIHtcbiAgICAgICAgXCJsb2dnZXJ0eXBlXCI6IFwiY29uc29sZVwiLFxuICAgICAgICBcInN0cmVhbXR5cGVcIjogXCJjb25zb2xlXCIsXG4gICAgICAgIFwibGV2ZWxcIjogXCJ0cmFjZVwiXG4gICAgfVxuXSIsImxldCBsaWJCYXNlTG9nZ2VyID0gcmVxdWlyZSgnLi9GYWJsZS1Mb2ctQmFzZUxvZ2dlci5qcycpO1xuXG5jbGFzcyBDb25zb2xlTG9nZ2VyIGV4dGVuZHMgbGliQmFzZUxvZ2dlclxue1xuXHRjb25zdHJ1Y3RvcihwTG9nU3RyZWFtU2V0dGluZ3MsIHBGYWJsZUxvZylcblx0e1xuXHRcdHN1cGVyKHBMb2dTdHJlYW1TZXR0aW5ncylcblxuXHRcdHRoaXMuX1NldHRpbmdzID0gKHR5cGVvZihwTG9nU3RyZWFtU2V0dGluZ3MpID09PSAnb2JqZWN0JykgPyBwTG9nU3RyZWFtU2V0dGluZ3MgOiB7fTtcblxuXHRcdHRoaXMuX1Nob3dUaW1lU3RhbXBzID0gcExvZ1N0cmVhbVNldHRpbmdzLmhhc093blByb3BlcnR5KCdTaG93VGltZVN0YW1wcycpID8gKHBMb2dTdHJlYW1TZXR0aW5ncy5TaG93VGltZVN0YW1wcyA9PSB0cnVlKSA6IGZhbHNlO1xuXHRcdHRoaXMuX0Zvcm1hdHRlZFRpbWVTdGFtcHMgPSBwTG9nU3RyZWFtU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ0Zvcm1hdHRlZFRpbWVTdGFtcHMnKSA/IChwTG9nU3RyZWFtU2V0dGluZ3MuRm9ybWF0dGVkVGltZVN0YW1wcyA9PSB0cnVlKSA6IGZhbHNlO1xuXG5cdFx0dGhpcy5fQ29udGV4dE1lc3NhZ2UgPSBwTG9nU3RyZWFtU2V0dGluZ3MuaGFzT3duUHJvcGVydHkoJ0NvbnRleHQnKSA/IGAgKCR7cExvZ1N0cmVhbVNldHRpbmdzLkNvbnRleHR9KWAgOiBcblx0XHRcdFx0XHRcdFx0XHRwRmFibGVMb2cuX1NldHRpbmdzLmhhc093blByb3BlcnR5KCdQcm9kdWN0JykgPyBgICgke3BGYWJsZUxvZy5fU2V0dGluZ3MuUHJvZHVjdH0pYCA6XG5cdFx0XHRcdFx0XHRcdFx0Jyc7XG5cdH1cblxuXHR3cml0ZShwTGV2ZWwsIHBMb2dUZXh0LCBwT2JqZWN0KVxuXHR7XG5cdFx0aWYgKHRoaXMuX1Nob3dUaW1lU3RhbXBzICYmIHRoaXMuX0Zvcm1hdHRlZFRpbWVTdGFtcHMpXG5cdFx0e1xuXHRcdFx0bGV0IHRtcERhdGUgPSAobmV3IERhdGUoKSkudG9JU09TdHJpbmcoKTtcblx0XHRcdGNvbnNvbGUubG9nKGAke3RtcERhdGV9IFske3BMZXZlbH1dJHt0aGlzLl9Db250ZXh0TWVzc2FnZX0gJHtwTG9nVGV4dH1gKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodGhpcy5fU2hvd1RpbWVTdGFtcHMpXG5cdFx0e1xuXHRcdFx0bGV0IHRtcERhdGUgPSArbmV3IERhdGUoKTtcblx0XHRcdGNvbnNvbGUubG9nKGAke3RtcERhdGV9IFske3BMZXZlbH1dJHt0aGlzLl9Db250ZXh0TWVzc2FnZX0gJHtwTG9nVGV4dH1gKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGNvbnNvbGUubG9nKGBbJHtwTGV2ZWx9XSR7dGhpcy5fQ29udGV4dE1lc3NhZ2V9ICR7cExvZ1RleHR9YCk7XG5cdFx0fVxuXG5cdFx0Ly8gV3JpdGUgb3V0IHRoZSBvYmplY3Qgb24gYSBzZXBhcmF0ZSBsaW5lIGlmIGl0IGlzIHBhc3NlZCBpblxuXHRcdGlmICh0eXBlb2YocE9iamVjdCkgIT09ICd1bmRlZmluZWQnKVxuXHRcdHtcblx0XHRcdGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHBPYmplY3QsIG51bGwsIDQpKTtcblx0XHR9XG5cdH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnNvbGVMb2dnZXI7IiwiLyoqXG4qIEZhYmxlIExvZ2dpbmcgQWRkLW9uXG4qXG4qIEBsaWNlbnNlIE1JVFxuKlxuKiBAYXV0aG9yIFN0ZXZlbiBWZWxvem8gPHN0ZXZlbkB2ZWxvem8uY29tPlxuKiBAbW9kdWxlIEZhYmxlIExvZ2dlclxuKi9cblxuLyoqXG4qIEZhYmxlIFNvbHV0aW9uIExvZyBXcmFwcGVyIE1haW4gQ2xhc3NcbipcbiogQGNsYXNzIEZhYmxlTG9nXG4qIEBjb25zdHJ1Y3RvclxuKi9cbmNsYXNzIEZhYmxlTG9nXG57XG5cdGNvbnN0cnVjdG9yKHBGYWJsZVNldHRpbmdzLCBwRmFibGUpXG5cdHtcblx0XHRsZXQgdG1wU2V0dGluZ3MgPSAodHlwZW9mKHBGYWJsZVNldHRpbmdzKSA9PT0gJ29iamVjdCcpID8gcEZhYmxlU2V0dGluZ3MgOiB7fVxuXHRcdHRoaXMuX1NldHRpbmdzID0gdG1wU2V0dGluZ3M7XG5cblx0XHR0aGlzLl9Qcm92aWRlcnMgPSByZXF1aXJlKCcuL0ZhYmxlLUxvZy1EZWZhdWx0UHJvdmlkZXJzLmpzJyk7XG5cblx0XHR0aGlzLl9TdHJlYW1EZWZpbml0aW9ucyA9ICh0bXBTZXR0aW5ncy5oYXNPd25Qcm9wZXJ0eSgnTG9nU3RyZWFtcycpKSA/IHRtcFNldHRpbmdzLkxvZ1N0cmVhbXMgOiByZXF1aXJlKCcuL0ZhYmxlLUxvZy1EZWZhdWx0U3RyZWFtcy5qc29uJyk7XG5cblx0XHR0aGlzLmxvZ1N0cmVhbXMgPSBbXTtcblxuXHRcdC8vIFRoaXMgb2JqZWN0IGdldHMgZGVjb3JhdGVkIGZvciBvbmUtdGltZSBpbnN0YW50aWF0ZWQgcHJvdmlkZXJzIHRoYXRcblx0XHQvLyAgaGF2ZSBtdWx0aXBsZSBvdXRwdXRzLCBzdWNoIGFzIGJ1bnlhbi5cblx0XHR0aGlzLmxvZ1Byb3ZpZGVycyA9IHt9O1xuXG5cdFx0Ly8gQSBoYXNoIGxpc3Qgb2YgdGhlIEdVSURzIGZvciBlYWNoIGxvZyBzdHJlYW0sIHNvIHRoZXkgY2FuJ3QgYmUgYWRkZWQgdG8gdGhlIHNldCBtb3JlIHRoYW4gb25lIHRpbWVcblx0XHR0aGlzLmFjdGl2ZUxvZ1N0cmVhbXMgPSB7fTtcblxuXHRcdHRoaXMubG9nU3RyZWFtc1RyYWNlID0gW107XG5cdFx0dGhpcy5sb2dTdHJlYW1zRGVidWcgPSBbXTtcblx0XHR0aGlzLmxvZ1N0cmVhbXNJbmZvID0gW107XG5cdFx0dGhpcy5sb2dTdHJlYW1zV2FybiA9IFtdO1xuXHRcdHRoaXMubG9nU3RyZWFtc0Vycm9yID0gW107XG5cdFx0dGhpcy5sb2dTdHJlYW1zRmF0YWwgPSBbXTtcblxuXHRcdHRoaXMudXVpZCA9ICh0eXBlb2YodG1wU2V0dGluZ3MuUHJvZHVjdCkgPT09ICdzdHJpbmcnKSA/IHRtcFNldHRpbmdzLlByb2R1Y3QgOiAnRGVmYXVsdCc7XG5cdH1cblxuXHRhZGRMb2dnZXIocExvZ2dlciwgcExldmVsKVxuXHR7XG5cdFx0bGV0IHRtcExldmVsID0gKHR5cGVvZihwTGV2ZWwpID09PSAnc3RyaW5nJykgPyBwTGV2ZWwgOiAnaW5mbyc7XG5cblx0XHQvLyBCYWlsIG91dCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgb25lLlxuXHRcdGlmICh0aGlzLmFjdGl2ZUxvZ1N0cmVhbXMuaGFzT3duUHJvcGVydHkocExvZ2dlci5sb2dnZXJVVUlEKSlcblx0XHR7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIGl0IHRvIHRoZSBzdHJlYW1zIGFuZCB0byB0aGUgbXV0ZXhcblx0XHR0aGlzLmxvZ1N0cmVhbXMucHVzaChwTG9nZ2VyKTtcblx0XHR0aGlzLmFjdGl2ZUxvZ1N0cmVhbXNbcExvZ2dlci5sb2dnZXJVVUlEXSA9IHRydWU7XG5cblx0XHQvLyBNYWtlIHN1cmUgYSBrb3NoZXIgbGV2ZWwgd2FzIHBhc3NlZCBpblxuXHRcdHN3aXRjaCAodG1wTGV2ZWwpXG5cdFx0e1xuXHRcdFx0Y2FzZSAndHJhY2UnOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNUcmFjZS5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnZGVidWcnOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNEZWJ1Zy5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0Y2FzZSAnaW5mbyc6XG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0luZm8ucHVzaChwTG9nZ2VyKTtcblx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNXYXJuLnB1c2gocExvZ2dlcik7XG5cdFx0XHRjYXNlICdlcnJvcic6XG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0Vycm9yLnB1c2gocExvZ2dlcik7XG5cdFx0XHRjYXNlICdmYXRhbCc6XG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0ZhdGFsLnB1c2gocExvZ2dlcik7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gQnkgZGVmYXVsdCAoaW52YWxpZCBzdHJpbmcpIG1ha2UgaXQgYW4gXCJpbmZvXCIgbG9nZ2VyXG5cdFx0XHRcdHRoaXMubG9nU3RyZWFtc0luZm8ucHVzaChwTG9nZ2VyKTtcblx0XHRcdFx0dGhpcy5sb2dTdHJlYW1zV2Fybi5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvci5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0XHR0aGlzLmxvZ1N0cmVhbXNGYXRhbC5wdXNoKHBMb2dnZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHRyYWNlKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc1RyYWNlLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc1RyYWNlW2ldLnRyYWNlKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGRlYnVnKHBNZXNzYWdlLCBwRGF0dW0pXG5cdHtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9nU3RyZWFtc0RlYnVnLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc0RlYnVnW2ldLmRlYnVnKHBNZXNzYWdlLCBwRGF0dW0pO1xuXHRcdH1cblx0fVxuXG5cdGluZm8ocE1lc3NhZ2UsIHBEYXR1bSlcblx0e1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2dTdHJlYW1zSW5mby5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNJbmZvW2ldLmluZm8ocE1lc3NhZ2UsIHBEYXR1bSk7XG5cdFx0fVxuXHR9XG5cblx0d2FybihwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNXYXJuLmxlbmd0aDsgaSsrKVxuXHRcdHtcblx0XHRcdHRoaXMubG9nU3RyZWFtc1dhcm5baV0ud2FybihwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRlcnJvcihwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNFcnJvci5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNFcnJvcltpXS5lcnJvcihwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRmYXRhbChwTWVzc2FnZSwgcERhdHVtKVxuXHR7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXNGYXRhbC5sZW5ndGg7IGkrKylcblx0XHR7XG5cdFx0XHR0aGlzLmxvZ1N0cmVhbXNGYXRhbFtpXS5mYXRhbChwTWVzc2FnZSwgcERhdHVtKTtcblx0XHR9XG5cdH1cblxuXHRpbml0aWFsaXplKClcblx0e1xuXHRcdC8vIFwiaW5pdGlhbGl6ZVwiIGVhY2ggbG9nZ2VyIGFzIGRlZmluZWQgaW4gdGhlIGxvZ2dpbmcgcGFyYW1ldGVyc1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fU3RyZWFtRGVmaW5pdGlvbnMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0bGV0IHRtcFN0cmVhbURlZmluaXRpb24gPSBPYmplY3QuYXNzaWduKHtsb2dnZXJ0eXBlOidjb25zb2xlJyxzdHJlYW10eXBlOidjb25zb2xlJyxsZXZlbDonaW5mbyd9LHRoaXMuX1N0cmVhbURlZmluaXRpb25zW2ldKTtcblxuXHRcdFx0aWYgKCF0aGlzLl9Qcm92aWRlcnMuaGFzT3duUHJvcGVydHkodG1wU3RyZWFtRGVmaW5pdGlvbi5sb2dnZXJ0eXBlKSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coYEVycm9yIGluaXRpYWxpemluZyBsb2cgc3RyZWFtOiBiYWQgbG9nZ2VydHlwZSBpbiBzdHJlYW0gZGVmaW5pdGlvbiAke0pTT04uc3RyaW5naWZ5KHRtcFN0cmVhbURlZmluaXRpb24pfWApO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuYWRkTG9nZ2VyKG5ldyB0aGlzLl9Qcm92aWRlcnNbdG1wU3RyZWFtRGVmaW5pdGlvbi5sb2dnZXJ0eXBlXSh0bXBTdHJlYW1EZWZpbml0aW9uLCB0aGlzKSwgdG1wU3RyZWFtRGVmaW5pdGlvbi5sZXZlbCk7XG5cdFx0fVxuXG5cdFx0Ly8gTm93IGluaXRpYWxpemUgZWFjaCBvbmUuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvZ1N0cmVhbXMubGVuZ3RoOyBpKyspXG5cdFx0e1xuXHRcdFx0dGhpcy5sb2dTdHJlYW1zW2ldLmluaXRpYWxpemUoKTtcblx0XHR9XG5cdH1cbn1cblxuLy8gVGhpcyBpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbmZ1bmN0aW9uIGF1dG9Db25zdHJ1Y3QocFNldHRpbmdzKVxue1xuXHRyZXR1cm4gbmV3IEZhYmxlTG9nKHBTZXR0aW5ncyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7bmV3OmF1dG9Db25zdHJ1Y3QsIEZhYmxlTG9nOkZhYmxlTG9nfTtcbiJdfQ==
