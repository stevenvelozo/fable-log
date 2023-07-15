let libBaseLogger = require('./Fable-Log-BaseLogger.js');

class ConsoleLogger extends libBaseLogger
{
	constructor(pLogStreamSettings, pFableLog)
	{
		super(pLogStreamSettings);

		this._ShowTimeStamps = this._Settings.hasOwnProperty('showtimestamps') ? (this._Settings.showtimestamps == true) : true;
		this._FormattedTimeStamps = this._Settings.hasOwnProperty('formattedtimestamps') ? (this._Settings.formattedtimestamps == true) : true;

		this._ContextMessage = this._Settings.hasOwnProperty('Context') ? `(${this._Settings.Context})` :
								pFableLog._Settings.hasOwnProperty('Product') ? `(${pFableLog._Settings.Product})` :
								'Unnamed_Log_Context';

		// Allow the user to decide what gets output to the console
		this._OutputLogLinesToConsole = this._Settings.hasOwnProperty('outputloglinestoconsole') ? this._Settings.outputloglinestoconsole : true;
		this._OutputObjectsToConsole = this._Settings.hasOwnProperty('outputobjectstoconsole') ? this._Settings.outputobjectstoconsole : true;

		// Precompute the prefix for each level
		this.prefixCache = {};
		for (let i = 0; i <= this.levels.length; i++)
		{
			this.prefixCache[this.levels[i]] = `[${this.levels[i]}] ${this._ContextMessage}: `;

			if (this._ShowTimeStamps)
			{
				// If there is a timestamp we need a to prepend space before the prefixcache string, since the timestamp comes first
				this.prefixCache[this.levels[i]] = ' '+this.prefixCache[this.levels[i]];
			}
		}
	}

	write(pLevel, pLogText, pObject)
	{
		let tmpTimeStamp = '';
		if (this._ShowTimeStamps && this._FormattedTimeStamps)
		{
			tmpTimeStamp = (new Date()).toISOString();
		}
		else if (this._ShowTimeStamps)
		{
			tmpTimeStamp = +new Date();
		}

		let tmpLogLine = `${tmpTimeStamp}${this.prefixCache[pLevel]}${pLogText}`;

		if (this._OutputLogLinesToConsole)
		{
			console.log(tmpLogLine);
		}

		// Write out the object on a separate line if it is passed in
		if (this._OutputObjectsToConsole && (typeof(pObject) !== 'undefined'))
		{
			console.log(JSON.stringify(pObject, null, 2));
		}

		// Provide an easy way to be overridden and be consistent
		return tmpLogLine;
	}
}

module.exports = ConsoleLogger;