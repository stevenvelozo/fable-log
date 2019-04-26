let libBaseLogger = require('./Fable-Log-BaseLogger.js');
let libBunyan = require('bunyan');

class ConsoleLogger extends libBaseLogger
{
	constructor(pSettings, pFableLog)
	{
		super(pSettings);

		this._Settings = (typeof(pSettings) === 'object') ? pSettings : {};

		this._Product = pFableLog._Settings.hasOwnProperty('Product') ? ` (${pFableLog._Settings.Product})` : 'Default';

		this._UUID = Object.assign({DataCenter:0, Worker:0}, (typeof(pFableLog._Settings.UUID) ? 'object') ? pFableLog._Settings.UUID : {});


		switch(pLogStreams[i].streamtype)
		{
			case 'process.stdout':
				// Add a stdout stream appender
				tmpStreams.push({ level:tmpLogLevel, stream:process.stdout});
				break;
			case 'process.stderr':
				// Add a stderr stream appender
				tmpStreams.push({ level:tmpLogLevel, stream:process.stderr});
				break;
			case 'prettystream':
				// Add a "pretty stream" (which is like piping output through bunyan)
				var libPrettyStream = require('bunyan-prettystream');
				var tmpPrettyStream = new libPrettyStream();
				tmpPrettyStream.pipe(process.stdout);
				tmpStreams.push({ level:tmpLogLevel, type: 'raw', stream:tmpPrettyStream});
				break;
			case 'logstash':
				var libStash = require('bunyan-logstash-tcp');
				var tmpServer = pLogStreams[i].server || '127.0.0.1';
				var tmpPort = pLogStreams[i].port || 5000;
				_LogStashStream = libStash.createStream({
					host: tmpServer,
					port: tmpPort,
					max_connect_retries: -1,
					retry_interval: 5000
				});
				_LogStashStream.on('error', function (err) {
					console.log('[fable-log] logstash Stream Error:', err);
					});
				tmpStreams.push({ level:tmpLogLevel, type: 'raw', stream:_LogStashStream});
				break;
			case 'elasticsearch':
				var libES = require('bunyan-elasticsearch');
				var tmpIndexPattern = pLogStreams[i].indexPattern || '[logs-]YYYY.MM.DD';
				var tmpServer = pLogStreams[i].server || '127.0.0.1';
				var tmpPort = pLogStreams[i].port || 9200;
				_ESStream = new libES({
					indexPattern: tmpIndexPattern,
					type: 'logs',
					host: tmpServer + ':' + tmpPort
				});
				_ESStream.on('error', function (err) {
					console.log('[fable-log] Elasticsearch Stream Error:', err.stack);
				});
				tmpStreams.push({ level:tmpLogLevel, stream:_ESStream});
				break;
			tmpStreams.push({ level:tmpLogLevel, path:pLogStreams[i].path});
		}
	}
}