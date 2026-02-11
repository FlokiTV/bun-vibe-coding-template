import type { Post } from "@types";
import { router } from "@utils/rounter";
import { PostModel } from "../models/postModel";

export const postsController = router({
	// List posts
	"/api/posts": {
		GET: () => {
			const posts = PostModel.findAll();
			return Response.json(posts);
		},

		// Create post
		POST: async (req) => {
			const body: Omit<Post, "id" | "created_at"> = await req.json();
			const newPost = PostModel.create(body);
			return Response.json(newPost, { status: 201 });
		},
	},

	// Get post by ID
	"/api/posts/:id": (req) => {
		const post = PostModel.findById(req.params.id);

		if (!post) {
			return new Response("Not Found", { status: 404 });
		}

		return Response.json(post);
	},
});
