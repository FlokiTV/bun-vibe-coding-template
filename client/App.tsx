import { useState } from "react";
import { PostForm } from "./components/PostForm";
import { PostList } from "./components/PostList";

export function App() {
	const [refreshKey, setRefreshKey] = useState(0);

	const handlePostCreated = () => {
		// Increment refresh key to force PostList to re-fetch posts
		setRefreshKey((prev) => prev + 1);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<header className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Vibe Coding Blog
					</h1>
					<p className="text-lg text-gray-600">
						Crie e compartilhe seus posts com a comunidade
					</p>
				</header>

				<main className="space-y-12">
					{/* Formulário de criação */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">
							Criar Novo Post
						</h2>
						<PostForm onPostCreated={handlePostCreated} />
					</section>

					{/* Lista de posts */}
					<section>
						<h2 className="text-2xl font-semibold text-gray-800 mb-6">
							Posts Recentes
						</h2>
						<PostList key={refreshKey} />
					</section>
				</main>

				<footer className="mt-16 text-center text-gray-500">
					<p>© 2026 Vibe Coding - SPA Example</p>
				</footer>
			</div>
		</div>
	);
}
