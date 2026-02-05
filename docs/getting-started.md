# Getting Started

## Installation

Install fable-log using npm:

```bash
npm install fable-log
```

## Basic Usage

The simplest way to get started is to create a logger with default settings:

```javascript
const FableLog = require('fable-log');

const log = new FableLog();
log.initialize();

// Now you can log at any level
log.trace('Detailed trace information');
log.debug('Debug information');
log.info('Informational message');
log.warn('Warning message');
log.error('Error occurred');
log.fatal('Fatal error');
```

## Logging with Data Objects

You can pass an optional data object as the second parameter to any logging method:

```javascript
log.info('User logged in', {
    userId: 12345,
    username: 'john_doe',
    timestamp: new Date().toISOString()
});

log.error('Database connection failed', {
    host: 'localhost',
    port: 5432,
    error: 'Connection refused'
});
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
            level: 'info',
            showtimestamps: true,
            formattedtimestamps: true
        }
    ]
});

log.initialize();
```

## Multiple Log Streams

Route logs to multiple destinations simultaneously:

```javascript
const log = new FableLog({
    Product: 'MyApplication',
    LogStreams: [
        {
            loggertype: 'console',
            level: 'debug'
        },
        {
            loggertype: 'simpleflatfile',
            level: 'info',
            path: './logs/app.log'
        }
    ]
});

log.initialize();

// This goes to console only (debug level)
log.debug('Debug message');

// This goes to both console and file (info level and above)
log.info('Info message');
```

## Next Steps

- Learn about [Configuration Options](configuration.md)
- Explore [Log Providers](providers.md)
- Read the [API Reference](api-reference.md)
