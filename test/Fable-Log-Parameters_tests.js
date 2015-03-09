/**
* Unit tests for Fable Log Parameters
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;
var Assert = Chai.assert;

suite
(
	'Fable-Log-Parameters',
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
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						Expect(tmpFableLogParameters)
							.to.be.an('object', 'Fable-Log-Parameters should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						Expect(tmpFableLogParameters).to.have.a.property('parameters')
							.that.is.a('object');
					}
				);
			}
		);
		suite
		(
			'Parameters',
			function()
			{
				test
				(
					'lazy loading parameters',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js');
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('Fable');
						Expect(tmpFableLogParameters.parameters.ProductVersion)
							.that.is.a('string')
							.that.is.equal('0.0.0');
					}
				);
				test
				(
					'passing in parameters mixed with lazily loaded defaults',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new({Product:'Parcheesi'});
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('Parcheesi');
						Expect(tmpFableLogParameters.parameters.ProductVersion)
							.that.is.a('string')
							.that.is.equal('0.0.0');
					}
				);
				test
				(
					'loading parameters from a file',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						tmpFableLogParameters.loadConfiguration('../test/Fable-Log-Parameters_test.json');
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('LogTest');
						Expect(tmpFableLogParameters.parameters.ProductVersion)
							.that.is.a('string')
							.that.is.equal('0.9.3');
					}
				);
				test
				(
					'loading parameters from the default file',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						tmpFableLogParameters.loadConfiguration();
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('Fable');
						Expect(tmpFableLogParameters.parameters.ProductVersion)
							.that.is.a('string')
							.that.is.equal('0.0.1');
					}
				);
				test
				(
					'loading parameters from a nonexistant file',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						tmpFableLogParameters.loadConfiguration('ReallyBadFileName.json');
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('Fable');
						Expect(tmpFableLogParameters.parameters.ProductVersion)
							.that.is.a('string')
							.that.is.equal('0.0.0');
					}
				);
				test
				(
					'forcing a parameters object',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						tmpFableLogParameters.parameters = (
						{
							"Product": "ForceObject",
							"ProductVersion": "1.2.3",
							"UUID":
								{
									"DataCenter": 0,
									"Worker": 0
								},
							"LogStreams":
								[
									{
										"level": "debug",
										"streamtype": "process.stdout"
									},
									{
										"level": "trace",
										"path": "./Logs/Fable.log"
									}
								]
						});
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('ForceObject');
					}
				);
			}
		);
		suite
		(
			'Log Stream Parser',
			function()
			{
				test
				(
					'parse valid log stream',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'test', streamtype:'value'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
					}
				);
				test
				(
					'parse invalid longer log stream',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'test', streamtype:'value'},{level: 'test2', streamtype:'value2'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
					}
				);
				test
				(
					'parse valid longer log stream',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'test', streamtype:'process.stderr'},{level: 'test2', streamtype:'process.stdout'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(2);
					}
				);
				test
				(
					'parse empty log stream',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('trace');
					}
				);
				test
				(
					'parse no log stream',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams();
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('trace');
					}
				);
				test
				(
					'parse invalid log stream entry',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams(['SNARF']);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('trace');
					}
				);
				test
				(
					'parse invalid log stream object',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'test'},{streamtype:'value0'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('trace');
					}
				);
				test
				(
					'parse invalid log stream definition',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{streamtype:'value0'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('trace');
					}
				);
				test
				(
					'pipe to stdout',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'test', streamtype:'process.stdout'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('test');
					}
				);
				test
				(
					'pipe to stderr',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'fatality', streamtype:'process.stderr'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('fatality');
					}
				);
				test
				(
					'pipe to file',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						var tmpNewLogStream = tmpFableLogParameters.parseLogStreams([{level: 'fatality', path:'./tmp/SomeLog.log'}]);
						Expect(tmpNewLogStream.length)
							.that.is.equal(1);
						Expect(tmpNewLogStream[0].level)
							.that.is.equal('fatality');
					}
				);
				test
				(
					'initializing a nonexistant mongo stream',
					function()
					{
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						console.log(typeof(tmpFableLogParameters.initializeMongoStreams));
						tmpFableLogParameters.initializeMongoStreams();
					}
				);
			}
		);
	}
);