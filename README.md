# Fable-Log

A flexible, extensible logging framework for Node.js and browser applications.

[![Build Status](https://travis-ci.org/stevenvelozo/fable-log.svg?branch=master)](https://travis-ci.org/stevenvelozo/fable-log)
[![npm version](https://badge.fury.io/js/fable-log.svg)](https://badge.fury.io/js/fable-log)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Why Fable-Log?

Although there's no shortage of logging libraries, the effort to set up consistent, configurable logging across applications is not trivial. Want MongoDB logging in production and console logging for tests? Multiple output destinations? Browser compatibility? Fable-Log provides a simple, drop-in solution with a standard configuration interface.

## Features

- **Multiple Log Streams** - Route logs to console, files, or custom destinations simultaneously
- **Six Log Levels** - trace, debug, info, warn, error, fatal
- **Browser Compatible** - Works in both Node.js and browser environments
- **Extensible Providers** - Create custom log providers for any destination
- **Time Tracking** - Built-in methods for timing and profiling operations
- **Datum Decoration** - Transform log data before output
- **Zero Configuration** - Works out of the box with sensible defaults

## Installation

```bash
npm install fable-log
```

## Quick Start

```javascript
const FableLog = require('fable-log');

const log = new FableLog();
log.initialize();

// Log at any level
log.trace('Detailed trace information');
log.debug('Debug information');
log.info('Informational message');
log.warn('Warning message');
log.error('Error occurred');
log.fatal('Fatal error');

// Include data objects
log.info('User logged in', { userId: 123, ip: '192.168.1.1' });
```

## Configuration

Pass a settings object to customize behavior:

```javascript
const log = new FableLog({
    Product: 'MyApplication',
    ProductVersion: '1.0.0',
    LogStreams: [
        {
            loggertype: 'console',
            level: 'debug',
            showtimestamps: true,
            formattedtimestamps: true
        },
        {
            loggertype: 'simpleflatfile',
            level: 'info',
            path: './logs/application.log'
        }
    ]
});

log.initialize();
```

## Log Levels

| Level | Description |
|-------|-------------|
| `trace` | Detailed debugging information |
| `debug` | Debug information |
| `info` | General informational messages |
| `warn` | Warning conditions |
| `error` | Error conditions |
| `fatal` | Critical/fatal errors |

## Built-in Providers

### Console Provider

```javascript
{
    loggertype: 'console',
    level: 'trace',
    showtimestamps: true,
    formattedtimestamps: true,
    Context: 'MyApp'
}
```

### Simple Flat File Provider

```javascript
{
    loggertype: 'simpleflatfile',
    level: 'info',
    path: './logs/app.log'
}
```

## Time Tracking

Built-in methods for measuring operation durations:

```javascript
const startTime = log.getTimeStamp();

// ... perform operation ...

log.logTimeDeltaRelative(startTime, 'Operation complete');
// Output: "Operation complete logged at (epoch 1705315800000) took (1523ms)"

log.logTimeDeltaRelativeHuman(startTime, 'Long operation');
// Output: "Long operation ... took (125000ms) or (00:02:05.000)"
```

## Browser Usage

Fable-Log works in browser environments with automatic provider adaptation:

```javascript
// With bundler (webpack, rollup, etc.)
import FableLog from 'fable-log';

const log = new FableLog();
log.initialize();
log.info('Hello from the browser!');
```

## Custom Providers

Create custom providers by extending the base logger:

```javascript
const BaseLogger = require('fable-log').LogProviderBase;

class MyCustomProvider extends BaseLogger {
    write(pLevel, pLogText, pObject) {
        // Your implementation
    }
}

// Register and use
log._Providers.mycustom = MyCustomProvider;
```

## Documentation

Full documentation is available in the [`docs`](./docs) folder:

- [Getting Started](./docs/getting-started.md)
- [Configuration](./docs/configuration.md)
- [Log Providers](./docs/providers.md)
- [API Reference](./docs/api-reference.md)
- [Custom Providers](./docs/custom-providers.md)
- [Browser Usage](./docs/browser-usage.md)
- [Advanced Usage](./docs/advanced-usage.md)

### Viewing Documentation Locally

Serve the docs folder with any static server:

```bash
npx docsify-cli serve docs
```

Then open http://localhost:3000 in your browser.

## Part of the Fable Ecosystem

Fable-Log is designed to work seamlessly with other Fable packages:

- [fable](https://github.com/stevenvelozo/fable) - Application services framework
- [fable-serviceproviderbase](https://github.com/stevenvelozo/fable-serviceproviderbase) - Service provider base class
- [pict](https://github.com/stevenvelozo/pict) - UI framework

## Testing

Run the test suite:

```bash
npm test
```

Run with coverage:

```bash
npm run coverage
```

## Related Packages

- [fable](https://github.com/stevenvelozo/fable) - Application services framework
- [fable-log-logger-bunyan](https://github.com/stevenvelozo/fable-log-logger-bunyan) - Bunyan logger for Fable-Log
- [fable-serviceproviderbase](https://github.com/stevenvelozo/fable-serviceproviderbase) - Service provider base class

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
