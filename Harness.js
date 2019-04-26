let libFableLog = require('./source/Fable-Log.js');

let tmpLog = new libFableLog.FableLog({LogStreams:[{level:'debug'}]});

tmpLog.initialize();

tmpLog.info('test');