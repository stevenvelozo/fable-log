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
							.that.is.equal('00.00.000');
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
							.that.is.equal('00.00.000');
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
							.that.is.equal('00.09.003');
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
							.that.is.equal('00.00.001');
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
							.that.is.equal('00.00.000');
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
							"ProductVersion": "00.00.000",
							"UUID": 
								{
									"DataCenter": 0,
									"Worker": 0
								},
							"LogStreams":
								[
									{
										"level": "debug",
										"stream": "process.stdout"
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
	}
);