/**
* Unit tests for FoxHound
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
		var testFableLogParameters = false;

		setup
		(
			function()
			{
				testFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
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
						Expect(testFableLogParameters)
							.to.be.an('object', 'Fable-Log-Parameters should initialize as an object directly from the require statement.');
					}
				);
				test
				(
					'basic class parameters',
					function()
					{
						Expect(testFableLogParameters).to.have.a.property('parameters')
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
						var tmpFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
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
						var tmpFableLogParameters = testFableLogParameters = require('../source/Fable-Log-Parameters.js').new({Product:'Parcheesi'});
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
						var tmpFableLogParameters = testFableLogParameters = require('../source/Fable-Log-Parameters.js').new();
						tmpFableLogParameters.loadConfiguration('../test/Fable-Log-Parameters_test.json', 'BaseConfiguration');
						Expect(tmpFableLogParameters.parameters.Product)
							.that.is.a('string')
							.that.is.equal('LogTest');
						Expect(tmpFableLogParameters.parameters.ProductVersion)
							.that.is.a('string')
							.that.is.equal('00.09.003');
					}
				);
			}
		);
	}
);