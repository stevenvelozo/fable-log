# Custom Providers

Fable-Log's provider architecture makes it easy to create custom log destinations. You can send logs to databases, external services, message queues, or any other destination.

## Creating a Custom Provider

### Basic Structure

```javascript
const FableLog = require('fable-log');
const BaseLogger = FableLog.LogProviderBase;

class MyCustomProvider extends BaseLogger {
    constructor(pLogStreamSettings, pFableLog) {
        super(pLogStreamSettings, pFableLog);

        // Access settings via this._Settings
        this.myOption = this._Settings.myOption || 'default';
    }

    initialize() {
        // Setup connections, open files, etc.
        // Called when log.initialize() is called
    }

    write(pLevel, pLogText, pObject) {
        // Core logging implementation
        // pLevel: 'trace', 'debug', 'info', 'warn', 'error', 'fatal'
        // pLogText: The log message string
        // pObject: Optional data object

        // Return a value (used by some providers)
        return true;
    }
}

module.exports = MyCustomProvider;
```

### Registering the Provider

```javascript
const FableLog = require('fable-log');
const MyCustomProvider = require('./my-custom-provider');

const log = new FableLog({
    LogStreams: [
        {
            loggertype: 'mycustom',
            level: 'info',
            myOption: 'custom-value'
        }
    ]
});

// Register the provider before initializing
log._Providers.mycustom = MyCustomProvider;

log.initialize();
```

## Example: HTTP Log Provider

Send logs to an HTTP endpoint:

```javascript
const BaseLogger = require('fable-log').LogProviderBase;

class HttpLogger extends BaseLogger {
    constructor(pLogStreamSettings, pFableLog) {
        super(pLogStreamSettings, pFableLog);

        this.endpoint = this._Settings.endpoint || 'http://localhost:3000/logs';
        this.headers = this._Settings.headers || {};
        this.batchSize = this._Settings.batchSize || 10;
        this.flushInterval = this._Settings.flushInterval || 5000;

        this.buffer = [];
        this.flushTimer = null;
    }

    initialize() {
        // Start periodic flush
        this.flushTimer = setInterval(() => {
            this.flush();
        }, this.flushInterval);
    }

    write(pLevel, pLogText, pObject) {
        const entry = {
            timestamp: new Date().toISOString(),
            level: pLevel,
            message: pLogText,
            data: pObject,
            logger: this.loggerUUID
        };

        this.buffer.push(entry);

        if (this.buffer.length >= this.batchSize) {
            this.flush();
        }

        return entry;
    }

    async flush() {
        if (this.buffer.length === 0) return;

        const entries = this.buffer;
        this.buffer = [];

        try {
            await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.headers
                },
                body: JSON.stringify({ logs: entries })
            });
        } catch (err) {
            // Re-add to buffer on failure
            this.buffer = [...entries, ...this.buffer];
            console.error('Failed to send logs:', err);
        }
    }

    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        return this.flush();
    }
}

module.exports = HttpLogger;
```

Usage:

```javascript
const log = new FableLog({
    LogStreams: [
        {
            loggertype: 'http',
            level: 'warn',
            endpoint: 'https://logs.example.com/ingest',
            headers: { 'X-API-Key': 'secret' },
            batchSize: 50,
            flushInterval: 10000
        }
    ]
});

log._Providers.http = HttpLogger;
log.initialize();
```

## Example: MongoDB Provider

```javascript
const BaseLogger = require('fable-log').LogProviderBase;
const { MongoClient } = require('mongodb');

class MongoLogger extends BaseLogger {
    constructor(pLogStreamSettings, pFableLog) {
        super(pLogStreamSettings, pFableLog);

        this.connectionString = this._Settings.connectionString;
        this.database = this._Settings.database || 'logs';
        this.collection = this._Settings.collection || 'application';

        this.client = null;
        this.db = null;
    }

    async initialize() {
        this.client = new MongoClient(this.connectionString);
        await this.client.connect();
        this.db = this.client.db(this.database);
    }

    write(pLevel, pLogText, pObject) {
        const doc = {
            timestamp: new Date(),
            level: pLevel,
            message: pLogText,
            data: pObject,
            logger: this.loggerUUID
        };

        // Fire and forget - don't block logging
        this.db.collection(this.collection)
            .insertOne(doc)
            .catch(err => console.error('MongoDB log failed:', err));

        return doc;
    }

    async close() {
        if (this.client) {
            await this.client.close();
        }
    }
}

module.exports = MongoLogger;
```

## Extending Built-in Providers

You can also extend existing providers:

```javascript
const ConsoleLogger = require('fable-log').LogProviderConsole;

class ColoredConsoleLogger extends ConsoleLogger {
    constructor(pLogStreamSettings, pFableLog) {
        super(pLogStreamSettings, pFableLog);

        this.colors = {
            trace: '\x1b[90m',  // Gray
            debug: '\x1b[36m',  // Cyan
            info: '\x1b[32m',   // Green
            warn: '\x1b[33m',   // Yellow
            error: '\x1b[31m',  // Red
            fatal: '\x1b[35m'   // Magenta
        };
        this.reset = '\x1b[0m';
    }

    write(pLevel, pLogText, pObject) {
        const color = this.colors[pLevel] || '';
        const coloredText = `${color}${pLogText}${this.reset}`;

        return super.write(pLevel, coloredText, pObject);
    }
}

module.exports = ColoredConsoleLogger;
```

## Best Practices

1. **Handle Errors Gracefully**: Log providers should not throw exceptions that break the application
2. **Consider Performance**: Logging should be fast; use buffering for slow destinations
3. **Implement Cleanup**: Provide methods to flush buffers and close connections
4. **Use the UUID**: The `loggerUUID` helps identify log sources in multi-stream setups
5. **Respect Log Levels**: The framework handles level filtering; your provider receives only relevant messages
