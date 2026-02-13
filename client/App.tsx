import { Link, Route } from "wouter";
import { routes } from "./routes";

export function App() {
	return (
		<>
			<Link href="/chat">Chat</Link>
			{routes.map(({ path, component: Component }) => (
				<Route key={path} path={path}>
					<Component />
				</Route>
			))}
		</>
	);
}
