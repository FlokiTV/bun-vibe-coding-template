import { BaseWebsocket } from "@common/base.ws";
import type { WebsocketData } from "@types";
import type { ServerWebSocket } from "bun";

class ChatWebsocketService extends BaseWebsocket<WebsocketData> {
	private readonly TOPIC = "the-group-chat";

	message(
		ws: ServerWebSocket<WebsocketData>,
		message: string | Buffer<ArrayBuffer>,
	) {
		const data = ws.data as WebsocketData;
		// this is a group chat
		// so the server re-broadcasts incoming message to everyone
		this.getServer().publish(this.TOPIC, `${data.username}: ${message}`);

		// inspect current subscriptions
		console.log(ws.subscriptions); // ["the-group-chat"]
		console.log("ChatWebsocket message", message);
	}

	open(ws: ServerWebSocket<WebsocketData>): void {
		const data = ws.data as WebsocketData;
		const msg = `${data.username} has entered the chat`;
		ws.subscribe(this.TOPIC);
		this.getServer().publish(this.TOPIC, msg);
	}

	close(
		ws: ServerWebSocket<WebsocketData>,
		_code: number,
		_message: string,
	): void {
		const data = ws.data as WebsocketData;
		const msg = `${data.username} has left the chat`;
		ws.unsubscribe(this.TOPIC);
		this.getServer().publish(this.TOPIC, msg);
	}

	drain(_ws: ServerWebSocket<WebsocketData>): void {
		// Implement drain handler if needed
	}
}

export const ChatWebsocket = new ChatWebsocketService();
