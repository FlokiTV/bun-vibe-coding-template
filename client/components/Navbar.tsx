import { Link, useLocation } from "wouter";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/chat", label: "Chat" },
];

export function Navbar() {
	const [location] = useLocation();

	return (
		<nav className="bg-gray-800 text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="text-xl font-bold">Bun Vibe</div>
				<ul className="flex space-x-4">
					{navItems.map(({ href, label }) => (
						<li key={href}>
							<Link href={href}>
								<span
									className={`cursor-pointer hover:text-blue-400 transition-colors ${
										location === href ? "text-blue-400 font-semibold" : ""
									}`}
								>
									{label}
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
