/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @author <steven@velozo.com>
*/
var libNPMModuleWrapper = require('./Fable-Log.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('FableLog'))
{
	window.FableLog = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;