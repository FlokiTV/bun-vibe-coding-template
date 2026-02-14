import { ChatPage } from "./pages/chat";
import { HomePage } from "./pages/home";
import type { Routes } from "./types";

export const routes: Routes = [
	{ path: "/", component: HomePage },
	{ path: "/chat", component: ChatPage },
];
