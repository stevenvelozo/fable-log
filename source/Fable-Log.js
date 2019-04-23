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
		: logInfo,
warn: logWarn,
error: logError,
fatal: logFatal,

			new: createNew
		});
}

// This is for backwards compatibility
function autoConstruct(pSettings)
{
	return new FableLog(pSettings);
}


module.exports = {new:autoConstruct, FableLog:FableLog};
