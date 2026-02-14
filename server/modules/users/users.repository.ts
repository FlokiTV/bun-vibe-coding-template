import { BaseRepository } from "@common/base.repository";
import { db } from "@db";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { User } from "./entities/user.entity";

export class UsersRepository extends BaseRepository<
	User,
	CreateUserDto,
	Partial<User>
> {
	constructor() {
		super();
		this.init();
	}

	private init() {
		db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
	}

	findAll(): User[] {
		return db.query("SELECT * FROM users").all() as User[];
	}

	findById(id: string): User | null {
		return db.query("SELECT * FROM users WHERE id = ?").get(id) as User | null;
	}

	findByUsername(username: string): User | null {
		return db
			.query("SELECT * FROM users WHERE username = ?")
			.get(username) as User | null;
	}

	create(data: CreateUserDto): User {
		const id = crypto.randomUUID();
		const created_at = new Date().toISOString();

		db.query(
			`INSERT INTO users (id, username, password, created_at)
       VALUES (?, ?, ?, ?)`,
		).run(id, data.username, data.password, created_at);

		return {
			id,
			username: data.username,
			password: data.password,
			created_at,
		};
	}

	update(id: string, _data: Partial<User>): User | null {
		// Not implemented for this simplified example
		return this.findById(id);
	}

	delete(id: string): boolean {
		const result = db.query("DELETE FROM users WHERE id = ?").run(id);
		return result.changes > 0;
	}
}

export const usersRepository = new UsersRepository();
