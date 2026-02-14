import type { CreateUserDto } from "../../server/modules/users/dto/create-user.dto";
import type { LoginUserDto } from "../../server/modules/users/dto/login-user.dto";
import type { User } from "../../server/modules/users/entities/user.entity";

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
	private token: string | null = null;

	setToken(token: string) {
		this.token = token;
		localStorage.setItem("token", token);
	}

	getToken() {
		if (!this.token) {
			this.token = localStorage.getItem("token");
		}
		return this.token;
	}

	logout() {
		this.token = null;
		localStorage.removeItem("token");
	}

	private getHeaders() {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};
		const token = this.getToken();
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
		return headers;
	}

	async getPosts(): Promise<Post[]> {
		const response = await fetch(`${this.baseUrl}/posts`, {
			headers: this.getHeaders(),
		});
		if (!response.ok) {
			throw new Error("Failed to fetch posts");
		}
		return response.json();
	}

	async getPost(id: string): Promise<Post> {
		const response = await fetch(`${this.baseUrl}/posts/${id}`, {
			headers: this.getHeaders(),
		});
		if (!response.ok) {
			throw new Error("Failed to fetch post");
		}
		return response.json();
	}

	async createPost(data: CreatePostData): Promise<Post> {
		const response = await fetch(`${this.baseUrl}/posts`, {
			method: "POST",
			headers: this.getHeaders(),
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error("Failed to create post");
		}
		return response.json();
	}

	async register(data: CreateUserDto): Promise<User> {
		const response = await fetch(`${this.baseUrl}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const error = await response.text();
			throw new Error(error || "Failed to register");
		}
		return response.json();
	}

	async login(
		data: LoginUserDto,
	): Promise<{ token: string; user: Omit<User, "password"> }> {
		const response = await fetch(`${this.baseUrl}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			throw new Error("Invalid credentials");
		}
		const result = await response.json();
		this.setToken(result.token);
		return result;
	}

	async getMe(): Promise<Omit<User, "password">> {
		const response = await fetch(`${this.baseUrl}/users/me`, {
			headers: this.getHeaders(),
		});
		if (!response.ok) {
			throw new Error("Failed to fetch user");
		}
		return response.json();
	}
}

export const api = new ApiService();
