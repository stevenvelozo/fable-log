let libFableLog = require('./source/Fable-Log.js');

let tmpLog = new libFableLog.FableLog(
	{
		LogStreams:
		[
			{
				loggertype:'bunyan',
				streamtype:'stdout',
				level:'debug'
			}
		]
	});

tmpLog.initialize();

tmpLog.info('test');