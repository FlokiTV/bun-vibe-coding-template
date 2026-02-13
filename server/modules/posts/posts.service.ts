import { BaseService } from "@common/base.service";
import type { CreatePostDto } from "./dto/create-post.dto";
import type { UpdatePostDto } from "./dto/update-post.dto";
import type { Post } from "./entities/post.entity";
import { PostsRepository } from "./posts.repository";

export class PostsService extends BaseService<
	Post,
	CreatePostDto,
	UpdatePostDto
> {
	private repo: PostsRepository;

	constructor() {
		super();
		this.repo = new PostsRepository();
	}

	findAll(): Post[] {
		return this.repo.findAll();
	}

	findById(id: string): Post | null {
		return this.repo.findById(id);
	}

	create(data: CreatePostDto): Post {
		return this.repo.create(data);
	}

	update(id: string, data: UpdatePostDto): Post | null {
		return this.repo.update(id, data);
	}

	delete(id: string): boolean {
		return this.repo.delete(id);
	}
}

export const postsService = new PostsService();
