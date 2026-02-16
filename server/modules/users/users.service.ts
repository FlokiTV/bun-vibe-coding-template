import { BaseService } from "@common/base.service";
import { signToken } from "@utils/jwt";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { LoginUserDto } from "./dto/login-user.dto";
import type { User } from "./entities/user.entity";
import { usersRepository } from "./users.repository";

export class UsersService extends BaseService<
	User,
	CreateUserDto,
	Partial<User>
> {
	async findAll(): Promise<User[]> {
		return usersRepository.findAll();
	}

	async findById(id: string): Promise<User | null> {
		return usersRepository.findById(id);
	}

	async create(data: CreateUserDto): Promise<User> {
		const existing = usersRepository.findByUsername(data.username);
		if (existing) {
			throw new Error("Username already exists");
		}

		const hashedPassword = await Bun.password.hash(data.password);
		const user = usersRepository.create({
			...data,
			password: hashedPassword,
		});

		// Remove password from returned object if desired, but create usually returns the created entity
		// The repository returns the full object including password.
		// We might want to strip it here.
		const { password, ...result } = user;
		return result as User;
	}

	async update(id: string, data: Partial<User>): Promise<User | null> {
		return usersRepository.update(id, data);
	}

	async delete(id: string): Promise<boolean> {
		return usersRepository.delete(id);
	}

	// Custom methods
	async login(
		data: LoginUserDto,
	): Promise<{ token: string; user: Omit<User, "password"> } | null> {
		const user = usersRepository.findByUsername(data.username);
		if (!user || !user.password) {
			return null;
		}

		const isValid = await Bun.password.verify(data.password, user.password);
		if (!isValid) {
			return null;
		}

		const token = await signToken({
			id: user.id,
			username: user.username,
		});

		const { password, ...userWithoutPassword } = user;
		return { token, user: userWithoutPassword };
	}
}

export const usersService = new UsersService();
