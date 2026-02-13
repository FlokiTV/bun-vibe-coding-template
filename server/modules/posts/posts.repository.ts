import { BaseRepository } from "@common/base.repository";
import { db } from "@db";
import type { CreatePostDto } from "./dto/create-post.dto";
import type { UpdatePostDto } from "./dto/update-post.dto";
import type { Post } from "./entities/post.entity";

export class PostsRepository extends BaseRepository<
	Post,
	CreatePostDto,
	UpdatePostDto
> {
	constructor() {
		super();
		this.init();
	}

	private init() {
		db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
	}

	findAll(): Post[] {
		return db.query("SELECT * FROM posts").all() as Post[];
	}

	findById(id: string): Post | null {
		return db.query("SELECT * FROM posts WHERE id = ?").get(id) as Post | null;
	}

	create(data: CreatePostDto): Post {
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
	}

	update(id: string, data: UpdatePostDto): Post | null {
		const updates: string[] = [];
		const values: (string | number | null)[] = [];

		if (data.title !== undefined) {
			updates.push("title = ?");
			values.push(data.title);
		}
		if (data.content !== undefined) {
			updates.push("content = ?");
			values.push(data.content);
		}

		if (updates.length === 0) {
			return this.findById(id);
		}

		values.push(id);
		const query = `UPDATE posts SET ${updates.join(", ")} WHERE id = ?`;
		db.query(query).run(...values);

		return this.findById(id);
	}

	delete(id: string): boolean {
		const result = db.query("DELETE FROM posts WHERE id = ?").run(id);
		return result.changes > 0;
	}
}
