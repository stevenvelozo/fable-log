(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.FableLog = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      /**
      * Base Logger Class
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      class BaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          // This should not possibly be able to be instantiated without a settings object
          this._Settings = pLogStreamSettings;

          // The base logger does nothing but associate a UUID with itself
          // We added this as the mechanism for tracking loggers to allow multiple simultaneous streams
          // to the same provider.
          this.loggerUUID = this.generateInsecureUUID();
        }

        // This is meant to generate programmatically insecure UUIDs to identify loggers
        generateInsecureUUID() {
          let tmpDate = new Date().getTime();
          let tmpUUID = 'LOGSTREAM-xxxxxx-yxxxxx'.replace(/[xy]/g, pCharacter => {
            // Funny algorithm from w3resource that is twister-ish without the deep math and security
            // ..but good enough for unique log stream identifiers
            let tmpRandomData = (tmpDate + Math.random() * 16) % 16 | 0;
            tmpDate = Math.floor(tmpDate / 16);
            return (pCharacter == 'x' ? tmpRandomData : tmpRandomData & 0x3 | 0x8).toString(16);
          });
          return tmpUUID;
        }
        initialize() {
          // No operation.
        }
        trace(pLogText, pLogObject) {
          this.write("trace", pLogText, pLogObject);
        }
        debug(pLogText, pLogObject) {
          this.write("debug", pLogText, pLogObject);
        }
        info(pLogText, pLogObject) {
          this.write("info", pLogText, pLogObject);
        }
        warn(pLogText, pLogObject) {
          this.write("warn", pLogText, pLogObject);
        }
        error(pLogText, pLogObject) {
          this.write("error", pLogText, pLogObject);
        }
        fatal(pLogText, pLogObject) {
          this.write("fatal", pLogText, pLogObject);
        }
        write(pLogLevel, pLogText, pLogObject) {
          // The base logger does nothing.
          return true;
        }
      }
      module.exports = BaseLogger;
    }, {}],
    2: [function (require, module, exports) {
      /**
      * Simple browser shim loader - assign the npm module to a window global automatically
      *
      * @license MIT
      * @author <steven@velozo.com>
      */
      var libNPMModuleWrapper = require('./Fable-Log.js');
      if (typeof window === 'object' && !window.hasOwnProperty('FableLog')) {
        window.FableLog = libNPMModuleWrapper;
      }
      module.exports = libNPMModuleWrapper;
    }, {
      "./Fable-Log.js": 6
    }],
    3: [function (require, module, exports) {
      /**
      * Default Logger Provider Function
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      // Return the providers that are available without extensions loaded
      getDefaultProviders = () => {
        let tmpDefaultProviders = {};
        tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');
        tmpDefaultProviders.default = tmpDefaultProviders.console;
        return tmpDefaultProviders;
      };
      module.exports = getDefaultProviders();
    }, {
      "./Fable-Log-Logger-Console.js": 5
    }],
    4: [function (require, module, exports) {
      module.exports = [{
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
      }];
    }, {}],
    5: [function (require, module, exports) {
      let libBaseLogger = require('./Fable-Log-BaseLogger.js');
      class ConsoleLogger extends libBaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings);
          this._ShowTimeStamps = pLogStreamSettings.hasOwnProperty('ShowTimeStamps') ? pLogStreamSettings.ShowTimeStamps == true : false;
          this._FormattedTimeStamps = pLogStreamSettings.hasOwnProperty('FormattedTimeStamps') ? pLogStreamSettings.FormattedTimeStamps == true : false;
          this._ContextMessage = pLogStreamSettings.hasOwnProperty('Context') ? ` (${pLogStreamSettings.Context})` : pFableLog._Settings.hasOwnProperty('Product') ? ` (${pFableLog._Settings.Product})` : '';
        }
        write(pLevel, pLogText, pObject) {
          if (this._ShowTimeStamps && this._FormattedTimeStamps) {
            let tmpDate = new Date().toISOString();
            console.log(`${tmpDate} [${pLevel}]${this._ContextMessage} ${pLogText}`);
          } else if (this._ShowTimeStamps) {
            let tmpDate = +new Date();
            console.log(`${tmpDate} [${pLevel}]${this._ContextMessage} ${pLogText}`);
          } else {
            console.log(`[${pLevel}]${this._ContextMessage} ${pLogText}`);
          }

          // Write out the object on a separate line if it is passed in
          if (typeof pObject !== 'undefined') {
            console.log(JSON.stringify(pObject, null, 4));
          }
        }
      }
      module.exports = ConsoleLogger;
    }, {
      "./Fable-Log-BaseLogger.js": 1
    }],
    6: [function (require, module, exports) {
      /**
      * Fable Logging Add-on
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      * @module Fable Logger
      */

      /**
      * Fable Solution Log Wrapper Main Class
      *
      * @class FableLog
      * @constructor
      */
      class FableLog {
        constructor(pFableSettings, pFable) {
          let tmpSettings = typeof pFableSettings === 'object' ? pFableSettings : {};
          this._Settings = tmpSettings;
          this._Providers = require('./Fable-Log-DefaultProviders.js');
          this._StreamDefinitions = tmpSettings.hasOwnProperty('LogStreams') ? tmpSettings.LogStreams : require('./Fable-Log-DefaultStreams.json');
          this.logStreams = [];

          // This object gets decorated for one-time instantiated providers that
          //  have multiple outputs, such as bunyan.
          this.logProviders = {};

          // A hash list of the GUIDs for each log stream, so they can't be added to the set more than one time
          this.activeLogStreams = {};
          this.logStreamsTrace = [];
          this.logStreamsDebug = [];
          this.logStreamsInfo = [];
          this.logStreamsWarn = [];
          this.logStreamsError = [];
          this.logStreamsFatal = [];
          this.datumDecorator = pDatum => pDatum;
          this.uuid = typeof tmpSettings.Product === 'string' ? tmpSettings.Product : 'Default';
        }
        addLogger(pLogger, pLevel) {
          // Bail out if we've already created one.
          if (this.activeLogStreams.hasOwnProperty(pLogger.loggerUUID)) {
            return false;
          }

          // Add it to the streams and to the mutex
          this.logStreams.push(pLogger);
          this.activeLogStreams[pLogger.loggerUUID] = true;

          // Make sure a kosher level was passed in
          switch (pLevel) {
            case 'trace':
              this.logStreamsTrace.push(pLogger);
            case 'debug':
              this.logStreamsDebug.push(pLogger);
            case 'info':
              this.logStreamsInfo.push(pLogger);
            case 'warn':
              this.logStreamsWarn.push(pLogger);
            case 'error':
              this.logStreamsError.push(pLogger);
            case 'fatal':
              this.logStreamsFatal.push(pLogger);
              break;
          }
          return true;
        }
        setDatumDecorator(fDatumDecorator) {
          if (typeof fDatumDecorator === 'function') {
            this.datumDecorator = fDatumDecorator;
          } else {
            this.datumDecorator = pDatum => pDatum;
          }
        }
        trace(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsTrace.length; i++) {
            this.logStreamsTrace[i].trace(pMessage, tmpDecoratedDatum);
          }
        }
        debug(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsDebug.length; i++) {
            this.logStreamsDebug[i].debug(pMessage, tmpDecoratedDatum);
          }
        }
        info(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsInfo.length; i++) {
            this.logStreamsInfo[i].info(pMessage, tmpDecoratedDatum);
          }
        }
        warn(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsWarn.length; i++) {
            this.logStreamsWarn[i].warn(pMessage, tmpDecoratedDatum);
          }
        }
        error(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsError.length; i++) {
            this.logStreamsError[i].error(pMessage, tmpDecoratedDatum);
          }
        }
        fatal(pMessage, pDatum) {
          const tmpDecoratedDatum = this.datumDecorator(pDatum);
          for (let i = 0; i < this.logStreamsFatal.length; i++) {
            this.logStreamsFatal[i].fatal(pMessage, tmpDecoratedDatum);
          }
        }
        initialize() {
          // "initialize" each logger as defined in the logging parameters
          for (let i = 0; i < this._StreamDefinitions.length; i++) {
            let tmpStreamDefinition = Object.assign({
              loggertype: 'default',
              streamtype: 'console',
              level: 'info'
            }, this._StreamDefinitions[i]);
            if (!this._Providers.hasOwnProperty(tmpStreamDefinition.loggertype)) {
              console.log(`Error initializing log stream: bad loggertype in stream definition ${JSON.stringify(tmpStreamDefinition)}`);
            } else {
              this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);
            }
          }

          // Now initialize each one.
          for (let i = 0; i < this.logStreams.length; i++) {
            this.logStreams[i].initialize();
          }
        }
        logTime(pMessage, pDatum) {
          let tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time';
          let tmpTime = new Date();
          this.info(`${tmpMessage} ${tmpTime} (epoch ${+tmpTime})`, pDatum);
        }

        // Get a timestamp
        getTimeStamp() {
          return +new Date();
        }
        getTimeDelta(pTimeStamp) {
          let tmpEndTime = +new Date();
          return tmpEndTime - pTimeStamp;
        }

        // Log the delta between a timestamp, and now with a message
        logTimeDelta(pTimeDelta, pMessage, pDatum) {
          let tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time Measurement';
          let tmpDatum = typeof pDatum === 'object' ? pDatum : {};
          let tmpEndTime = +new Date();
          this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms)`, pDatum);
        }
        logTimeDeltaHuman(pTimeDelta, pMessage, pDatum) {
          let tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time Measurement';
          let tmpEndTime = +new Date();
          let tmpMs = parseInt(pTimeDelta % 1000);
          let tmpSeconds = parseInt(pTimeDelta / 1000 % 60);
          let tmpMinutes = parseInt(pTimeDelta / (1000 * 60) % 60);
          let tmpHours = parseInt(pTimeDelta / (1000 * 60 * 60));
          tmpMs = tmpMs < 10 ? "00" + tmpMs : tmpMs < 100 ? "0" + tmpMs : tmpMs;
          tmpSeconds = tmpSeconds < 10 ? "0" + tmpSeconds : tmpSeconds;
          tmpMinutes = tmpMinutes < 10 ? "0" + tmpMinutes : tmpMinutes;
          tmpHours = tmpHours < 10 ? "0" + tmpHours : tmpHours;
          this.info(`${tmpMessage} logged at (epoch ${+tmpEndTime}) took (${pTimeDelta}ms) or (${tmpHours}:${tmpMinutes}:${tmpSeconds}.${tmpMs})`, pDatum);
        }
        logTimeDeltaRelative(pStartTime, pMessage, pDatum) {
          this.logTimeDelta(this.getTimeDelta(pStartTime), pMessage, pDatum);
        }
        logTimeDeltaRelativeHuman(pStartTime, pMessage, pDatum) {
          this.logTimeDeltaHuman(this.getTimeDelta(pStartTime), pMessage, pDatum);
        }
      }

      // This is for backwards compatibility
      function autoConstruct(pSettings) {
        return new FableLog(pSettings);
      }
      module.exports = {
        new: autoConstruct,
        FableLog: FableLog
      };
    }, {
      "./Fable-Log-DefaultProviders.js": 3,
      "./Fable-Log-DefaultStreams.json": 4
    }]
  }, {}, [2])(2);
});