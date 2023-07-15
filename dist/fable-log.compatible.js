"use strict";

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
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
      * @author <steven@velozo.com>
      */
      var FableCoreServiceProviderBase = /*#__PURE__*/function () {
        function FableCoreServiceProviderBase(pOptions, pServiceHash) {
          _classCallCheck(this, FableCoreServiceProviderBase);
          this.fable = false;
          this.options = _typeof(pOptions) === 'object' ? pOptions : {};
          this.serviceType = 'Unknown';

          // The hash will be a non-standard UUID ... the UUID service uses this base class!
          this.UUID = "CORESVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
          this.Hash = typeof pServiceHash === 'string' ? pServiceHash : "".concat(this.UUID);
        }
        _createClass(FableCoreServiceProviderBase, [{
          key: "connectFable",
          value:
          // After fable is initialized, it would be expected to be wired in as a normal service.
          function connectFable(pFable) {
            this.fable = pFable;
            return true;
          }
        }]);
        return FableCoreServiceProviderBase;
      }();
      _defineProperty(FableCoreServiceProviderBase, "isFableService", true);
      module.exports = FableCoreServiceProviderBase;
    }, {}],
    3: [function (require, module, exports) {
      /**
      * Fable Service Base
      * @author <steven@velozo.com>
      */
      var FableServiceProviderBase = /*#__PURE__*/_createClass(function FableServiceProviderBase(pFable, pOptions, pServiceHash) {
        _classCallCheck(this, FableServiceProviderBase);
        this.fable = pFable;
        this.options = _typeof(pOptions) === 'object' ? pOptions : _typeof(pFable) === 'object' && !pFable.isFable ? pFable : {};
        this.serviceType = 'Unknown';
        if (typeof pFable.getUUID == 'function') {
          this.UUID = pFable.getUUID();
        } else {
          this.UUID = "NoFABLESVC-".concat(Math.floor(Math.random() * (99999 - 10000) + 10000));
        }
        this.Hash = typeof pServiceHash === 'string' ? pServiceHash : "".concat(this.UUID);

        // Pull back a few things
        this.log = this.fable.log;
        this.servicesMap = this.fable.servicesMap;
        this.services = this.fable.services;
      });
      _defineProperty(FableServiceProviderBase, "isFableService", true);
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
              if (pathObject === null || _typeof(pathObject) !== 'object') {
                throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + _typeof(pathObject));
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
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      var libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;
      var BaseLogger = /*#__PURE__*/function (_libFableServiceProvi) {
        _inherits(BaseLogger, _libFableServiceProvi);
        var _super = _createSuper(BaseLogger);
        function BaseLogger(pLogStreamSettings, pLogStreamHash) {
          var _this;
          _classCallCheck(this, BaseLogger);
          _this = _super.call(this, pLogStreamSettings, pLogStreamHash);
          // This should not possibly be able to be instantiated without a settings object
          _this._Settings = _typeof(pLogStreamSettings) == 'object' ? pLogStreamSettings : {};
          _this.serviceType = 'Logging-Provider';

          // The base logger does nothing but associate a UUID with itself
          // We added this as the mechanism for tracking loggers to allow multiple simultaneous streams
          // to the same provider.
          _this.loggerUUID = _this.generateInsecureUUID();

          // Eventually we can use this array to ompute which levels the provider allows.
          // For now it's just used to precompute some string concatenations.
          _this.levels = ["trace", "debug", "info", "warn", "error", "fatal"];
          return _this;
        }

        // This is meant to generate programmatically insecure UUIDs to identify loggers
        _createClass(BaseLogger, [{
          key: "generateInsecureUUID",
          value: function generateInsecureUUID() {
            var tmpDate = new Date().getTime();
            var tmpUUID = 'LOGSTREAM-xxxxxx-yxxxxx'.replace(/[xy]/g, function (pCharacter) {
              // Funny algorithm from w3resource that is twister-ish without the deep math and security
              // ..but good enough for unique log stream identifiers
              var tmpRandomData = (tmpDate + Math.random() * 16) % 16 | 0;
              tmpDate = Math.floor(tmpDate / 16);
              return (pCharacter == 'x' ? tmpRandomData : tmpRandomData & 0x3 | 0x8).toString(16);
            });
            return tmpUUID;
          }
        }, {
          key: "initialize",
          value: function initialize() {
            // No operation.
          }
        }, {
          key: "trace",
          value: function trace(pLogText, pLogObject) {
            this.write("trace", pLogText, pLogObject);
          }
        }, {
          key: "debug",
          value: function debug(pLogText, pLogObject) {
            this.write("debug", pLogText, pLogObject);
          }
        }, {
          key: "info",
          value: function info(pLogText, pLogObject) {
            this.write("info", pLogText, pLogObject);
          }
        }, {
          key: "warn",
          value: function warn(pLogText, pLogObject) {
            this.write("warn", pLogText, pLogObject);
          }
        }, {
          key: "error",
          value: function error(pLogText, pLogObject) {
            this.write("error", pLogText, pLogObject);
          }
        }, {
          key: "fatal",
          value: function fatal(pLogText, pLogObject) {
            this.write("fatal", pLogText, pLogObject);
          }
        }, {
          key: "write",
          value: function write(pLogLevel, pLogText, pLogObject) {
            // The base logger does nothing.
            return true;
          }
        }]);
        return BaseLogger;
      }(libFableServiceProviderBase);
      module.exports = BaseLogger;
    }, {
      "fable-serviceproviderbase": 3
    }],
    7: [function (require, module, exports) {
      /**
      * Default Logger Provider Function
      *
      *
      * @author Steven Velozo <steven@velozo.com>
      */

      // Return the providers that are available without extensions loaded
      var getDefaultProviders = function getDefaultProviders() {
        var tmpDefaultProviders = {};
        tmpDefaultProviders.console = require('./Fable-Log-Logger-Console.js');
        tmpDefaultProviders["default"] = tmpDefaultProviders.console;
        return tmpDefaultProviders;
      };
      module.exports = getDefaultProviders();
    }, {
      "./Fable-Log-Logger-Console.js": 9
    }],
    8: [function (require, module, exports) {
      module.exports = [{
        "loggertype": "console",
        "streamtype": "console",
        "level": "trace"
      }];
    }, {}],
    9: [function (require, module, exports) {
      var libBaseLogger = require('./Fable-Log-BaseLogger.js');
      var ConsoleLogger = /*#__PURE__*/function (_libBaseLogger) {
        _inherits(ConsoleLogger, _libBaseLogger);
        var _super2 = _createSuper(ConsoleLogger);
        function ConsoleLogger(pLogStreamSettings, pFableLog) {
          var _this2;
          _classCallCheck(this, ConsoleLogger);
          _this2 = _super2.call(this, pLogStreamSettings);
          _this2._ShowTimeStamps = _this2._Settings.hasOwnProperty('showtimestamps') ? _this2._Settings.showtimestamps == true : true;
          _this2._FormattedTimeStamps = _this2._Settings.hasOwnProperty('formattedtimestamps') ? _this2._Settings.formattedtimestamps == true : true;
          _this2._ContextMessage = _this2._Settings.hasOwnProperty('Context') ? "(".concat(_this2._Settings.Context, ")") : pFableLog._Settings.hasOwnProperty('Product') ? "(".concat(pFableLog._Settings.Product, ")") : 'Unnamed_Log_Context';

          // Allow the user to decide what gets output to the console
          _this2._OutputLogLinesToConsole = _this2._Settings.hasOwnProperty('outputloglinestoconsole') ? _this2._Settings.outputloglinestoconsole : true;
          _this2._OutputObjectsToConsole = _this2._Settings.hasOwnProperty('outputobjectstoconsole') ? _this2._Settings.outputobjectstoconsole : true;

          // Precompute the prefix for each level
          _this2.prefixCache = {};
          for (var i = 0; i <= _this2.levels.length; i++) {
            _this2.prefixCache[_this2.levels[i]] = "[".concat(_this2.levels[i], "] ").concat(_this2._ContextMessage, ": ");
            if (_this2._ShowTimeStamps) {
              // If there is a timestamp we need a to prepend space before the prefixcache string, since the timestamp comes first
              _this2.prefixCache[_this2.levels[i]] = ' ' + _this2.prefixCache[_this2.levels[i]];
            }
          }
          return _this2;
        }
        _createClass(ConsoleLogger, [{
          key: "write",
          value: function write(pLevel, pLogText, pObject) {
            var tmpTimeStamp = '';
            if (this._ShowTimeStamps && this._FormattedTimeStamps) {
              tmpTimeStamp = new Date().toISOString();
            } else if (this._ShowTimeStamps) {
              tmpTimeStamp = +new Date();
            }
            var tmpLogLine = "".concat(tmpTimeStamp).concat(this.prefixCache[pLevel]).concat(pLogText);
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
        }]);
        return ConsoleLogger;
      }(libBaseLogger);
      module.exports = ConsoleLogger;
    }, {
      "./Fable-Log-BaseLogger.js": 6
    }],
    10: [function (require, module, exports) {
      var libConsoleLog = require('./Fable-Log-Logger-Console.js');
      var libFS = require('fs');
      var libPath = require('path');
      var SimpleFlatFileLogger = /*#__PURE__*/function (_libConsoleLog) {
        _inherits(SimpleFlatFileLogger, _libConsoleLog);
        var _super3 = _createSuper(SimpleFlatFileLogger);
        function SimpleFlatFileLogger(pLogStreamSettings, pFableLog) {
          var _this3;
          _classCallCheck(this, SimpleFlatFileLogger);
          _this3 = _super3.call(this, pLogStreamSettings, pFableLog);

          // If a path isn't provided for the logfile, it tries to use the ProductName or Context
          _this3.logFileRawPath = _this3._Settings.hasOwnProperty('path') ? _this3._Settings.path : "./".concat(_this3._ContextMessage, ".log");
          _this3.logFilePath = libPath.normalize(_this3.logFileRawPath);
          _this3.logFileStreamOptions = _this3._Settings.hasOwnProperty('fileStreamoptions') ? _this3._Settings.fileStreamOptions : {
            "flags": "a",
            "encoding": "utf8"
          };
          _this3.fileWriter = libFS.createWriteStream(_this3.logFilePath, _this3.logFileStreamOptions);
          _this3.activelyWriting = false;
          _this3.logLineStrings = [];
          _this3.logObjectStrings = [];
          _this3.defaultWriteCompleteCallback = function () {};
          _this3.defaultBufferFlushCallback = function () {};
          return _this3;
        }
        _createClass(SimpleFlatFileLogger, [{
          key: "closeWriter",
          value: function closeWriter(fCloseComplete) {
            var tmpCloseComplete = typeof fCloseComplete == 'function' ? fCloseComplete : function () {};
            if (this.fileWriter) {
              this.fileWriter.end('\n');
              return this.fileWriter.once('finish', tmpCloseComplete.bind(this));
            }
          }
        }, {
          key: "completeBufferFlushToLogFile",
          value: function completeBufferFlushToLogFile(fFlushComplete) {
            this.activelyWriting = false;
            var tmpFlushComplete = typeof fFlushComplete == 'function' ? fFlushComplete : this.defaultBufferFlushCallback;
            if (this.logLineStrings.length > 0) {
              this.flushBufferToLogFile(tmpFlushComplete);
            } else {
              return tmpFlushComplete();
            }
          }
        }, {
          key: "flushBufferToLogFile",
          value: function flushBufferToLogFile(fFlushComplete) {
            if (!this.activelyWriting) {
              // Only want to be writing one thing at a time....
              this.activelyWriting = true;
              var tmpFlushComplete = typeof fFlushComplete == 'function' ? fFlushComplete : this.defaultBufferFlushCallback;

              // Get the current buffer arrays.  These should always have matching number of elements.
              var tmpLineStrings = this.logLineStrings;
              var tmpObjectStrings = this.logObjectStrings;

              // Reset these to be filled while we process this queue...
              this.logLineStrings = [];
              this.logObjectStrings = [];

              // This is where we will put each line before writing it to the file...
              var tmpConstructedBufferOutputString = '';
              for (var i = 0; i < tmpLineStrings.length; i++) {
                // TODO: Windows Newline?   ....... yo no se!
                tmpConstructedBufferOutputString += "".concat(tmpLineStrings[i], "\n");
                if (tmpObjectStrings[i] !== false) {
                  tmpConstructedBufferOutputString += "".concat(tmpObjectStrings[i], "\n");
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
        }, {
          key: "write",
          value: function write(pLevel, pLogText, pObject) {
            var tmpLogLine = _get(_getPrototypeOf(SimpleFlatFileLogger.prototype), "write", this).call(this, pLevel, pLogText, pObject);

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
        }]);
        return SimpleFlatFileLogger;
      }(libConsoleLog);
      module.exports = SimpleFlatFileLogger;
    }, {
      "./Fable-Log-Logger-Console.js": 9,
      "fs": 1,
      "path": 4
    }],
    11: [function (require, module, exports) {
      /**
      * Fable Logging Service
      */

      var libFableServiceProviderBase = require('fable-serviceproviderbase').CoreServiceProviderBase;
      var FableLog = /*#__PURE__*/function (_libFableServiceProvi2) {
        _inherits(FableLog, _libFableServiceProvi2);
        var _super4 = _createSuper(FableLog);
        function FableLog(pSettings, pServiceHash) {
          var _this4;
          _classCallCheck(this, FableLog);
          _this4 = _super4.call(this, pSettings, pServiceHash);
          _this4.serviceType = 'Logging';
          var tmpSettings = _typeof(pSettings) === 'object' ? pSettings : {};
          _this4._Settings = tmpSettings;
          _this4._Providers = require('./Fable-Log-DefaultProviders-Node.js');
          _this4._StreamDefinitions = tmpSettings.hasOwnProperty('LogStreams') ? tmpSettings.LogStreams : require('./Fable-Log-DefaultStreams.json');
          _this4.logStreams = [];

          // This object gets decorated for one-time instantiated providers that
          //  have multiple outputs, such as bunyan.
          _this4.logProviders = {};

          // A hash list of the GUIDs for each log stream, so they can't be added to the set more than one time
          _this4.activeLogStreams = {};
          _this4.logStreamsTrace = [];
          _this4.logStreamsDebug = [];
          _this4.logStreamsInfo = [];
          _this4.logStreamsWarn = [];
          _this4.logStreamsError = [];
          _this4.logStreamsFatal = [];
          _this4.datumDecorator = function (pDatum) {
            return pDatum;
          };
          _this4.uuid = typeof tmpSettings.Product === 'string' ? tmpSettings.Product : 'Default';
          return _this4;
        }
        _createClass(FableLog, [{
          key: "addLogger",
          value: function addLogger(pLogger, pLevel) {
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
        }, {
          key: "setDatumDecorator",
          value: function setDatumDecorator(fDatumDecorator) {
            if (typeof fDatumDecorator === 'function') {
              this.datumDecorator = fDatumDecorator;
            } else {
              this.datumDecorator = function (pDatum) {
                return pDatum;
              };
            }
          }
        }, {
          key: "trace",
          value: function trace(pMessage, pDatum) {
            var tmpDecoratedDatum = this.datumDecorator(pDatum);
            for (var i = 0; i < this.logStreamsTrace.length; i++) {
              this.logStreamsTrace[i].trace(pMessage, tmpDecoratedDatum);
            }
          }
        }, {
          key: "debug",
          value: function debug(pMessage, pDatum) {
            var tmpDecoratedDatum = this.datumDecorator(pDatum);
            for (var i = 0; i < this.logStreamsDebug.length; i++) {
              this.logStreamsDebug[i].debug(pMessage, tmpDecoratedDatum);
            }
          }
        }, {
          key: "info",
          value: function info(pMessage, pDatum) {
            var tmpDecoratedDatum = this.datumDecorator(pDatum);
            for (var i = 0; i < this.logStreamsInfo.length; i++) {
              this.logStreamsInfo[i].info(pMessage, tmpDecoratedDatum);
            }
          }
        }, {
          key: "warn",
          value: function warn(pMessage, pDatum) {
            var tmpDecoratedDatum = this.datumDecorator(pDatum);
            for (var i = 0; i < this.logStreamsWarn.length; i++) {
              this.logStreamsWarn[i].warn(pMessage, tmpDecoratedDatum);
            }
          }
        }, {
          key: "error",
          value: function error(pMessage, pDatum) {
            var tmpDecoratedDatum = this.datumDecorator(pDatum);
            for (var i = 0; i < this.logStreamsError.length; i++) {
              this.logStreamsError[i].error(pMessage, tmpDecoratedDatum);
            }
          }
        }, {
          key: "fatal",
          value: function fatal(pMessage, pDatum) {
            var tmpDecoratedDatum = this.datumDecorator(pDatum);
            for (var i = 0; i < this.logStreamsFatal.length; i++) {
              this.logStreamsFatal[i].fatal(pMessage, tmpDecoratedDatum);
            }
          }
        }, {
          key: "initialize",
          value: function initialize() {
            // "initialize" each logger as defined in the logging parameters
            for (var i = 0; i < this._StreamDefinitions.length; i++) {
              var tmpStreamDefinition = Object.assign({
                loggertype: 'default',
                streamtype: 'console',
                level: 'info'
              }, this._StreamDefinitions[i]);
              if (!this._Providers.hasOwnProperty(tmpStreamDefinition.loggertype)) {
                console.log("Error initializing log stream: bad loggertype in stream definition ".concat(JSON.stringify(tmpStreamDefinition)));
              } else {
                this.addLogger(new this._Providers[tmpStreamDefinition.loggertype](tmpStreamDefinition, this), tmpStreamDefinition.level);
              }
            }

            // Now initialize each one.
            for (var _i = 0; _i < this.logStreams.length; _i++) {
              this.logStreams[_i].initialize();
            }
          }
        }, {
          key: "logTime",
          value: function logTime(pMessage, pDatum) {
            var tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time';
            var tmpTime = new Date();
            this.info("".concat(tmpMessage, " ").concat(tmpTime, " (epoch ").concat(+tmpTime, ")"), pDatum);
          }

          // Get a timestamp
        }, {
          key: "getTimeStamp",
          value: function getTimeStamp() {
            return +new Date();
          }
        }, {
          key: "getTimeDelta",
          value: function getTimeDelta(pTimeStamp) {
            var tmpEndTime = +new Date();
            return tmpEndTime - pTimeStamp;
          }

          // Log the delta between a timestamp, and now with a message
        }, {
          key: "logTimeDelta",
          value: function logTimeDelta(pTimeDelta, pMessage, pDatum) {
            var tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time Measurement';
            var tmpDatum = _typeof(pDatum) === 'object' ? pDatum : {};
            var tmpEndTime = +new Date();
            this.info("".concat(tmpMessage, " logged at (epoch ").concat(+tmpEndTime, ") took (").concat(pTimeDelta, "ms)"), pDatum);
          }
        }, {
          key: "logTimeDeltaHuman",
          value: function logTimeDeltaHuman(pTimeDelta, pMessage, pDatum) {
            var tmpMessage = typeof pMessage !== 'undefined' ? pMessage : 'Time Measurement';
            var tmpEndTime = +new Date();
            var tmpMs = parseInt(pTimeDelta % 1000);
            var tmpSeconds = parseInt(pTimeDelta / 1000 % 60);
            var tmpMinutes = parseInt(pTimeDelta / (1000 * 60) % 60);
            var tmpHours = parseInt(pTimeDelta / (1000 * 60 * 60));
            tmpMs = tmpMs < 10 ? "00" + tmpMs : tmpMs < 100 ? "0" + tmpMs : tmpMs;
            tmpSeconds = tmpSeconds < 10 ? "0" + tmpSeconds : tmpSeconds;
            tmpMinutes = tmpMinutes < 10 ? "0" + tmpMinutes : tmpMinutes;
            tmpHours = tmpHours < 10 ? "0" + tmpHours : tmpHours;
            this.info("".concat(tmpMessage, " logged at (epoch ").concat(+tmpEndTime, ") took (").concat(pTimeDelta, "ms) or (").concat(tmpHours, ":").concat(tmpMinutes, ":").concat(tmpSeconds, ".").concat(tmpMs, ")"), pDatum);
          }
        }, {
          key: "logTimeDeltaRelative",
          value: function logTimeDeltaRelative(pStartTime, pMessage, pDatum) {
            this.logTimeDelta(this.getTimeDelta(pStartTime), pMessage, pDatum);
          }
        }, {
          key: "logTimeDeltaRelativeHuman",
          value: function logTimeDeltaRelativeHuman(pStartTime, pMessage, pDatum) {
            this.logTimeDeltaHuman(this.getTimeDelta(pStartTime), pMessage, pDatum);
          }
        }]);
        return FableLog;
      }(libFableServiceProviderBase);
      module.exports = FableLog;
      module.exports.LogProviderBase = require('./Fable-Log-BaseLogger.js');
      module.exports.LogProviderConsole = require('./Fable-Log-Logger-Console.js');
      module.exports.LogProviderConsole = require('./Fable-Log-Logger-SimpleFlatFile.js');
    }, {
      "./Fable-Log-BaseLogger.js": 6,
      "./Fable-Log-DefaultProviders-Node.js": 7,
      "./Fable-Log-DefaultStreams.json": 8,
      "./Fable-Log-Logger-Console.js": 9,
      "./Fable-Log-Logger-SimpleFlatFile.js": 10,
      "fable-serviceproviderbase": 3
    }]
  }, {}, [11])(11);
});