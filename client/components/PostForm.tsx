import { useState } from "react";
import { api, type CreatePostData } from "../services/api";

interface PostFormProps {
	onPostCreated?: () => void;
}

export function PostForm({ onPostCreated }: PostFormProps) {
	const [formData, setFormData] = useState<CreatePostData>({
		title: "",
		content: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.title.trim() || !formData.content.trim()) {
			setError("Título e conteúdo são obrigatórios");
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await api.createPost(formData);
			setFormData({ title: "", content: "" });
			onPostCreated?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erro ao criar post");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-6 rounded-lg shadow-md space-y-4"
		>
			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Título
				</label>
				<input
					type="text"
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="Digite o título do post"
					required
				/>
			</div>

			<div>
				<label
					htmlFor="content"
					className="block text-sm font-medium text-gray-700 mb-2"
				>
					Conteúdo
				</label>
				<textarea
					id="content"
					name="content"
					value={formData.content}
					onChange={handleChange}
					rows={6}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
					placeholder="Escreva o conteúdo do post"
					required
				/>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 rounded-md p-3">
					<p className="text-red-800 text-sm">{error}</p>
				</div>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
			>
				{loading ? "Criando..." : "Criar Post"}
			</button>
		</form>
	);
}
