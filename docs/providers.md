# Log Providers

Fable-Log uses a provider architecture that allows logs to be sent to different destinations. Each provider is a class that extends the base logger and implements the `write()` method.

## Built-in Providers

### Console Provider

The console provider outputs logs to the standard console using `console.log()`.

#### Configuration

```json
{
    "loggertype": "console",
    "level": "trace",
    "showtimestamps": true,
    "formattedtimestamps": true,
    "outputloglinestoconsole": true,
    "outputobjectstoconsole": true,
    "Context": "MyContext"
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showtimestamps` | boolean | `true` | Include timestamps in output |
| `formattedtimestamps` | boolean | `true` | Use ISO 8601 format; false uses epoch |
| `outputloglinestoconsole` | boolean | `true` | Output the log message line |
| `outputobjectstoconsole` | boolean | `true` | Output the data object as JSON |
| `Context` | string | Product name | Context label shown in log prefix |

#### Output Format

```
2024-01-15T10:30:00.000Z [info] (MyApp): User logged in
{
  "userId": 123,
  "ip": "192.168.1.1"
}
```

### Simple Flat File Provider

The simple flat file provider writes logs to a file on disk. It uses a buffered writing approach for performance.

#### Configuration

```json
{
    "loggertype": "simpleflatfile",
    "level": "info",
    "path": "./logs/application.log",
    "showtimestamps": true,
    "formattedtimestamps": true,
    "outputloglinestoconsole": false,
    "fileStreamOptions": {
        "flags": "a",
        "encoding": "utf8"
    }
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `path` | string | `./{Context}.log` | File path for log output |
| `fileStreamOptions` | object | `{flags:'a', encoding:'utf8'}` | Node.js fs.createWriteStream options |
| `outputloglinestoconsole` | boolean | `true` | Also output to console |

#### Methods

The file provider exposes additional methods for file management:

```javascript
// Reference snippet — `simpleflatfile` is Node-only and isn't available
// in the browser playground.  Shown here as the shape of the methods.
console.info("In Node.js with a simpleflatfile stream:");
console.info("  const fileStream = log.logStreams[0];");
console.info("  fileStream.flushBufferToLogFile(callback);");
console.info("  fileStream.closeWriter(callback);");
```

#### Example: Graceful Shutdown

```javascript
// Reference snippet — `process.on('SIGTERM', ...)` is Node-only.  In the
// browser playground we just show what the shutdown handler would look
// like; in a real Node service the callback fires when the process
// receives SIGTERM.
console.info("In Node.js:");
console.info("  process.on('SIGTERM', () => {");
console.info("      log.logStreams.forEach(stream => {");
console.info("          if (stream.closeWriter) {");
console.info("              stream.closeWriter(() => console.log('Log file closed'));");
console.info("          }");
console.info("      });");
console.info("  });");
```

## Provider Availability

| Provider | Node.js | Browser |
|----------|---------|---------|
| console | Yes | Yes |
| simpleflatfile | Yes | No |

In browser environments, only the console provider is available by default. The browser build automatically excludes file-based providers.

## Accessing Providers

Providers can be accessed directly from the module:

```javascript
const FableLog = require('fable-log');

// Provider classes — these are static properties on the FableLog
// constructor.  In the browser bundle the file logger isn't exported
// (file IO is Node-only), so guard accordingly.
const BaseLogger     = FableLog.LogProviderBase;
const ConsoleLogger  = FableLog.LogProviderConsole;
const FlatFileLogger = FableLog.LogProviderFlatfile; // undefined in browser builds

console.log('BaseLogger:',     typeof BaseLogger);
console.log('ConsoleLogger:',  typeof ConsoleLogger);
console.log('FlatFileLogger:', typeof FlatFileLogger);
```
