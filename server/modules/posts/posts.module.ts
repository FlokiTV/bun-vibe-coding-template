import { BaseModule } from "@common/base.module";
import { postsController } from "./posts.controller";
import { postsService } from "./posts.service";

export class PostsModule extends BaseModule {
	override controller = postsController;
	override service = postsService;
}
