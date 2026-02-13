export abstract class BaseService<
	T,
	CreateDTO = Partial<T>,
	UpdateDTO = Partial<T>,
> {
	abstract findAll(): T[];
	abstract findById(id: string): T | null;
	abstract create(data: CreateDTO): T;
	abstract update(id: string, data: UpdateDTO): T | null;
	abstract delete(id: string): boolean;
}
