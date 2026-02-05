# Log Providers

Fable-Log uses a provider architecture that allows logs to be sent to different destinations. Each provider is a class that extends the base logger and implements the `write()` method.

## Built-in Providers

### Console Provider

The console provider outputs logs to the standard console using `console.log()`.

#### Configuration

```javascript
{
    loggertype: 'console',
    level: 'trace',
    showtimestamps: true,          // Show timestamps (default: true)
    formattedtimestamps: true,     // Use ISO format (default: true)
    outputloglinestoconsole: true, // Output log lines (default: true)
    outputobjectstoconsole: true,  // Output data objects (default: true)
    Context: 'MyContext'           // Custom context label
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

```javascript
{
    loggertype: 'simpleflatfile',
    level: 'info',
    path: './logs/application.log',
    showtimestamps: true,
    formattedtimestamps: true,
    outputloglinestoconsole: false,  // Don't also output to console
    fileStreamOptions: {
        flags: 'a',                   // Append mode
        encoding: 'utf8'
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
// Get reference to file stream
const fileStream = log.logStreams[0];

// Manually flush buffer to file
fileStream.flushBufferToLogFile(callback);

// Close the file writer
fileStream.closeWriter(callback);
```

#### Example: Graceful Shutdown

```javascript
process.on('SIGTERM', () => {
    // Find file loggers and close them
    log.logStreams.forEach(stream => {
        if (stream.closeWriter) {
            stream.closeWriter(() => {
                console.log('Log file closed');
            });
        }
    });
});
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

// Provider classes
const BaseLogger = FableLog.LogProviderBase;
const ConsoleLogger = FableLog.LogProviderConsole;
const FlatFileLogger = FableLog.LogProviderFlatfile;
```
