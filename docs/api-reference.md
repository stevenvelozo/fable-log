# API Reference

## FableLog Class

The main logging service class.

### Constructor

```javascript
const FableLog = require('fable-log');

const settings = { Product: 'ApiRefDemo' };
const log = new FableLog(settings);
log.initialize();
log.info('constructor invoked', { product: settings.Product });
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `settings` | object | Configuration object (optional) |
| `serviceHash` | object | Service provider hash (optional) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `uuid` | string | Logger identifier (Product name or 'Default') |
| `logStreams` | array | Array of active log stream instances |
| `logProviders` | object | Hash of provider instances |
| `serviceType` | string | Always `'Logging'` |

### Methods

#### initialize()

Initializes all configured log streams. Must be called before logging.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
console.log('streams initialized:', log.logStreams.length);
```

#### addLogger(logger, level)

Manually add a logger instance at a specific level.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

// Build a tiny custom logger inline (subclassing the base would also work).
const customLogger = {
    loggerUUID: 'demo-logger',
    initialize: () => {},
    trace: (m, d) => console.log('[demo trace]', m, d),
    debug: (m, d) => console.log('[demo debug]', m, d),
    info:  (m, d) => console.log('[demo info]',  m, d),
    warn:  (m, d) => console.log('[demo warn]',  m, d),
    error: (m, d) => console.log('[demo error]', m, d),
    fatal: (m, d) => console.log('[demo fatal]', m, d)
};
const added = log.addLogger(customLogger, 'info');
console.log('added?', added);
log.info('routes through both default + demo loggers');
```

Returns `true` if added successfully, `false` if already exists.

#### setDatumDecorator(fn)

Set a function to transform data objects before logging.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();

// `process` is Node-only; guard so the snippet runs cleanly in the
// browser playground too.
const nodeEnv = (typeof process !== 'undefined' && process.env)
    ? process.env.NODE_ENV
    : 'browser';

log.setDatumDecorator((datum) => {
    return {
        ...datum,
        timestamp: new Date().toISOString(),
        env: nodeEnv
    };
});
log.info('decorated info', { userId: 42 });
```

---

## Logging Methods

All logging methods accept a message and optional data object.

### trace(message, datum)

Log at trace level (10) - detailed debugging.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
log.trace('Entering function', { args: [1, 2, 3] });
```

### debug(message, datum)

Log at debug level (20) - debug information.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
log.debug('Cache miss', { key: 'user:123' });
```

### info(message, datum)

Log at info level (30) - general information.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
log.info('Server started', { port: 3000 });
```

### warn(message, datum)

Log at warn level (40) - warning conditions.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
log.warn('Deprecated API used', { endpoint: '/old/api' });
```

### error(message, datum)

Log at error level (50) - error conditions.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const err = new Error('Connection refused');
log.error('Database query failed', { error: err.message });
```

### fatal(message, datum)

Log at fatal level (60) - critical errors.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const err = new Error('Out of memory');
log.fatal('Application crash', { stack: err.stack });
```

---

## Time Tracking Methods

Built-in methods for measuring and logging operation durations.

### getTimeStamp()

Get the current timestamp as epoch milliseconds.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const start = log.getTimeStamp();
console.log('start:', start);
```

### getTimeDelta(startTime)

Calculate milliseconds elapsed since a start time.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const start = log.getTimeStamp();
// Simulate a tiny bit of work.
for (let i = 0; i < 1e5; i++) { /* spin */ }
const elapsed = log.getTimeDelta(start);
console.log('elapsed ms:', elapsed);
```

### logTime(message, datum)

Log the current time.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
log.logTime('Checkpoint reached');
// Output: "Checkpoint reached 2024-01-15T10:30:00.000Z (epoch 1705315800000)"
```

### logTimeDelta(delta, message, datum)

Log a pre-calculated time delta.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const startTime = log.getTimeStamp();
for (let i = 0; i < 1e5; i++) { /* spin */ }
const delta = log.getTimeDelta(startTime);
log.logTimeDelta(delta, 'Operation complete');
// Output: "Operation complete logged at (epoch 1705315800000) took (1523ms)"
```

### logTimeDeltaHuman(delta, message, datum)

Log a time delta in human-readable format.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
log.logTimeDeltaHuman(3661523, 'Long operation');
// Output: "... took (3661523ms) or (01:01:01.523)"
```

### logTimeDeltaRelative(startTime, message, datum)

Calculate and log time delta from a start timestamp.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const start = log.getTimeStamp();
for (let i = 0; i < 1e5; i++) { /* spin */ }
log.logTimeDeltaRelative(start, 'Work completed');
```

### logTimeDeltaRelativeHuman(startTime, message, datum)

Calculate and log time delta in human-readable format.

```javascript
const FableLog = require('fable-log');
const log = new FableLog();
log.initialize();
const start = log.getTimeStamp();
for (let i = 0; i < 1e5; i++) { /* spin */ }
log.logTimeDeltaRelativeHuman(start, 'Batch job finished');
// Output: "Batch job finished ... took (125000ms) or (00:02:05.000)"
```

---

## BaseLogger Class

The base class for creating custom log providers.

### Constructor

```javascript
const FableLog = require('fable-log');

class MyProvider extends FableLog.LogProviderBase {
    constructor(settings, serviceHash) {
        super(settings, serviceHash);
    }
}
console.log('MyProvider defined:', typeof MyProvider);
console.log('Instance:', new MyProvider({}, null).serviceType);
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `loggerUUID` | string | Unique identifier for this logger instance |
| `levels` | array | `['trace', 'debug', 'info', 'warn', 'error', 'fatal']` |
| `serviceType` | string | Always `'Logging-Provider'` |

### Methods

#### initialize()

Called during log service initialization. Override for setup logic.

#### write(level, message, datum)

Core writing method. Override this to implement custom output.

```javascript
const FableLog = require('fable-log');

class CapturingProvider extends FableLog.LogProviderBase {
    constructor(settings, serviceHash) {
        super(settings, serviceHash);
        this.captured = [];
    }
    write(pLevel, pLogText, pObject) {
        this.captured.push({ level: pLevel, message: pLogText, datum: pObject });
        return true;
    }
}

const provider = new CapturingProvider({}, null);
provider.write('info', 'hello', { from: 'demo' });
console.log('captured:', provider.captured);
```

#### generateInsecureUUID()

Generate a simple UUID for logger identification.

```javascript
const FableLog = require('fable-log');

const provider = new FableLog.LogProviderBase({}, null);
const uuid = provider.generateInsecureUUID();
console.log('uuid:', uuid);
// Returns: "LOGSTREAM-a1b2c3-d4e5f6"
```
