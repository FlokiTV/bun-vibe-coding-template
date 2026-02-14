export interface User {
	id: string;
	username: string;
	password?: string; // Should be hashed, and often we might want to exclude it from the entity interface if we return it to client, but here it's fine for now. Ideally, we separate entity from response DTO.
	created_at: string;
}
