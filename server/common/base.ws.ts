import type { Server, ServerWebSocket } from "bun";

export abstract class BaseWebsocket<WebsocketData> {
	protected server?: Server<WebsocketData>;

	setServer(server: Server<WebsocketData>) {
		this.server = server;
	}

	protected getServer(): Server<WebsocketData> {
		if (!this.server) {
			throw new Error("Server not initialized in BaseWebsocket");
		}
		return this.server;
	}

	abstract message(
		_ws: ServerWebSocket<WebsocketData>,
		message: string | Buffer<ArrayBuffer>,
	): void;
	abstract open(_ws: ServerWebSocket<WebsocketData>): void;
	abstract close(
		_ws: ServerWebSocket<WebsocketData>,
		_code: number,
		_message: string,
	): void;
	abstract drain(_ws: ServerWebSocket<WebsocketData>): void;
}
