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
    1: [function (require, module, exports) {}, {}],
    2: [function (require, module, exports) {
      /**
      * Fable Core Pre-initialization Service Base
      *
      * For a couple services, we need to be able to instantiate them before the Fable object is fully initialized.
      * This is a base class for those services.
      *
      * @license MIT
      * @author <steven@velozo.com>
      */

      class FableCoreServiceProviderBase {
        constructor(pOptions, pServiceHash) {
          this.fable = false;
          this.options = typeof pOptions === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';

          // The hash will be a non-standard UUID ... the UUID service uses this base class!
          this.UUID = `CORESVC-${Math.floor(Math.random() * (99999 - 10000) + 10000)}`;
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : `${this.UUID}`;
        }
        static isFableService = true;

        // After fable is initialized, it would be expected to be wired in as a normal service.
        connectFable(pFable) {
          this.fable = pFable;
          return true;
        }
      }
      module.exports = FableCoreServiceProviderBase;
    }, {}],
    3: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @license MIT
      * @author <steven@velozo.com>
      */

      class FableServiceProviderBase {
        constructor(pFable, pOptions, pServiceHash) {
          this.fable = pFable;
          this.options = typeof pOptions === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';
          this.UUID = pFable.getUUID();
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : `${this.UUID}`;
        }
        static isFableService = true;
      }
      module.exports = FableServiceProviderBase;
      module.exports.CoreServiceProviderBase = require('./Fable-ServiceProviderBase-Preinit.js');
    }, {
      "./Fable-ServiceProviderBase-Preinit.js": 2
    }],
    4: [function (require, module, exports) {
      (function (process) {
        (function () {
          // 'path' module extracted from Node.js v8.11.1 (only the posix part)
          // transplited with Babel

          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict';

          function assertPath(path) {
            if (typeof path !== 'string') {
              throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
            }
          }

          // Resolves . and .. elements in a path with directory names
          function normalizeStringPosix(path, allowAboveRoot) {
            var res = '';
            var lastSegmentLength = 0;
            var lastSlash = -1;
            var dots = 0;
            var code;
            for (var i = 0; i <= path.length; ++i) {
              if (i < path.length) code = path.charCodeAt(i);else if (code === 47 /*/*/) break;else code = 47 /*/*/;
              if (code === 47 /*/*/) {
                if (lastSlash === i - 1 || dots === 1) {
                  // NOOP
                } else if (lastSlash !== i - 1 && dots === 2) {
                  if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
                    if (res.length > 2) {
                      var lastSlashIndex = res.lastIndexOf('/');
                      if (lastSlashIndex !== res.length - 1) {
                        if (lastSlashIndex === -1) {
                          res = '';
                          lastSegmentLength = 0;
                        } else {
                          res = res.slice(0, lastSlashIndex);
                          lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                      }
                    } else if (res.length === 2 || res.length === 1) {
                      res = '';
                      lastSegmentLength = 0;
                      lastSlash = i;
                      dots = 0;
                      continue;
                    }
                  }
                  if (allowAboveRoot) {
                    if (res.length > 0) res += '/..';else res = '..';
                    lastSegmentLength = 2;
                  }
                } else {
                  if (res.length > 0) res += '/' + path.slice(lastSlash + 1, i);else res = path.slice(lastSlash + 1, i);
                  lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
              } else if (code === 46 /*.*/ && dots !== -1) {
                ++dots;
              } else {
                dots = -1;
              }
            }
            return res;
          }
          function _format(sep, pathObject) {
            var dir = pathObject.dir || pathObject.root;
            var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
            if (!dir) {
              return base;
            }
            if (dir === pathObject.root) {
              return dir + base;
            }
            return dir + sep + base;
          }
          var posix = {
            // path.resolve([from ...], to)
            resolve: function resolve() {
              var resolvedPath = '';
              var resolvedAbsolute = false;
              var cwd;
              for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                var path;
                if (i >= 0) path = arguments[i];else {
                  if (cwd === undefined) cwd = process.cwd();
                  path = cwd;
                }
                assertPath(path);

                // Skip empty entries
                if (path.length === 0) {
                  continue;
                }
                resolvedPath = path + '/' + resolvedPath;
                resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
              }

              // At this point the path should be resolved to a full absolute path, but
              // handle relative paths to be safe (might happen when process.cwd() fails)

              // Normalize the path
              resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
              if (resolvedAbsolute) {
                if (resolvedPath.length > 0) return '/' + resolvedPath;else return '/';
              } else if (resolvedPath.length > 0) {
                return resolvedPath;
              } else {
                return '.';
              }
            },
            normalize: function normalize(path) {
              assertPath(path);
              if (path.length === 0) return '.';
              var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
              var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

              // Normalize the path
              path = normalizeStringPosix(path, !isAbsolute);
              if (path.length === 0 && !isAbsolute) path = '.';
              if (path.length > 0 && trailingSeparator) path += '/';
              if (isAbsolute) return '/' + path;
              return path;
            },
            isAbsolute: function isAbsolute(path) {
              assertPath(path);
              return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
            },

            join: function join() {
              if (arguments.length === 0) return '.';
              var joined;
              for (var i = 0; i < arguments.length; ++i) {
                var arg = arguments[i];
                assertPath(arg);
                if (arg.length > 0) {
                  if (joined === undefined) joined = arg;else joined += '/' + arg;
                }
              }
              if (joined === undefined) return '.';
              return posix.normalize(joined);
            },
            relative: function relative(from, to) {
              assertPath(from);
              assertPath(to);
              if (from === to) return '';
              from = posix.resolve(from);
              to = posix.resolve(to);
              if (from === to) return '';

              // Trim any leading backslashes
              var fromStart = 1;
              for (; fromStart < from.length; ++fromStart) {
                if (from.charCodeAt(fromStart) !== 47 /*/*/) break;
              }
              var fromEnd = from.length;
              var fromLen = fromEnd - fromStart;

              // Trim any leading backslashes
              var toStart = 1;
              for (; toStart < to.length; ++toStart) {
                if (to.charCodeAt(toStart) !== 47 /*/*/) break;
              }
              var toEnd = to.length;
              var toLen = toEnd - toStart;

              // Compare paths to find the longest common path from root
              var length = fromLen < toLen ? fromLen : toLen;
              var lastCommonSep = -1;
              var i = 0;
              for (; i <= length; ++i) {
                if (i === length) {
                  if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === 47 /*/*/) {
                      // We get here if `from` is the exact base path for `to`.
                      // For example: from='/foo/bar'; to='/foo/bar/baz'
                      return to.slice(toStart + i + 1);
                    } else if (i === 0) {
                      // We get here if `from` is the root
                      // For example: from='/'; to='/foo'
                      return to.slice(toStart + i);
                    }
                  } else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
                      // We get here if `to` is the exact base path for `from`.
                      // For example: from='/foo/bar/baz'; to='/foo/bar'
                      lastCommonSep = i;
                    } else if (i === 0) {
                      // We get here if `to` is the root.
                      // For example: from='/foo'; to='/'
                      lastCommonSep = 0;
                    }
                  }
                  break;
                }
                var fromCode = from.charCodeAt(fromStart + i);
                var toCode = to.charCodeAt(toStart + i);
                if (fromCode !== toCode) break;else if (fromCode === 47 /*/*/) lastCommonSep = i;
              }
              var out = '';
              // Generate the relative path based on the path difference between `to`
              // and `from`
              for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
                if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
                  if (out.length === 0) out += '..';else out += '/..';
                }
              }

              // Lastly, append the rest of the destination (`to`) path that comes after
              // the common path parts
              if (out.length > 0) return out + to.slice(toStart + lastCommonSep);else {
                toStart += lastCommonSep;
                if (to.charCodeAt(toStart) === 47 /*/*/) ++toStart;
                return to.slice(toStart);
              }
            },
            _makeLong: function _makeLong(path) {
              return path;
            },
            dirname: function dirname(path) {
              assertPath(path);
              if (path.length === 0) return '.';
              var code = path.charCodeAt(0);
              var hasRoot = code === 47 /*/*/;
              var end = -1;
              var matchedSlash = true;
              for (var i = path.length - 1; i >= 1; --i) {
                code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                  if (!matchedSlash) {
                    end = i;
                    break;
                  }
                } else {
                  // We saw the first non-path separator
                  matchedSlash = false;
                }
              }
              if (end === -1) return hasRoot ? '/' : '.';
              if (hasRoot && end === 1) return '//';
              return path.slice(0, end);
            },
            basename: function basename(path, ext) {
              if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
              assertPath(path);
              var start = 0;
              var end = -1;
              var matchedSlash = true;
              var i;
              if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
                if (ext.length === path.length && ext === path) return '';
                var extIdx = ext.length - 1;
                var firstNonSlashEnd = -1;
                for (i = path.length - 1; i >= 0; --i) {
                  var code = path.charCodeAt(i);
                  if (code === 47 /*/*/) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                      start = i + 1;
                      break;
                    }
                  } else {
                    if (firstNonSlashEnd === -1) {
                      // We saw the first non-path separator, remember this index in case
                      // we need it if the extension ends up not matching
                      matchedSlash = false;
                      firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                      // Try to match the explicit extension
                      if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                          // We matched the extension, so mark this as the end of our path
                          // component
                          end = i;
                        }
                      } else {
                        // Extension does not match, so our result is the entire path
                        // component
                        extIdx = -1;
                        end = firstNonSlashEnd;
                      }
                    }
                  }
                }
                if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
                return path.slice(start, end);
              } else {
                for (i = path.length - 1; i >= 0; --i) {
                  if (path.charCodeAt(i) === 47 /*/*/) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                      start = i + 1;
                      break;
                    }
                  } else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                  }
                }
                if (end === -1) return '';
                return path.slice(start, end);
              }
            },
            extname: function extname(path) {
              assertPath(path);
              var startDot = -1;
              var startPart = 0;
              var end = -1;
              var matchedSlash = true;
              // Track the state of characters (if any) we see before our first dot and
              // after any path separator we find
              var preDotState = 0;
              for (var i = path.length - 1; i >= 0; --i) {
                var code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                  }
                  continue;
                }
                if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // extension
                  matchedSlash = false;
                  end = i + 1;
                }
                if (code === 46 /*.*/) {
                  // If this is our first dot, mark it as the start of our extension
                  if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
                } else if (startDot !== -1) {
                  // We saw a non-dot and non-path separator before our dot, so we should
                  // have a good chance at having a non-empty extension
                  preDotState = -1;
                }
              }
              if (startDot === -1 || end === -1 ||
              // We saw a non-dot character immediately before the dot
              preDotState === 0 ||
              // The (right-most) trimmed path component is exactly '..'
              preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                return '';
              }
              return path.slice(startDot, end);
            },
            format: function format(pathObject) {
              if (pathObject === null || typeof pathObject !== 'object') {
                throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
              }
              return _format('/', pathObject);
            },
            parse: function parse(path) {
              assertPath(path);
              var ret = {
                root: '',
                dir: '',
                base: '',
                ext: '',
                name: ''
              };
              if (path.length === 0) return ret;
              var code = path.charCodeAt(0);
              var isAbsolute = code === 47 /*/*/;
              var start;
              if (isAbsolute) {
                ret.root = '/';
                start = 1;
              } else {
                start = 0;
              }
              var startDot = -1;
              var startPart = 0;
              var end = -1;
              var matchedSlash = true;
              var i = path.length - 1;

              // Track the state of characters (if any) we see before our first dot and
              // after any path separator we find
              var preDotState = 0;

              // Get non-dir info
              for (; i >= start; --i) {
                code = path.charCodeAt(i);
                if (code === 47 /*/*/) {
                  // If we reached a path separator that was not part of a set of path
                  // separators at the end of the string, stop now
                  if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                  }
                  continue;
                }
                if (end === -1) {
                  // We saw the first non-path separator, mark this as the end of our
                  // extension
                  matchedSlash = false;
                  end = i + 1;
                }
                if (code === 46 /*.*/) {
                  // If this is our first dot, mark it as the start of our extension
                  if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
                } else if (startDot !== -1) {
                  // We saw a non-dot and non-path separator before our dot, so we should
                  // have a good chance at having a non-empty extension
                  preDotState = -1;
                }
              }
              if (startDot === -1 || end === -1 ||
              // We saw a non-dot character immediately before the dot
              preDotState === 0 ||
              // The (right-most) trimmed path component is exactly '..'
              preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                if (end !== -1) {
                  if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
                }
              } else {
                if (startPart === 0 && isAbsolute) {
                  ret.name = path.slice(1, startDot);
                  ret.base = path.slice(1, end);
                } else {
                  ret.name = path.slice(startPart, startDot);
                  ret.base = path.slice(startPart, end);
                }
                ret.ext = path.slice(startDot, end);
              }
              if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';
              return ret;
            },
            sep: '/',
            delimiter: ':',
            win32: null,
            posix: null
          };
          posix.posix = posix;
          module.exports = posix;
        }).call(this);
      }).call(this, require('_process'));
    }, {
      "_process": 5
    }],
    5: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;
      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;
      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }
      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;
        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }
      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};
      function noop() {}
      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;
      process.listeners = function (name) {
        return [];
      };
      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };
      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };
    }, {}],
    6: [function (require, module, exports) {
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
          this._Settings = typeof pLogStreamSettings == 'object' ? pLogStreamSettings : {};

          // The base logger does nothing but associate a UUID with itself
          // We added this as the mechanism for tracking loggers to allow multiple simultaneous streams
          // to the same provider.
          this.loggerUUID = this.generateInsecureUUID();

          // Eventually we can use this array to ompute which levels the provider allows.
          // For now it's just used to precompute some string concatenations.
          this.levels = ["trace", "debug", "info", "warn", "error", "fatal"];
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
    7: [function (require, module, exports) {
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
      "./Fable-Log.js": 12
    }],
    8: [function (require, module, exports) {
      /**
      * Default Logger Provider Function
      *
      * @license MIT
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      // Return the providers that are available without extensions loaded
      var getDefaultProviders = () => {
        let tmpDefaultProviders = {};
        tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');
        tmpDefaultProviders.default = tmpDefaultProviders.console;
        return tmpDefaultProviders;
      };
      module.exports = getDefaultProviders();
    }, {
      "./Fable-Log-Logger-Console.js": 10
    }],
    9: [function (require, module, exports) {
      module.exports = [{
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
      }];
    }, {}],
    10: [function (require, module, exports) {
      let libBaseLogger = require('./Fable-Log-BaseLogger.js');
      class ConsoleLogger extends libBaseLogger {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings);
          this._ShowTimeStamps = this._Settings.hasOwnProperty('showtimestamps') ? this._Settings.showtimestamps == true : true;
          this._FormattedTimeStamps = this._Settings.hasOwnProperty('formattedtimestamps') ? this._Settings.formattedtimestamps == true : true;
          this._ContextMessage = this._Settings.hasOwnProperty('Context') ? `(${this._Settings.Context})` : pFableLog._Settings.hasOwnProperty('Product') ? `(${pFableLog._Settings.Product})` : 'Unnamed_Log_Context';

          // Allow the user to decide what gets output to the console
          this._OutputLogLinesToConsole = this._Settings.hasOwnProperty('outputloglinestoconsole') ? this._Settings.outputloglinestoconsole : true;
          this._OutputObjectsToConsole = this._Settings.hasOwnProperty('outputobjectstoconsole') ? this._Settings.outputobjectstoconsole : true;

          // Precompute the prefix for each level
          this.prefixCache = {};
          for (let i = 0; i <= this.levels.length; i++) {
            this.prefixCache[this.levels[i]] = `[${this.levels[i]}] ${this._ContextMessage}: `;
            if (this._ShowTimeStamps) {
              // If there is a timestamp we need a to prepend space before the prefixcache string, since the timestamp comes first
              this.prefixCache[this.levels[i]] = ' ' + this.prefixCache[this.levels[i]];
            }
          }
        }
        write(pLevel, pLogText, pObject) {
          let tmpTimeStamp = '';
          if (this._ShowTimeStamps && this._FormattedTimeStamps) {
            tmpTimeStamp = new Date().toISOString();
          } else if (this._ShowTimeStamps) {
            tmpTimeStamp = +new Date();
          }
          let tmpLogLine = `${tmpTimeStamp}${this.prefixCache[pLevel]}${pLogText}`;
          if (this._OutputLogLinesToConsole) {
            console.log(tmpLogLine);
          }

          // Write out the object on a separate line if it is passed in
          if (this._OutputObjectsToConsole && typeof pObject !== 'undefined') {
            console.log(JSON.stringify(pObject, null, 2));
          }

          // Provide an easy way to be overridden and be consistent
          return tmpLogLine;
        }
      }
      module.exports = ConsoleLogger;
    }, {
      "./Fable-Log-BaseLogger.js": 6
    }],
    11: [function (require, module, exports) {
      const libConsoleLog = require('./Fable-Log-Logger-Console.js');
      const libFS = require('fs');
      const libPath = require('path');
      class SimpleFlatFileLogger extends libConsoleLog {
        constructor(pLogStreamSettings, pFableLog) {
          super(pLogStreamSettings, pFableLog);

          // If a path isn't provided for the logfile, it tries to use the ProductName or Context
          this.logFileRawPath = this._Settings.hasOwnProperty('path') ? this._Settings.path : `./${this._ContextMessage}.log`;
          this.logFilePath = libPath.normalize(this.logFileRawPath);
          this.logFileStreamOptions = this._Settings.hasOwnProperty('fileStreamoptions') ? this._Settings.fileStreamOptions : {
            "flags": "a",
            "encoding": "utf8"
          };
          this.fileWriter = libFS.createWriteStream(this.logFilePath, this.logFileStreamOptions);
          this.activelyWriting = false;
          this.logLineStrings = [];
          this.logObjectStrings = [];
          this.defaultWriteCompleteCallback = () => {};
          this.defaultBufferFlushCallback = () => {};
        }
        closeWriter(fCloseComplete) {
          let tmpCloseComplete = typeof fCloseComplete == 'function' ? fCloseComplete : () => {};
          if (this.fileWriter) {
            this.fileWriter.end('\n');
            return this.fileWriter.once('finish', tmpCloseComplete.bind(this));
          }
        }
        completeBufferFlushToLogFile(fFlushComplete) {
          this.activelyWriting = false;
          let tmpFlushComplete = typeof fFlushComplete == 'function' ? fFlushComplete : this.defaultBufferFlushCallback;
          if (this.logLineStrings.length > 0) {
            this.flushBufferToLogFile(tmpFlushComplete);
          } else {
            return tmpFlushComplete();
          }
        }
        flushBufferToLogFile(fFlushComplete) {
          if (!this.activelyWriting) {
            // Only want to be writing one thing at a time....
            this.activelyWriting = true;
            let tmpFlushComplete = typeof fFlushComplete == 'function' ? fFlushComplete : this.defaultBufferFlushCallback;

            // Get the current buffer arrays.  These should always have matching number of elements.
            let tmpLineStrings = this.logLineStrings;
            let tmpObjectStrings = this.logObjectStrings;

            // Reset these to be filled while we process this queue...
            this.logLineStrings = [];
            this.logObjectStrings = [];

            // This is where we will put each line before writing it to the file...
            let tmpConstructedBufferOutputString = '';
            for (let i = 0; i < tmpLineStrings.length; i++) {
              // TODO: Windows Newline?   ....... yo no se!
              tmpConstructedBufferOutputString += `${tmpLineStrings[i]}\n`;
              if (tmpObjectStrings[i] !== false) {
                tmpConstructedBufferOutputString += `${tmpObjectStrings[i]}\n`;
              }
            }
            if (!this.fileWriter.write(tmpConstructedBufferOutputString, 'utf8')) {
              // If the streamwriter returns false, we need to wait for it to drain.
              this.fileWriter.once('drain', this.completeBufferFlushToLogFile.bind(this, tmpFlushComplete));
            } else {
              return this.completeBufferFlushToLogFile(tmpFlushComplete);
            }
          }
        }
        write(pLevel, pLogText, pObject) {
          let tmpLogLine = super.write(pLevel, pLogText, pObject);

          // Use a very simple array as the write buffer
          this.logLineStrings.push(tmpLogLine);

          // Write out the object on a separate line if it is passed in
          if (typeof pObject !== 'undefined') {
            this.logObjectStrings.push(JSON.stringify(pObject, null, 4));
          } else {
            this.logObjectStrings.push(false);
          }
          this.flushBufferToLogFile();
        }
      }
      module.exports = SimpleFlatFileLogger;
    }, {
      "./Fable-Log-Logger-Console.js": 10,
      "fs": 1,
      "path": 4
    }],
    12: [function (require, module, exports) {
      /**
      * Fable Logging Service
      */

      const libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;
      class FableLog extends libFableServiceProviderBase {
        constructor(pSettings, pServiceHash) {
          super(pSettings, pServiceHash);
          this.serviceType = 'Logging';
          let tmpSettings = typeof pSettings === 'object' ? pSettings : {};
          this._Settings = tmpSettings;
          this._Providers = require('./Fable-Log-DefaultProviders-Node.js');
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
      module.exports = FableLog;
      module.exports.new = autoConstruct;
      module.exports.LogProviderBase = require('./Fable-Log-BaseLogger.js');
      module.exports.LogProviderConsole = require('./Fable-Log-Logger-Console.js');
      module.exports.LogProviderConsole = require('./Fable-Log-Logger-SimpleFlatFile.js');
    }, {
      "./Fable-Log-BaseLogger.js": 6,
      "./Fable-Log-DefaultProviders-Node.js": 8,
      "./Fable-Log-DefaultStreams.json": 9,
      "./Fable-Log-Logger-Console.js": 10,
      "./Fable-Log-Logger-SimpleFlatFile.js": 11,
      "fable-serviceproviderbase": 3
    }]
  }, {}, [7])(7);
});