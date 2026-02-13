import { postsController } from "./posts.controller";
import { postsService } from "./posts.service";

export const PostsModule = {
	controller: postsController,
	service: postsService,
};
