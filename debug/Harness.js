let libFableLog = require('../source/Fable-Log.js');

let tmpLog = new libFableLog.FableLog(
	{
		LogStreams:
		[
								{
									loggertype:'bunyan',
									streamtype:'stderr',
									level:'trace'
								},
								{
									loggertype:'bunyan',
									streamtype:'process.stderr',
									level:'trace'
								},
								{
									loggertype:'bunyan',
									streamtype:'process.stdout',
									level:'trace'
								},
								{
									loggertype:'bunyan',
									level:'trace',
									streamtype:'prettystream'
								}
		]
	});

tmpLog.initialize();

tmpLog.info('test');

let tmpTimeStamp = tmpLog.getTimeStamp();

setTimeout(
	()=>
	{
		tmpLog.logTimeDeltaRelative(tmpTimeStamp, 'Test Delta');
		tmpLog.logTimeDeltaRelativeHuman(tmpTimeStamp);
	}, 505);