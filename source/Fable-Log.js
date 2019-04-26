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

		this.logStreams.push(pLogger);

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
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableLog(pSettings);
}


module.exports = {new:autoConstruct, FableLog:FableLog};
