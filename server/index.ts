import { ChatModule } from "@modules/chat/chat.module";
import { PostsModule } from "@modules/posts/posts.module";
import { serve } from "bun";
import homepage from "../public/index.html";

const args = process.execArgv;
const isDev = args.includes("--watch");
if (!isDev) {
	console.log("Running in production mode");
}

const server = serve({
	port: 3000,
	// Enable development mode if --watch is passed
	development: {
		hmr: isDev,
		console: isDev,
	},
	// Routes
	routes: {
		"/": homepage,
		"/ws": (req, server) => {
			console.log(`upgrade!`);
			const url = new URL(req.url);
			const username = url.searchParams.get("username") || "Anonymous";
			const success = server.upgrade(req, { data: { username } });
			return success
				? undefined
				: new Response("WebSocket upgrade error", { status: 400 });
		},
		...PostsModule.controller,
	},

	// Fallback for unmatched routes
	fetch(_req) {
		return new Response("Not Found", { status: 404 });
	},
	websocket: {
		data: {} as { username: string },
		message(ws, message) {
			ChatModule.websocket.message(ws, message);
		},
		open(ws) {
			ChatModule.websocket.open(ws);
		},
		close(ws, code, message) {
			ChatModule.websocket.close(ws, code, message);
		},
		drain(ws) {
			ChatModule.websocket.drain(ws);
		},
	},
	error(error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	},
});

ChatModule.websocket.setServer(server);

console.log(`Server running on port ${server.port}`);
