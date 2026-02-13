import { BaseModule } from "@common/base.module";
import { ChatWebsocket } from "./chat.ws";

export class ChatModule extends BaseModule {
	override websocket = ChatWebsocket;
}
