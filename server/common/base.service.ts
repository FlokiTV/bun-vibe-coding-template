export abstract class BaseService<
	T,
	CreateDTO = Partial<T>,
	UpdateDTO = Partial<T>,
> {
	abstract findAll(): T[] | Promise<T[]>;
	abstract findById(id: string): T | null | Promise<T | null>;
	abstract create(data: CreateDTO): T | Promise<T>;
	abstract update(id: string, data: UpdateDTO): T | null | Promise<T | null>;
	abstract delete(id: string): boolean | Promise<boolean>;
}
