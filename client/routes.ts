import { ChatPage } from "./pages/chat";
import { HomePage } from "./pages/home";

export const routes = [
	{ path: "/", component: HomePage },
	{ path: "/chat", component: ChatPage     },
];
