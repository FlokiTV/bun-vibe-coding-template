import { getToken } from "@utils/jwt";
import { router } from "@utils/rounter";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { LoginUserDto } from "./dto/login-user.dto";
import { usersService } from "./users.service";

export const usersController = router({
	"/api/register": {
		POST: async (req) => {
			try {
				const body: CreateUserDto = await req.json();
				if (!body.username || !body.password) {
					return new Response("Username and password are required", {
						status: 400,
					});
				}
				const user = await usersService.create(body);
				return Response.json(user, { status: 201 });
			} catch (error: unknown) {
				if (
					error instanceof Error &&
					error.message === "Username already exists"
				) {
					return new Response("Username already exists", { status: 409 });
				}
				console.error(error);
				return new Response("Internal Server Error", { status: 500 });
			}
		},
	},

	"/api/login": {
		POST: async (req) => {
			try {
				const body: LoginUserDto = await req.json();
				if (!body.username || !body.password) {
					return new Response("Username and password are required", {
						status: 400,
					});
				}
				const result = await usersService.login(body);
				if (!result) {
					return new Response("Invalid credentials", { status: 401 });
				}
				return Response.json(result);
			} catch (error) {
				console.error(error);
				return new Response("Internal Server Error", { status: 500 });
			}
		},
	},

	"/api/users/me": {
		GET: async (req) => {
			const payload = await getToken(req);
			if (!payload) {
				return new Response("Unauthorized", { status: 401 });
			}

			// payload.id might be unknown type, cast to string
			const userId = payload.id as string;

			const user = await usersService.findById(userId);
			if (!user) {
				return new Response("User not found", { status: 404 });
			}

			const { password, ...userWithoutPassword } = user;
			return Response.json(userWithoutPassword);
		},
	},
});
