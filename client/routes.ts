import { Chat } from "./components/Chat";
import { Home } from "./pages/home";

export const routes = [
	{ path: "/", component: Home },
	{ path: "/chat", component: Chat },
];
