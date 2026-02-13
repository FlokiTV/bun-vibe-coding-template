import type { Serve } from "bun";
import type { BaseService } from "./base.service";
import type { BaseWebsocket } from "./base.ws";

export abstract class BaseModule {
	// biome-ignore lint/suspicious/noExplicitAny: Allow any for base module compatibility
	controller?: Serve.Routes<any, any>;
	// biome-ignore lint/suspicious/noExplicitAny: Allow any for base module compatibility
	service?: BaseService<any>;
	// biome-ignore lint/suspicious/noExplicitAny: Allow any for base module compatibility
	websocket?: BaseWebsocket<any>;
}
