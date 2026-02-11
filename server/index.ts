import { serve } from "bun";
import homepage from "../public/index.html";
import { postsController } from "./controllers/postController";

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
		...postsController,
	},

	// Fallback for unmatched routes
	fetch(_req) {
		return new Response("Not Found", { status: 404 });
	},
	websocket: {
		data: {} as { username: string },
		message(ws, message) {
			// this is a group chat
			// so the server re-broadcasts incoming message to everyone
			server.publish("the-group-chat", `${ws.data.username}: ${message}`);

			// inspect current subscriptions
			console.log(ws.subscriptions); // ["the-group-chat"]
		}, // a message is received
		open(ws) {
			const msg = `${ws.data.username} has entered the chat`;
			ws.subscribe("the-group-chat");
			server.publish("the-group-chat", msg);
		}, // a socket is opened
		close(ws, _code, _message) {
			const msg = `${ws.data.username} has left the chat`;
			ws.unsubscribe("the-group-chat");
			server.publish("the-group-chat", msg);
		}, // a socket is closed
		drain(_ws) {}, // the socket is ready to receive more data
	},
	error(error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	},
});

console.log(`Server running on port ${server.port}`);
