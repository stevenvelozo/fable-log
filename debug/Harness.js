let libFableLog = require('../source/Fable-Log.js');

let tmpLog = new libFableLog.FableLog(
	{
		LogStreams:
		[
			{
				loggertype:'bunyan',
				streamtype:'stdout',
				ShowTimeStamps:true,
				FormattedTimeStamps:true,
				level:'debug'
			}
		]
	});

tmpLog.initialize();

tmpLog.info('test');