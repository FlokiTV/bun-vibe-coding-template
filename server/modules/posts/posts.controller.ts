import { router } from "@utils/rounter";
import type { CreatePostDto } from "./dto/create-post.dto";
import { postsService } from "./posts.service";

export const postsController = router({
	// List posts
	"/api/posts": {
		GET: () => {
			const posts = postsService.findAll();
			return Response.json(posts);
		},

		// Create post
		POST: async (req) => {
			const body: CreatePostDto = await req.json();
			const newPost = postsService.create(body);
			return Response.json(newPost, { status: 201 });
		},
	},

	// Get post by ID
	"/api/posts/:id": (req) => {
		const post = postsService.findById(req.params.id);

		if (!post) {
			return new Response("Not Found", { status: 404 });
		}

		return Response.json(post);
	},
});
