import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { api } from "../services/api";

const navItems = [
	{ href: "/", label: "Home" },
	{ href: "/chat", label: "Chat" },
];

export function Navbar() {
	const [location, setLocation] = useLocation();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// Check token on mount and on location change (in case of login/logout redirect)
		const token = api.getToken();
		setIsLoggedIn(!!token);
	}, [location]);

	const handleLogout = () => {
		api.logout();
		setIsLoggedIn(false);
		setLocation("/auth");
	};

	return (
		<nav className="bg-gray-800 text-white p-4 shadow-md">
			<div className="container mx-auto flex justify-between items-center">
				<Link href="/">
					<div className="text-xl font-bold cursor-pointer">Bun Vibe</div>
				</Link>
				<ul className="flex space-x-4 items-center">
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
					{isLoggedIn ? (
						<li>
							<button
								type="button"
								onClick={handleLogout}
								className="cursor-pointer hover:text-red-400 transition-colors"
							>
								Logout
							</button>
						</li>
					) : (
						<li>
							<Link href="/auth">
								<span
									className={`cursor-pointer hover:text-blue-400 transition-colors ${
										location === "/auth" ? "text-blue-400 font-semibold" : ""
									}`}
								>
									Login
								</span>
							</Link>
						</li>
					)}
				</ul>
			</div>
		</nav>
	);
}
