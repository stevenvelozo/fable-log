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