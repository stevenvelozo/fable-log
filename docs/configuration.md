# Configuration

Fable-Log is configured via a settings object passed to the constructor. All settings are optional - the library works with sensible defaults.

## Configuration Object

```javascript
const settings = {
    Product: 'MyApplication',      // Application name for log context
    ProductVersion: '1.0.0',       // Application version
    UUID: {
        DataCenter: 1,             // Data center identifier
        Worker: 1                  // Worker identifier
    },
    LogStreams: [                  // Array of stream definitions
        // ... stream configurations
    ]
};

const log = new FableLog(settings);
```

## Settings Reference

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Product` | string | `'Default'` | Application/product name used in log context |
| `ProductVersion` | string | `'0.0.0'` | Version string for log context |
| `UUID` | object | `{}` | UUID configuration for distributed systems |
| `LogStreams` | array | Console at trace | Array of log stream definitions |

## Log Streams

The `LogStreams` array defines where and how logs are output. Each stream is an independent destination with its own configuration.

### Stream Definition

```javascript
{
    loggertype: 'console',      // Provider type
    streamtype: 'console',      // Stream subtype (provider-specific)
    level: 'info'               // Minimum log level for this stream
}
```

### Stream Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loggertype` | string | `'default'` | Provider type: `'console'`, `'simpleflatfile'`, or custom |
| `streamtype` | string | `'console'` | Stream subtype (used by some providers) |
| `level` | string | `'info'` | Minimum log level to capture |

## Log Levels

Fable-Log supports six log levels, from most verbose to most critical:

| Level | Value | Description |
|-------|-------|-------------|
| `trace` | 10 | Detailed debugging information |
| `debug` | 20 | Debug information |
| `info` | 30 | General informational messages |
| `warn` | 40 | Warning conditions |
| `error` | 50 | Error conditions |
| `fatal` | 60 | Critical/fatal errors |

Setting a stream's level includes all levels at or above that severity. For example, `level: 'warn'` captures warn, error, and fatal messages.

## Default Configuration

Without any configuration, fable-log uses:

```javascript
{
    LogStreams: [
        {
            loggertype: 'console',
            streamtype: 'console',
            level: 'trace'
        }
    ]
}
```

## Example Configurations

### Development Environment

```javascript
const log = new FableLog({
    Product: 'MyApp',
    LogStreams: [
        {
            loggertype: 'console',
            level: 'trace',
            showtimestamps: true,
            formattedtimestamps: true
        }
    ]
});
```

### Production Environment

```javascript
const log = new FableLog({
    Product: 'MyApp',
    ProductVersion: '2.1.0',
    LogStreams: [
        {
            loggertype: 'console',
            level: 'warn'  // Only warnings and errors to console
        },
        {
            loggertype: 'simpleflatfile',
            level: 'info',
            path: '/var/log/myapp/application.log'
        },
        {
            loggertype: 'simpleflatfile',
            level: 'error',
            path: '/var/log/myapp/errors.log'
        }
    ]
});
```

### Quiet Mode (Errors Only)

```javascript
const log = new FableLog({
    LogStreams: [
        {
            loggertype: 'console',
            level: 'error'
        }
    ]
});
```
