import { createConnection as connect } from 'net';
import { socketObserver, createConnection, ObservableSocket } from '.';

describe('Observable socket', () => {
    const connOpts = { host: 'example.com', port: 80 };
    function testObserver(socket: ObservableSocket, done: jest.DoneCallback) {
        socket.up('GET / HTTP/1.0\nHost: example.com\n\n');
        socket.down.subscribe(v => {
            expect(v.includes('200 OK')).toBe(true);
            socket.connection.destroy();
            done();
        });
    }

    it('should create observable from socket', (done) => {
        const socket = socketObserver(connect(connOpts));
        testObserver(socket, done);
    });

    it('should create observable and connect with createConnection', (done) => {
        const socket = createConnection(connOpts);
        testObserver(socket, done);
    });
});
