# socket-observer

Simple [RXJS](https://rxjs.dev/) wrapper around node's [net.Socket](https://nodejs.org/api/net.html#net_class_net_socket).

## Installation

```bash
npm install --save socket-observer
```

## Example usage

With user-provided socket:
```typescript
import { createConnection } from 'net';
import { socketObserver } from 'socket-observer';

const socket = createConnection({
    host: 'example.com',
    port: 80
});
const oSocket = socketObserver(socket);
oSocket.down.subscribe(console.log);
oSocket.up('GET / HTTP/1.1\nHost: example.com\n\n');
```

Or using `createConnection` helper:
```typescript
import { createConnection } from 'socket-observer';

const oSocket = createConnection({
    host: 'example.com',
    port: 80
});
oSocket.down.subscribe(console.log);
oSocket.up('GET / HTTP/1.1\nHost: example.com\n\n');
```
