import { useEffect, useRef, useState } from "react";

export function Chat() {
	const [isOpen, setIsOpen] = useState(false);
	const [username, setUsername] = useState("");
	const [isJoined, setIsJoined] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState("");
	const wsRef = useRef<WebSocket | null>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleJoin = (e: React.FormEvent) => {
		e.preventDefault();
		if (!username.trim()) return;

		// Connect to WebSocket
		const _protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
		const _host = window.location.host;
		// If running on a different port in dev, you might need to hardcode 'localhost:3000'
		// But assuming the proxy or same origin for simplicity, or hardcode port 3000 as per server file
		const wsUrl = `ws://localhost:3000/ws?username=${encodeURIComponent(username)}`;

		const ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			console.log("Connected to chat");
			setIsJoined(true);
		};

		ws.onmessage = (event) => {
			setMessages((prev) => [...prev, event.data]);
		};

		ws.onclose = () => {
			console.log("Disconnected from chat");
			setIsJoined(false);
			setMessages((prev) => [...prev, "System: Disconnected from server"]);
		};

		wsRef.current = ws;
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim() || !wsRef.current) return;

		wsRef.current.send(inputValue);
		setInputValue("");
	};

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
			{isOpen && (
				<div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 h-96 mb-4 flex flex-col overflow-hidden">
					{/* Header */}
					<div className="bg-blue-600 p-3 flex justify-between items-center text-white">
						<h3 className="font-semibold">Chat</h3>
						<button
							type="button"
							onClick={toggleChat}
							className="text-white hover:text-gray-200"
						>
							✕
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-hidden flex flex-col">
						{!isJoined ? (
							<div className="flex-1 flex flex-col justify-center items-center p-6">
								<p className="mb-4 text-center text-gray-600">
									Enter your username to join the chat
								</p>
								<form onSubmit={handleJoin} className="w-full">
									<input
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										placeholder="Username"
										className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
									/>
									<button
										type="submit"
										className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
									>
										Join
									</button>
								</form>
							</div>
						) : (
							<>
								<div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
									{messages.map((msg, idx) => (
										<div
											key={idx}
											className="bg-white p-2 rounded shadow-sm text-sm border border-gray-100"
										>
											{msg}
										</div>
									))}
									<div ref={messagesEndRef} />
								</div>
								<form
									onSubmit={handleSendMessage}
									className="p-3 border-t border-gray-200 bg-white flex"
								>
									<input
										type="text"
										value={inputValue}
										onChange={(e) => setInputValue(e.target.value)}
										placeholder="Type a message..."
										className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:border-blue-500"
									/>
									<button
										type="submit"
										className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition"
									>
										Send
									</button>
								</form>
							</>
						)}
					</div>
				</div>
			)}

			{/* Floating Button */}
			<button
				type="button"
				onClick={toggleChat}
				className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105 focus:outline-none"
			>
				{isOpen ? (
					<span className="text-2xl">✕</span>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Chat</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
						/>
					</svg>
				)}
			</button>
		</div>
	);
}
