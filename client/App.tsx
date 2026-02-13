import { Link, Route } from "wouter";
import { Chat } from "./components/Chat";
import { Home } from "./pages/home";

export function App() {
	return (
		<>
			<Link href="/chat">Chat</Link>
			<Route path="/">
				<Home />
			</Route>
			<Route path="/chat">
				<Chat />
			</Route>
		</>
	);
}
