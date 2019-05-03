let libFableLog = require('./source/Fable-Log.js');

let tmpLog = new libFableLog.FableLog(
	{
		LogStreams:
		[
			{
				loggertype:'bunyan',
				streamtype:'stdout',
				level:'debug'
			},
			{
				loggertype:'bunyan',
				level:'debug',
				streamtype:'file',
				path:'/tmp/Test-Bunyan.log'
			}
		]
	});

tmpLog.initialize();

tmpLog.info('test');