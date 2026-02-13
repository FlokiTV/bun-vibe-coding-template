import type { BaseModule } from "@common/base.module";
import homepage from "@public/index.html";
import type { WebsocketData } from "@types";
import { type HTMLBundle, serve } from "bun";
import { routes } from "../../client/routes";

const args = process.execArgv;
const isDev = args.includes("--watch");
const MODULES: BaseModule[] = [];

if (!isDev) {
	console.log("Running in production mode");
}

export function register(modules: (new () => BaseModule)[]) {
	MODULES.push(...modules.map((M) => new M()));
}

function getFrontendRoutes() {
	const newRoutes = {} as Record<string, HTMLBundle>;
	routes.forEach(({ path }) => {
		newRoutes[path] = homepage;
	});
	return newRoutes;
}

export function init() {
	const server = serve({
		port: 3000,
		// Enable development mode if --watch is passed
		development: {
			hmr: isDev,
			console: isDev,
		},
		// Routes
		routes: {
			...getFrontendRoutes(), // { "/": homepage, "/chat": homepage }
			"/ws": (req, server) => {
				console.log(`upgrade!`);
				const url = new URL(req.url);
				const username = url.searchParams.get("username") || "Anonymous";
				const success = server.upgrade(req, {
					data: { username } as WebsocketData,
				});
				return success
					? undefined
					: new Response("WebSocket upgrade error", { status: 400 });
			},
			...Object.assign({}, ...MODULES.map((module) => module.controller)),
		},

		// Fallback for unmatched routes
		fetch(_req) {
			return new Response("Not Found", { status: 404 });
		},
		websocket: {
			data: {} as WebsocketData,
			message(ws, message) {
				MODULES.forEach((module) => {
					module.websocket?.message(ws, message);
				});
			},
			open(ws) {
				MODULES.forEach((module) => {
					module.websocket?.setServer(server);
					module.websocket?.open(ws);
				});
			},
			close(ws, code, message) {
				MODULES.forEach((module) => {
					module.websocket?.close(ws, code, message);
				});
			},
			drain(ws) {
				MODULES.forEach((module) => {
					module.websocket?.drain(ws);
				});
			},
		},
		error(error) {
			console.error(error);
			return new Response("Internal Server Error", { status: 500 });
		},
	});

	return server;
}
