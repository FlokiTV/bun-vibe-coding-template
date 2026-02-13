export class Post {
	id!: string;
	title!: string;
	content!: string;
	created_at!: string;

	constructor(partial: Partial<Post>) {
		Object.assign(this, partial);
	}
}
