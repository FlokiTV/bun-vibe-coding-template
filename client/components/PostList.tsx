import { useEffect, useState } from "react";
import { api, type Post } from "../services/api";

export function PostList() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await api.getPosts();
			setPosts(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load posts");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center p-8">
				<div className="text-gray-500">Carregando posts...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-4">
				<div className="text-red-800">Erro: {error}</div>
				<button
					type="button"
					onClick={loadPosts}
					className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
				>
					Tentar novamente
				</button>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="text-center p-8 text-gray-500">
				Nenhum post encontrado. Crie o seu primeiro post!
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{posts.map((post) => (
				<article
					key={post.id}
					className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
				>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						{post.title}
					</h3>
					<p className="text-gray-600 mb-4">{post.content}</p>
					<time className="text-sm text-gray-400">
						{new Date(post.created_at).toLocaleDateString("pt-BR", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</time>
				</article>
			))}
		</div>
	);
}
