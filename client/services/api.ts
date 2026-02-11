export interface Post {
	id: string;
	title: string;
	content: string;
	created_at: string;
}

export interface CreatePostData {
	title: string;
	content: string;
}

class ApiService {
	private baseUrl = "/api";

	async getPosts(): Promise<Post[]> {
		const response = await fetch(`${this.baseUrl}/posts`);
		if (!response.ok) {
			throw new Error("Failed to fetch posts");
		}
		return response.json();
	}

	async getPost(id: string): Promise<Post> {
		const response = await fetch(`${this.baseUrl}/posts/${id}`);
		if (!response.ok) {
			throw new Error("Failed to fetch post");
		}
		return response.json();
	}

	async createPost(data: CreatePostData): Promise<Post> {
		const response = await fetch(`${this.baseUrl}/posts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error("Failed to create post");
		}
		return response.json();
	}
}

export const api = new ApiService();
