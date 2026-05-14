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

// In real code: module.exports = MyCustomProvider;
// In the playground we just show the class is defined and instantiable.
const inst = new MyCustomProvider({ myOption: 'demo' }, null);
console.log('MyCustomProvider defined; myOption =', inst.myOption);
```

### Registering the Provider

```javascript
const FableLog = require('fable-log');
const BaseLogger = FableLog.LogProviderBase;

// In real code: const MyCustomProvider = require('./my-custom-provider');
// In the playground we inline a tiny version so the snippet runs.
class MyCustomProvider extends BaseLogger {
    constructor(s, f) { super(s, f); this.myOption = s.myOption; this.records = []; }
    initialize() {}
    write(pLevel, pLogText, pObject) { this.records.push({ pLevel, pLogText, pObject }); return true; }
}

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
log.info('hello, custom provider');
console.log('custom provider captured:', log.logStreams[0] && log.logStreams[0].records);
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
        // Start periodic flush (skipped in the playground demo so we
        // don't leave a long-lived timer in the page after Run).
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
        // In real code: `await fetch(this.endpoint, {...})`.
        // For the playground demo we just drop the batch into the log.
        console.log('HttpLogger.flush ->', this.buffer.length, 'entries to', this.endpoint);
        this.buffer = [];
    }

    destroy() {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        return this.flush();
    }
}

// In real code: module.exports = HttpLogger;
const demoLogger = new HttpLogger({ endpoint: 'https://logs.example.com', batchSize: 2 }, null);
demoLogger.initialize();
demoLogger.write('info', 'first',  { i: 1 });
demoLogger.write('info', 'second', { i: 2 }); // hits batchSize → flush
console.log('after demo writes, buffer size:', demoLogger.buffer.length);
```

Usage:

```javascript
const FableLog = require('fable-log');
const BaseLogger = FableLog.LogProviderBase;

// Tiny inline HttpLogger so the registration snippet works on its own.
class HttpLogger extends BaseLogger {
    constructor(s, f) { super(s, f); this.endpoint = s.endpoint; this.sent = []; }
    initialize() {}
    write(level, message, datum) { this.sent.push({ level, message, datum }); return true; }
}

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
log.warn('this would POST to the endpoint');
console.log('captured by http stream:', log.logStreams[0].sent);
```

## Example: MongoDB Provider

```javascript
// Reference snippet — `require('mongodb')` isn't available in the
// playground (it's a Node-native driver).  We sketch the shape of the
// class so the doc renders, with a fake MongoClient that records what
// would have been written.
const BaseLogger = require('fable-log').LogProviderBase;

class FakeMongoClient {
    constructor(uri) { this.uri = uri; this.docs = []; }
    async connect() {}
    db() { return { collection: (name) => ({ insertOne: async (doc) => { this.docs.push({ name, doc }); } }) }; }
    async close() {}
}

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
        // Real code: this.client = new MongoClient(this.connectionString);
        this.client = new FakeMongoClient(this.connectionString);
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

// Demo: instantiate, init, write one record, verify it landed in the fake.
const logger = new MongoLogger({ connectionString: 'mongodb://demo' }, null);
await logger.initialize();
logger.write('info', 'hello mongo', { user: 1 });
await new Promise(r => setTimeout(r, 5));
console.log('docs in fake collection:', logger.client.docs.length);
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

// In real code: module.exports = ColoredConsoleLogger;
// In the playground we just verify the class is defined.
console.log('ColoredConsoleLogger:', typeof ColoredConsoleLogger);
```

## Best Practices

1. **Handle Errors Gracefully**: Log providers should not throw exceptions that break the application
2. **Consider Performance**: Logging should be fast; use buffering for slow destinations
3. **Implement Cleanup**: Provide methods to flush buffers and close connections
4. **Use the UUID**: The `loggerUUID` helps identify log sources in multi-stream setups
5. **Respect Log Levels**: The framework handles level filtering; your provider receives only relevant messages
