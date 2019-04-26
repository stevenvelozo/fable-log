/**
* Unit tests for the Fable Logging Wrappers
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

var libFableLog = require('../source/Fable-Log.js').FableLog;

suite
(
	'Fable-Log',
	function()
	{
		setup
		(
			function()
			{
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'initialize should build a happy little object',
					function()
					{
						var tmpFableLog = new libFableLog();
						Expect(tmpFableLog)
							.to.be.an('object', 'Fable-Log should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						tmpFableLog.initialize();
						Expect(tmpFableLog).to.have.a.property('_Settings')
							.that.is.a('object');
					}
				);
			}
		);
		suite
		(
			'Writing Events',
			function()
			{
				test
				(
					'writing to a log stream',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						tmpFableLog.initialize();
						tmpFableLog.info('Test');
					}
				);
				test
				(
					'writing to all log streams',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						tmpFableLog.initialize();
						tmpFableLog.trace('Test of Trace');
						tmpFableLog.debug('Test of Debug');
						tmpFableLog.info('Test of Info');
						tmpFableLog.warn('Test of Warning');
						tmpFableLog.error('Test of Error');
						tmpFableLog.fatal('Test of Fatal');
					}
				);
				test
				(
					'writing objects to all log streams',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						tmpFableLog.initialize();
						tmpFableLog.trace('Testing object sending to Trace...',{Value:"Unlikely",Status:true});
						tmpFableLog.debug('Testing object sending to Debug...',{Value:"Unlikely",Status:true});
						tmpFableLog.info('Testing object sending to Info...',{Value:"Unlikely",Status:true});
						tmpFableLog.warn('Testing object sending to Warning...',{Value:"Unlikely",Status:true});
						tmpFableLog.error('Testing object sending to Error...',{Value:"Unlikely",Status:true});
						tmpFableLog.fatal('Testing object sending to Fatal...',{Value:"Unlikely",Status:true});
					}
				);
				test
				(
					'failing to write to all log streams',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						//tmpFableLog.initialize();
						tmpFableLog.trace('Test of Trace');
						tmpFableLog.debug('Test of Debug');
						tmpFableLog.info('Test of Info');
						tmpFableLog.warn('Test of Warning');
						tmpFableLog.error('Test of Error');
						tmpFableLog.fatal('Test of Fatal');
					}
				);
				test
				(
					'logging empty values to all log streams',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						tmpFableLog.initialize();
						tmpFableLog.trace();
						tmpFableLog.debug();
						tmpFableLog.info();
						tmpFableLog.warn();
						tmpFableLog.error();
						tmpFableLog.fatal();
					}
				);
				test
				(
					'manual logging to bunyan',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new({LogStreams:[{level:'debug'}]});
						tmpFableLog.initialize();
						tmpFableLog.logStreamsTrace[0].trace('Test of manual Trace');
					}
				);
			}
		);
		suite
		(
			'Custom Streams',
			function()
			{
				test
				(
					'reading the data in streams',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new();
						tmpFableLog.initialize();
						tmpFableLog.info('Test 2');
						tmpFableLog.info('Currently the Parameters for this log are', tmpFableLog.parameters);
					}
				);
				test
				(
					'setting a UUID',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new({Product:'SetUUID'});
						tmpFableLog.uuid = 'SOMECRAZYID1000';
						tmpFableLog.initialize();
						tmpFableLog.info('Test UUID Set: '+tmpFableLog.uuid);
					}
				);
				test
				(
					'passing in a configuration file',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new({Product:'Paramset', ProductVersion:'9.8.7'});
						tmpFableLog.initialize('../test/Fable-Log-Parameters_test.json');
						tmpFableLog.info('Test with custom params: '+tmpFableLog.uuid);
					}
				);
				test
				(
					'pretty streams',
					function()
					{
						var tmpFableLog = require('../source/Fable-Log.js').new({Product:'PrettyStream', LogStreams:[{streamtype:'prettystream'}]});
						tmpFableLog.initialize();
						tmpFableLog.trace('Trying out pretty streams to Trace...',{Value:"Unlikely",Status:true});
						tmpFableLog.debug('Trying out pretty streams to Debug...',{Value:"Unlikely",Status:true});
						tmpFableLog.info('Trying out pretty streams to Info...',{Value:"Unlikely",Status:true});
						tmpFableLog.warn('Trying out pretty streams to Warning...',{Value:"Unlikely",Status:true});
						tmpFableLog.error('Trying out pretty streams to Error...',{Value:"Unlikely",Status:true});
						tmpFableLog.fatal('Trying out pretty streams to Fatal...',{Value:"Unlikely",Status:true});
					}
				);
				test
				(
					'passing in the rotating file parameter',
					function(fDone)
					{
						var tmpFableLog = require('../source/Fable-Log.js').new({Product:'rotatingoooo', LogStreams:[{streamtype:'process.stdout'},{type:'rotating-file', period:'1ms', path:'/tmp/SomeRotatingLog.log'}]});
						tmpFableLog.initialize();
						// We have to do this as a series, so we can ensure the connection is done before we start logging.
						var libAsync = require('async');
						libAsync.series([
							function(fNext)
							{
								tmpFableLog.info('Test with custom param object: '+tmpFableLog.uuid);
								tmpFableLog.info('Test with custom param object: '+tmpFableLog.uuid);
								fDone();
								fNext();
							}
						]);
					}
				);
			}
		);
	}
);