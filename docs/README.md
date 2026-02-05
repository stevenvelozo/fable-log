# Fable-Log

> A flexible, extensible logging framework for Node.js and browser applications.

## What is Fable-Log?

Fable-Log is a lightweight logging wrapper that provides a consistent logging interface across the Fable package ecosystem. It supports multiple simultaneous log streams, customizable log levels, and works seamlessly in both Node.js and browser environments.

## Features

- **Multiple Log Streams**: Route logs to console, files, or custom destinations simultaneously
- **Six Log Levels**: trace, debug, info, warn, error, fatal
- **Browser Compatible**: Works in both Node.js and browser environments
- **Extensible Providers**: Create custom log providers for any destination
- **Time Tracking**: Built-in methods for timing operations
- **Datum Decoration**: Transform log data before output
- **Zero Configuration**: Works out of the box with sensible defaults

## Quick Example

```javascript
const FableLog = require('fable-log');

// Create a logger with default console output
const log = new FableLog();
log.initialize();

// Start logging!
log.info('Application started');
log.debug('Processing request', { userId: 123 });
log.error('Something went wrong', { error: 'Connection failed' });
```

## Installation

```bash
npm install fable-log
```

## Part of the Fable Ecosystem

Fable-Log is designed to work seamlessly with other Fable packages:

- [fable](https://github.com/stevenvelozo/fable) - Application services framework
- [fable-serviceproviderbase](https://github.com/stevenvelozo/fable-serviceproviderbase) - Service provider base class
- [pict](https://github.com/stevenvelozo/pict) - UI framework

## License

MIT
