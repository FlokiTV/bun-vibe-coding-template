import type { ServerWebSocket } from "bun";

export abstract class BaseWebsocket<T = undefined> {
  abstract message(
    _ws: ServerWebSocket<T>,
    message: string | Buffer<ArrayBuffer>,
  ): void;
  abstract open(_ws: ServerWebSocket<T>): void;
  abstract close(
    _ws: ServerWebSocket<T>,
    _code: number,
    _message: string,
  ): void;
  abstract drain(_ws: ServerWebSocket<T>): void;
}
