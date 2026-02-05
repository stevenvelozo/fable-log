# API Reference

## FableLog Class

The main logging service class.

### Constructor

```javascript
const log = new FableLog(settings, serviceHash);
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
log.initialize();
```

#### addLogger(logger, level)

Manually add a logger instance at a specific level.

```javascript
const customLogger = new CustomLogProvider(settings);
log.addLogger(customLogger, 'info');
```

Returns `true` if added successfully, `false` if already exists.

#### setDatumDecorator(fn)

Set a function to transform data objects before logging.

```javascript
log.setDatumDecorator((datum) => {
    return {
        ...datum,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    };
});
```

---

## Logging Methods

All logging methods accept a message and optional data object.

### trace(message, datum)

Log at trace level (10) - detailed debugging.

```javascript
log.trace('Entering function', { args: [1, 2, 3] });
```

### debug(message, datum)

Log at debug level (20) - debug information.

```javascript
log.debug('Cache miss', { key: 'user:123' });
```

### info(message, datum)

Log at info level (30) - general information.

```javascript
log.info('Server started', { port: 3000 });
```

### warn(message, datum)

Log at warn level (40) - warning conditions.

```javascript
log.warn('Deprecated API used', { endpoint: '/old/api' });
```

### error(message, datum)

Log at error level (50) - error conditions.

```javascript
log.error('Database query failed', { error: err.message });
```

### fatal(message, datum)

Log at fatal level (60) - critical errors.

```javascript
log.fatal('Application crash', { stack: err.stack });
```

---

## Time Tracking Methods

Built-in methods for measuring and logging operation durations.

### getTimeStamp()

Get the current timestamp as epoch milliseconds.

```javascript
const start = log.getTimeStamp();
// ... do work ...
```

### getTimeDelta(startTime)

Calculate milliseconds elapsed since a start time.

```javascript
const start = log.getTimeStamp();
// ... do work ...
const elapsed = log.getTimeDelta(start); // e.g., 1523
```

### logTime(message, datum)

Log the current time.

```javascript
log.logTime('Checkpoint reached');
// Output: "Checkpoint reached 2024-01-15T10:30:00.000Z (epoch 1705315800000)"
```

### logTimeDelta(delta, message, datum)

Log a pre-calculated time delta.

```javascript
const delta = log.getTimeDelta(startTime);
log.logTimeDelta(delta, 'Operation complete');
// Output: "Operation complete logged at (epoch 1705315800000) took (1523ms)"
```

### logTimeDeltaHuman(delta, message, datum)

Log a time delta in human-readable format.

```javascript
log.logTimeDeltaHuman(3661523, 'Long operation');
// Output: "... took (3661523ms) or (01:01:01.523)"
```

### logTimeDeltaRelative(startTime, message, datum)

Calculate and log time delta from a start timestamp.

```javascript
const start = log.getTimeStamp();
// ... do work ...
log.logTimeDeltaRelative(start, 'Work completed');
```

### logTimeDeltaRelativeHuman(startTime, message, datum)

Calculate and log time delta in human-readable format.

```javascript
const start = log.getTimeStamp();
// ... long running work ...
log.logTimeDeltaRelativeHuman(start, 'Batch job finished');
// Output: "Batch job finished ... took (125000ms) or (00:02:05.000)"
```

---

## BaseLogger Class

The base class for creating custom log providers.

### Constructor

```javascript
class MyProvider extends FableLog.LogProviderBase {
    constructor(settings, serviceHash) {
        super(settings, serviceHash);
    }
}
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
write(pLevel, pLogText, pObject) {
    // Your implementation here
    return true;
}
```

#### generateInsecureUUID()

Generate a simple UUID for logger identification.

```javascript
const uuid = this.generateInsecureUUID();
// Returns: "LOGSTREAM-a1b2c3-d4e5f6"
```
