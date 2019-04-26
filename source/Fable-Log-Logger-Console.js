let libBaseLogger = require('./Fable-Log-BaseLogger.js');

class ConsoleLogger extends libBaseLogger
{
	constructor(pSettings, pFableLog)
	{
		super(pSettings)

		this._Settings = (typeof(pSettings) === 'object') ? pSettings : {};

		this._ShowTimeStamps = pSettings.hasOwnProperty('ShowTimeStamps') ? (pSettings.ShowTimeStamps == true) : false;
		this._FormattedTimeStamps = pSettings.hasOwnProperty('FormattedTimeStamps') ? (pSettings.FormattedTimeStamps == true) : false;

		this._ContextMessage = pSettings.hasOwnProperty('Context') ? ` (${pSettings.Context})` : 
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