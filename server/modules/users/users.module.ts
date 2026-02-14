import { BaseModule } from "@common/base.module";
import { usersController } from "./users.controller";
import { usersService } from "./users.service";

export class UsersModule extends BaseModule {
	override controller = usersController;
	override service = usersService;
}
