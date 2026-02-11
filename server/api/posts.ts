import { db } from "@db";
import type { Post } from "@types";
import { router } from "@utils/rounter";

export const posts = router({
	// List posts
	"/api/posts": {
		GET: () => {
			const posts = db.query("SELECT * FROM posts").all();
			return Response.json(posts);
		},

		// Create post
		POST: async (req) => {
			const post: Omit<Post, "id" | "created_at"> = await req.json();
			const id = crypto.randomUUID();

			db.query(
				`INSERT INTO posts (id, title, content, created_at)
           VALUES (?, ?, ?, ?)`,
			).run(id, post.title, post.content, new Date().toISOString());

			return Response.json({ id, ...post }, { status: 201 });
		},
	},

	// Get post by ID
	"/api/posts/:id": (req) => {
		const post = db
			.query("SELECT * FROM posts WHERE id = ?")
			.get(req.params.id);

		if (!post) {
			return new Response("Not Found", { status: 404 });
		}

		return Response.json(post);
	},
});
