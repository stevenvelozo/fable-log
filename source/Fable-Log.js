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
		this._Settings = (typeof(pFableSettings) !== 'object') ? pFableSettings : {};

		this.loggersTrace = [];
		this.loggersDebug = [];
		this.loggersInfo = [];
		this.loggersWarn = [];
		this.loggersError = [];
		this.loggersFatal = [];
	}

	addLogger(pLogger, pLevel)
	{
		let tmpLevel = (typeof(pLevel) === 'string') ? pLevel : 'info';

		// Make sure a kosher level was passed in
		switch (tmpLevel)
		{
			case 'trace':
				this.loggersTrace.push(pLogger);
			case 'debug':
				this.loggersDebug.push(pLogger);
			case 'info':
				this.loggersInfo.push(pLogger);
			case 'warn':
				this.loggersWarn.push(pLogger);
			case 'error':
				this.loggersError.push(pLogger);
			case 'fatal':
				this.loggersFatal.push(pLogger);
				break;
			default:
				// By default (invalid string) make it an "info" logger
				this.loggersInfo.push(pLogger);
				this.loggersWarn.push(pLogger);
				this.loggersError.push(pLogger);
				this.loggersFatal.push(pLogger);
				break;
		}
	}

	trace(pMessage, pDatum)
	{
		for (let i = 0; i < this.loggersTrace.length; i++)
		{
			this.loggersTrace.trace(pMessage, pDatum);
		}
	}

	debug(pMessage, pDatum)
	{
		for (let i = 0; i < this.loggersDebug.length; i++)
		{
			this.loggersDebug.debug(pMessage,pDatum);
		}
	}

	info(pMessage, pDatum)
	{
		for (let i = 0; i < this.loggersInfo.length; i++)
		{
			this.loggersInfo.debug(pMessage,pDatum);
		}
	}

	warn(pMessage, pDatum)
	{
		for (let i = 0; i < this.loggersWarn.length; i++)
		{
			this.loggersWarn.debug(pMessage,pDatum);
		}
	}

	error(pMessage, pDatum)
	{
		for (let i = 0; i < this.loggersError.length; i++)
		{
			this.loggersError.debug(pMessage,pDatum);
		}
	}

	fatal(pMessage, pDatum)
	{
		for (let i = 0; i < this.loggersFatal.length; i++)
		{
			this.loggersFatal.debug(pMessage,pDatum);
		}
	}

	initialize()
	{
		// "initialize" each logger.
	}
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableLog(pSettings);
}


module.exports = {new:autoConstruct, FableLog:FableLog};
