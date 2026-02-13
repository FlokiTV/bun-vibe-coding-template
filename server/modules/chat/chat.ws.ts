import { BaseWebsocket } from "@common/base.ws";
import type { Server, ServerWebSocket } from "bun";

type ChatWebsocketData = { username: string };

class ChatWebsocketService extends BaseWebsocket<ChatWebsocketData> {
  private server: Server<ChatWebsocketData> | undefined;
  private readonly TOPIC = "the-group-chat";

  setServer(server: Server<ChatWebsocketData>) {
    this.server = server;
  }

  private getServer(): Server<ChatWebsocketData> {
    if (!this.server) {
      throw new Error("Server not initialized in ChatWebsocketService");
    }
    return this.server;
  }

  message(ws: ServerWebSocket<ChatWebsocketData>, message: string | Buffer<ArrayBuffer>) {
    const data = ws.data as ChatWebsocketData;
    // this is a group chat
    // so the server re-broadcasts incoming message to everyone
    this.getServer().publish(this.TOPIC, `${data.username}: ${message}`);

    // inspect current subscriptions
    console.log(ws.subscriptions); // ["the-group-chat"]
    console.log("ChatWebsocket message", message);
  }

  open(ws: ServerWebSocket<ChatWebsocketData>): void {
    const data = ws.data as ChatWebsocketData;
    const msg = `${data.username} has entered the chat`;
    ws.subscribe(this.TOPIC);
    this.getServer().publish(this.TOPIC, msg);
  }

  close(ws: ServerWebSocket<ChatWebsocketData>, _code: number, _message: string): void {
    const data = ws.data as ChatWebsocketData;
    const msg = `${data.username} has left the chat`;
    ws.unsubscribe(this.TOPIC);
    this.getServer().publish(this.TOPIC, msg);
  }

  drain(_ws: ServerWebSocket<ChatWebsocketData>): void {
    // Implement drain handler if needed
  }
}

export const ChatWebsocket = new ChatWebsocketService();


