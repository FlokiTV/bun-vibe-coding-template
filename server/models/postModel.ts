import { db } from "@db";
import type { Post } from "@types";

export const PostModel = {
	findAll: (): Post[] => {
		return db.query("SELECT * FROM posts").all() as Post[];
	},

	findById: (id: string): Post | null => {
		return db.query("SELECT * FROM posts WHERE id = ?").get(id) as Post | null;
	},

	create: (data: Omit<Post, "id" | "created_at">): Post => {
		const id = crypto.randomUUID();
		const created_at = new Date().toISOString();

		db.query(
			`INSERT INTO posts (id, title, content, created_at)
       VALUES (?, ?, ?, ?)`,
		).run(id, data.title, data.content, created_at);

		return {
			id,
			title: data.title,
			content: data.content,
			created_at,
		};
	},
};
