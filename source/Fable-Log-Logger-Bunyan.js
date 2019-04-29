let libBaseLogger = require('./Fable-Log-BaseLogger.js');
let libBunyan = require('bunyan');

class BunyanLogger extends libBaseLogger
{
	constructor(pLogStreamSettings, pFableLog)
	{
		super(pLogStreamSettings);

		this._Settings = (typeof(pLogStreamSettings) === 'object') ? pLogStreamSettings : {};

		this._Product = pFableLog.uuid;

		this._LogProviders = pFableLog.logProviders;

		// Create a container to hold the log streams
		if (!pFableLog.logProviders.hasOwnProperty('bunyan_streams'))
		{
			pFableLog.logProviders.bunyan_streams = [];
		}
		// Create a container to hold bunyan
		if (!pFableLog.logProviders.hasOwnProperty('bunyan'))
		{
			pFableLog.logProviders.bunyan = false;
		}

		switch(pLogStreamSettings.streamtype)
		{
			case 'process.stdout':
			case 'stdout':
				// Add a stdout stream appender
				pFableLog.logProviders.bunyan_streams.push({ level:pLogStreamSettings.level, stream:process.stdout });
				break;
			case 'process.stderr':
			case 'stderr':
				// Add a stderr stream appender
				pFableLog.logProviders.bunyan_streams.push({ level:pLogStreamSettings.level, stream:process.stderr });
				break;
			case 'prettystream':
				// Add a "pretty stream" (which is like piping output through bunyan)
				let libPrettyStream = require('bunyan-prettystream');
				let tmpPrettyStream = new libPrettyStream();
				tmpPrettyStream.pipe(process.stdout);
				pFableLog.logProviders.bunyan_streams.push({ level:pLogStreamSettings.level, type:'raw', stream:tmpPrettyStream });
				break;
			case 'logstash':
				let libStash = require('bunyan-logstash-tcp');
				let tmpLogStashStream = libStash.createStream(
					{
						host: pLogStreamSettings.server || '127.0.0.1',
						port: pLogStreamSettings.port || 5000,
						max_connect_retries: -1,
						retry_interval: 5000
					});
				tmpLogStashStream.on('error', 
					(pError) =>
					{
						console.log('[fable-log] logstash Stream Error: ', pError);
					});
				this._LogStashStream = tmpLogStashStream;
				pFableLog.logProviders.bunyan_streams.push({ level:pLogStreamSettings.level, type: 'raw', stream:tmpLogStashStream });
				break;
			case 'file':
			default:
				if (pLogStreamSettings.hasOwnProperty('path'))
				{
					tmpStreams.push({ level:pLogStreamSettings.level, path:pLogStreamSettings.path});
				}
				else
				{
					// If no path was specified, just use stdout.
					pFableLog.logProviders.bunyan_streams.push({ level:pLogStreamSettings.level, stream:process.stdout });
				}
				break;
		}
	}

	initialize()
	{
		if (!this._LogProviders.bunyan)
		{
			this._LogProviders.bunyan = require('bunyan').createLogger(
				{
					name: this._Product,
					streams: this._LogProviders.bunyan_streams
				});
		}
	}

	info(pMessage, pDatum)
	{
		let tmpDatum = (typeof(pDatum) === 'undefined') ? {} : pDatum;
		let tmpMessage = (typeof(pMessage) !== 'string') ? '' : pMessage;

		this._LogProviders.bunyan.warn({Source:this._Product, datum:tmpDatum}, tmpMessage);
		return true;
	}
}

module.exports = BunyanLogger;