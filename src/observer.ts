import debug from 'debug';
import { Socket, SocketConnectOpts, createConnection as connect } from 'net';
import { Observable, fromEvent } from 'rxjs';

export interface ObservableSocket {
    connection: Socket;
    down: Observable<any>;
    up: (data: any) => void;
}

export function socketObserver(connection: Socket): ObservableSocket {
    const queue = [];
    const log = debug('observable-socket');
    const write = (chunk) => new Promise((resolve, reject) => {
        connection.write(chunk, err => (err ? reject(err) : resolve(true)));
    });
    const flush = () => Promise.all(queue.splice(0, queue.length).map(write));
    const up = (data) => queue.push(data);
    connection.on('ready', flush);
    connection.on('drain', flush);
    const down = new Observable(observer => {
        const onData = fromEvent(connection, 'data').subscribe(e => {
            log('data');
            observer.next(e);
        });
        const onError = fromEvent(connection, 'error').subscribe(e => {
            log('error', e);
            observer.error(e);
        });
        const onClose = fromEvent(connection, 'close').subscribe(() => {
            log('closed');
            observer.complete();
            connection.destroy();
        });
        return function cleanup() {
            [onClose, onError, onData].forEach(s => s.unsubscribe());
        };
    });
    return { connection, down, up };
}

export function createConnection(opts: SocketConnectOpts): ObservableSocket {
    return socketObserver(connect(opts));
}

export default socketObserver;
