declare module 'ws' {
  import { EventEmitter } from 'events';
  import { IncomingMessage, Server as HttpServer } from 'http';

  export class WebSocket extends EventEmitter {
    static readonly OPEN: number;
    static readonly CLOSED: number;
    readyState: number;
    send(data: any, cb?: (err?: Error) => void): void;
    close(code?: number, reason?: string): void;
    ping(): void;
    terminate(): void;
    on(event: 'message', listener: (data: Buffer | string) => void): this;
    on(event: 'close', listener: (code: number, reason: Buffer) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'pong', listener: () => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  export interface ServerOptions {
    server?: HttpServer;
    port?: number;
    path?: string;
    noServer?: boolean;
  }

  export class WebSocketServer extends EventEmitter {
    constructor(options?: ServerOptions);
    clients: Set<WebSocket>;
    close(cb?: (err?: Error) => void): void;
    handleUpgrade(request: IncomingMessage, socket: any, head: Buffer, callback: (client: WebSocket) => void): void;
    on(event: 'connection', listener: (socket: WebSocket, request: IncomingMessage) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }
}
