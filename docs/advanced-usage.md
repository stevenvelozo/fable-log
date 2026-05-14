# Advanced Usage

## Datum Decoration

Transform all logged data objects before they're written to streams. This is useful for adding consistent metadata to every log entry.

### Basic Decoration

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

// `process` is Node-only; fall back to a literal for the browser playground.
const nodeEnv = (typeof process !== 'undefined' && process.env)
    ? process.env.NODE_ENV
    : 'browser';

log.setDatumDecorator((datum) => {
    return {
        ...datum,
        env: nodeEnv,
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
// Express middleware reference — Express + a real `app` aren't loaded
// in the playground, so we stub the call shape so the snippet runs.
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

const fakeApp = { use: (fn) => fn({ id: 'req-1', path: '/x', method: 'GET', ip: '1.1.1.1' }, {}, () => {}) };

fakeApp.use((req, res, next) => {
    log.setDatumDecorator((datum) => ({
        ...datum,
        requestId: req.id,
        path: req.path,
        method: req.method,
        ip: req.ip
    }));
    next();
});
log.info('after-middleware log entry', { userId: 7 });
```

### Conditional Decoration

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

const isDev = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development');
const memoryUsage = () => (typeof process !== 'undefined' && process.memoryUsage)
    ? process.memoryUsage()
    : { note: 'process.memoryUsage() is Node-only' };

log.setDatumDecorator((datum) => {
    const decorated = { ...datum };

    // Add stack trace for errors
    if (datum && datum.error instanceof Error) {
        decorated.stack = datum.error.stack;
        decorated.errorName = datum.error.name;
    }

    // Add memory usage in development
    if (isDev) {
        decorated.memory = memoryUsage();
    }

    return decorated;
});

log.error('A demo error', { error: new Error('boom') });
```

### Reset Decoration

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

log.setDatumDecorator((datum) => ({ ...datum, decorated: true }));
log.info('before reset', { hello: 1 });

// Remove decorator
log.setDatumDecorator(null);
log.info('after null reset', { hello: 2 });

// Or pass non-function to reset
log.setDatumDecorator('reset');
log.info('after string reset', { hello: 3 });
```

## Multiple Streams

### Stream Per Environment

```javascript
const FableLog = require('fable-log');

function createLogger(env) {
    const streams = [];

    // Always log errors to file (Node-only; ignored in browser)
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

// In Node: createLogger(process.env.NODE_ENV).  In the browser
// playground we hand in a literal so the snippet still runs end-to-end.
const log = createLogger('development');
log.trace('dev logger built');
```

### Dynamically Adding Streams

```javascript
const FableLog = require('fable-log');

const log = new FableLog({
    LogStreams: [
        { loggertype: 'console', level: 'info' }
    ]
});
log.initialize();

// `LogProviderFlatfile` is the Node-only file logger — undefined in
// the browser bundle.  Guard so the snippet runs cleanly in both.
const FileLogger = FableLog.LogProviderFlatfile;
if (typeof FileLogger === 'function')
{
    const fileStream = new FileLogger({
        path: './debug.log',
        level: 'debug',
        showtimestamps: true
    }, log);
    log.addLogger(fileStream, 'debug');
    fileStream.initialize();
    log.debug('file logger attached');
}
else
{
    log.info('Flat-file logger is not bundled in the browser build.');
}
```

### Stream-Specific Contexts

```javascript
const FableLog = require('fable-log');

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
log.initialize();
log.info('two contexts configured', { streams: log.logStreams.length });
```

## Time Tracking Patterns

### Operation Profiling

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

// db.query / processData are stand-ins for whatever real work
// your handler does — stubbed here so the snippet runs.
const db = { query: async (sql) => { await new Promise(r => setTimeout(r, 5)); return [{ id: 1 }]; } };
const processData = (data) => data.map(r => ({ ...r, processed: true }));

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

await processRequest({});
```

### Batch Operation Timing

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

// Stub `processItem` and a small batch so the snippet completes quickly
// in the playground.  In real code the items would be your own.
const processItem = async (item) => { await new Promise(r => setTimeout(r, 1)); return item * 2; };
const demoBatch = [1, 2, 3, 4, 5];

async function processBatch(items) {
    const batchStart = log.getTimeStamp();
    const results = [];

    for (let i = 0; i < items.length; i++) {
        const itemStart = log.getTimeStamp();

        results.push(await processItem(items[i]));

        if ((i + 1) % 2 === 0) { // log every other item for the demo
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

await processBatch(demoBatch);
```

## Integration with Fable

Fable-Log integrates seamlessly with the Fable application framework:

```javascript
const libFable = require('fable');

const app = new libFable({
    Product: 'MyApplication',
    ProductVersion: '1.0.0',
    LogStreams: [
        { loggertype: 'console', level: 'debug' }
    ]
});

// Fable automatically creates and manages the logger
app.log.info('Application started');
app.log.debug('Debug mode enabled');
```

## Error Handling Patterns

### Try-Catch Logging

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

// `dangerousCall` is a stand-in.  Here we toggle it between success
// and failure to demonstrate both branches.
const dangerousCall = async (succeed) => {
    if (!succeed) { throw Object.assign(new Error('it broke'), { code: 'E_BROKE' }); }
    return { ok: true };
};

async function riskyOperation(succeed) {
    try {
        const result = await dangerousCall(succeed);
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

await riskyOperation(true);
await riskyOperation(false).catch(() => {});
```

### Unhandled Exception Logging

```javascript
// Reference snippet — `process.on(...)` is Node-only.  In the browser
// the equivalent hooks are `window.addEventListener('error', ...)` and
// `window.addEventListener('unhandledrejection', ...)`, but we just
// print the shape here so the doc renders cleanly without bolting on
// host listeners during a doc-page Run.
console.info("In Node.js:");
console.info("  process.on('uncaughtException', (error) => { log.fatal(...); });");
console.info("  process.on('unhandledRejection', (reason) => { log.error(...); });");
```
