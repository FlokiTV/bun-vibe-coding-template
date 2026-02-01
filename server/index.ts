import { serve } from "bun";
import homepage from "../public/index.html";

const args = process.execArgv;
const isDev = args.includes("--watch");
if (!isDev) {
	console.log("Running in production mode");
}

const server = serve({
	port: 3000,
	routes: {
		"/": homepage,
	},
	// Enable development mode if --watch is passed
	development: {
		hmr: isDev,
		console: isDev,
	},

	// Fallback for unmatched routes
	fetch(_req) {
		return new Response("Not Found", { status: 404 });
	},
});

console.log(`Server running on port ${server.port}`);
