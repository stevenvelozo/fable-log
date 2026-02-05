# Advanced Usage

## Datum Decoration

Transform all logged data objects before they're written to streams. This is useful for adding consistent metadata to every log entry.

### Basic Decoration

```javascript
const log = new FableLog();
log.initialize();

log.setDatumDecorator((datum) => {
    return {
        ...datum,
        env: process.env.NODE_ENV,
        version: '1.0.0',
        timestamp: new Date().toISOString()
    };
});

log.info('User action', { userId: 123 });
// Datum becomes: { userId: 123, env: 'production', version: '1.0.0', timestamp: '...' }
```

### Request Context

Add request-specific context in web applications:

```javascript
// Express middleware
app.use((req, res, next) => {
    log.setDatumDecorator((datum) => ({
        ...datum,
        requestId: req.id,
        path: req.path,
        method: req.method,
        ip: req.ip
    }));
    next();
});
```

### Conditional Decoration

```javascript
log.setDatumDecorator((datum) => {
    const decorated = { ...datum };

    // Add stack trace for errors
    if (datum && datum.error instanceof Error) {
        decorated.stack = datum.error.stack;
        decorated.errorName = datum.error.name;
    }

    // Add memory usage in development
    if (process.env.NODE_ENV === 'development') {
        decorated.memory = process.memoryUsage();
    }

    return decorated;
});
```

### Reset Decoration

```javascript
// Remove decorator
log.setDatumDecorator(null);

// Or pass non-function to reset
log.setDatumDecorator('reset');
```

## Multiple Streams

### Stream Per Environment

```javascript
function createLogger(env) {
    const streams = [];

    // Always log errors to file
    streams.push({
        loggertype: 'simpleflatfile',
        level: 'error',
        path: './logs/errors.log'
    });

    if (env === 'development') {
        streams.push({
            loggertype: 'console',
            level: 'trace'
        });
    } else if (env === 'production') {
        streams.push({
            loggertype: 'console',
            level: 'warn'
        });
        streams.push({
            loggertype: 'simpleflatfile',
            level: 'info',
            path: './logs/application.log'
        });
    }

    const log = new FableLog({ LogStreams: streams });
    log.initialize();
    return log;
}

const log = createLogger(process.env.NODE_ENV);
```

### Dynamically Adding Streams

```javascript
const log = new FableLog({
    LogStreams: [
        { loggertype: 'console', level: 'info' }
    ]
});
log.initialize();

// Add a file logger later
const FileLogger = require('fable-log').LogProviderFlatfile;
const fileStream = new FileLogger({
    path: './debug.log',
    level: 'debug',
    showtimestamps: true
}, log);

log.addLogger(fileStream, 'debug');
fileStream.initialize();
```

### Stream-Specific Contexts

```javascript
const log = new FableLog({
    LogStreams: [
        {
            loggertype: 'console',
            level: 'debug',
            Context: 'APP'
        },
        {
            loggertype: 'simpleflatfile',
            level: 'info',
            path: './audit.log',
            Context: 'AUDIT'
        }
    ]
});
```

## Time Tracking Patterns

### Operation Profiling

```javascript
async function processRequest(req) {
    const startTime = log.getTimeStamp();

    log.debug('Starting request processing');

    // Database query
    const dbStart = log.getTimeStamp();
    const data = await db.query('...');
    log.debug('Database query', { ms: log.getTimeDelta(dbStart) });

    // Business logic
    const processStart = log.getTimeStamp();
    const result = processData(data);
    log.debug('Data processing', { ms: log.getTimeDelta(processStart) });

    // Total time
    log.logTimeDeltaRelativeHuman(startTime, 'Request completed');

    return result;
}
```

### Batch Operation Timing

```javascript
async function processBatch(items) {
    const batchStart = log.getTimeStamp();
    const results = [];

    for (let i = 0; i < items.length; i++) {
        const itemStart = log.getTimeStamp();

        results.push(await processItem(items[i]));

        if ((i + 1) % 100 === 0) {
            log.info(`Processed ${i + 1}/${items.length}`, {
                batchTime: log.getTimeDelta(batchStart),
                avgPerItem: log.getTimeDelta(batchStart) / (i + 1)
            });
        }
    }

    log.logTimeDeltaRelativeHuman(batchStart, 'Batch complete', {
        totalItems: items.length,
        avgMs: log.getTimeDelta(batchStart) / items.length
    });

    return results;
}
```

## Integration with Fable

Fable-Log integrates seamlessly with the Fable application framework:

```javascript
const libFable = require('fable');

const fable = new libFable({
    Product: 'MyApplication',
    ProductVersion: '1.0.0',
    LogStreams: [
        { loggertype: 'console', level: 'debug' }
    ]
});

// Fable automatically creates and manages the logger
fable.log.info('Application started');
fable.log.debug('Debug mode enabled');
```

## Error Handling Patterns

### Try-Catch Logging

```javascript
async function riskyOperation() {
    try {
        const result = await dangerousCall();
        log.debug('Operation succeeded', { result });
        return result;
    } catch (error) {
        log.error('Operation failed', {
            error: error.message,
            stack: error.stack,
            code: error.code
        });
        throw error;
    }
}
```

### Unhandled Exception Logging

```javascript
process.on('uncaughtException', (error) => {
    log.fatal('Uncaught exception', {
        message: error.message,
        stack: error.stack
    });

    // Give time for async loggers to flush
    setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled rejection', {
        reason: reason?.message || reason,
        stack: reason?.stack
    });
});
```
