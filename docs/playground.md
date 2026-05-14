# Code Playground

fable-log's docs are wired to the **Fable Playground** — a live editor +
sandbox that lives in a sliding drawer at the bottom of the viewport.
Every JavaScript example in these docs has a small **▶** play button next
to its Copy and Fullscreen actions; clicking it loads the snippet into
the playground, where you can edit it and press **Run** to see the
log output captured in the panel beside the editor.

For the full reference on what the playground does, how the `require`
shim works, and the caveats around module sandboxing, see the
[Fable Playground reference page](/#/playground/fable).

## Try it

The playground gives you a Fable instance whose logger streams every
record into the panel on the right. Walk the level cascade once to see
how each line is rendered, then explore the structured-data payload
support.

```javascript
const Fable = require('fable');

// A fresh Fable instance.  Under the playground's auto-attach toggle
// the playground's capture logger is wired at the `trace` level, so
// every record below shows up in the output panel.
const app = new Fable({ Product: 'LogPlaygroundDemo' });

// Walk the level cascade.  Each method takes (message, datum?).
app.log.trace('trace — finest grain');
app.log.debug('debug — diagnostic');
app.log.info ('info  — normal');
app.log.warn ('warn  — heads up');
app.log.error('error — recoverable');
app.log.fatal('fatal — game over');

// Structured data is rendered pretty-printed next to the message,
// not stringified into the line itself.
app.log.info('User signed in', { UserID: 42, SessionID: 'abc' });

// You can build records over time — async log calls (setTimeout,
// Promise.then, fetch().then) surface as they arrive thanks to the
// playground's debounced re-render.
setTimeout(() => app.log.info('arrived 200ms later'), 200);
```
