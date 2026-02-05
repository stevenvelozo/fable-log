# Browser Usage

Fable-Log works in browser environments with automatic adaptation. The browser build excludes Node.js-specific providers and exposes a global for script tag usage.

## Installation Options

### NPM with Bundler

```javascript
// Works with webpack, rollup, browserify, etc.
import FableLog from 'fable-log';

const log = new FableLog();
log.initialize();
log.info('Hello from the browser!');
```

### Script Tag

Build a browser bundle, then include it:

```html
<script src="fable-log.min.js"></script>
<script>
    const log = new FableLog();
    log.initialize();
    log.info('Hello from the browser!');
</script>
```

The browser shim automatically exposes `FableLog` on the `window` object.

## Browser-Specific Behavior

### Available Providers

In browser environments, only the console provider is available:

| Provider | Node.js | Browser |
|----------|---------|---------|
| console | Yes | Yes |
| simpleflatfile | Yes | No |

### Default Provider Mapping

The `package.json` browser field maps Node-specific files to browser versions:

```json
{
    "browser": {
        "./source/Fable-Log-DefaultProviders-Node.js":
            "./source/Fable-Log-DefaultProviders-Web.js"
    }
}
```

This ensures bundlers automatically use the correct version.

## Browser Console Output

The console provider uses `console.log()` which integrates with browser developer tools:

```javascript
const log = new FableLog({
    Product: 'MyWebApp',
    LogStreams: [
        {
            loggertype: 'console',
            level: 'debug',
            showtimestamps: true
        }
    ]
});

log.initialize();

log.debug('User action', { button: 'submit', form: 'login' });
log.error('API call failed', { status: 500 });
```

Output appears in the browser's console with expandable objects.

## Building for Browser

### Using Webpack

```javascript
// webpack.config.js
module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    // Browser field in package.json handles provider mapping
};
```

### Using Browserify

```bash
browserify app.js -o bundle.js
```

### Using Gulp (Legacy)

The project includes a legacy `Build-Web.sh` script that uses gulp for bundling.

## Custom Browser Providers

Create browser-compatible providers that use browser APIs:

```javascript
const BaseLogger = require('fable-log').LogProviderBase;

class LocalStorageLogger extends BaseLogger {
    constructor(pLogStreamSettings, pFableLog) {
        super(pLogStreamSettings, pFableLog);
        this.storageKey = this._Settings.storageKey || 'app_logs';
        this.maxEntries = this._Settings.maxEntries || 1000;
    }

    write(pLevel, pLogText, pObject) {
        const entry = {
            t: Date.now(),
            l: pLevel,
            m: pLogText,
            d: pObject
        };

        let logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        logs.push(entry);

        // Trim old entries
        if (logs.length > this.maxEntries) {
            logs = logs.slice(-this.maxEntries);
        }

        localStorage.setItem(this.storageKey, JSON.stringify(logs));
        return entry;
    }

    getLogs() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    clearLogs() {
        localStorage.removeItem(this.storageKey);
    }
}
```

### Beacon API Provider

For sending logs to a server when the page unloads:

```javascript
class BeaconLogger extends BaseLogger {
    constructor(pLogStreamSettings, pFableLog) {
        super(pLogStreamSettings, pFableLog);
        this.endpoint = this._Settings.endpoint;
        this.buffer = [];
    }

    initialize() {
        window.addEventListener('beforeunload', () => {
            this.flush();
        });
    }

    write(pLevel, pLogText, pObject) {
        this.buffer.push({
            timestamp: Date.now(),
            level: pLevel,
            message: pLogText,
            data: pObject
        });
    }

    flush() {
        if (this.buffer.length && navigator.sendBeacon) {
            navigator.sendBeacon(
                this.endpoint,
                JSON.stringify(this.buffer)
            );
            this.buffer = [];
        }
    }
}
```

## Performance Considerations

1. **Disable in Production**: Consider disabling debug/trace levels in production builds
2. **Limit Object Logging**: Large objects can impact browser memory
3. **Use Sampling**: For high-frequency events, consider logging only a sample

```javascript
const log = new FableLog({
    LogStreams: [
        {
            loggertype: 'console',
            level: process.env.NODE_ENV === 'production' ? 'warn' : 'trace'
        }
    ]
});
```
