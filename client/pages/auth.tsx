import { useState } from "react";
import { useLocation } from "wouter";
import { api } from "../services/api";

export function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [_, setLocation] = useLocation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			if (isLogin) {
				await api.login({ username, password });
				setLocation("/");
			} else {
				await api.register({ username, password });
				// Auto login after register or ask user to login
				await api.login({ username, password });
				setLocation("/");
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || "An error occurred");
			} else {
				setError("An unknown error occurred");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-900">
					{isLogin ? "Login" : "Register"}
				</h2>
				{error && (
					<div className="p-3 text-sm text-red-500 bg-red-100 rounded">
						{error}
					</div>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							required
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{isLogin ? "Sign In" : "Sign Up"}
					</button>
				</form>
				<div className="text-center">
					<button
						type="button"
						onClick={() => setIsLogin(!isLogin)}
						className="text-sm text-blue-600 hover:underline"
					>
						{isLogin
							? "Don't have an account? Sign up"
							: "Already have an account? Sign in"}
					</button>
				</div>
			</div>
		</div>
	);
}
