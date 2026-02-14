import { ChatModule } from "@modules/chat/chat.module";
import { PostsModule } from "@modules/posts/posts.module";
import { UsersModule } from "@modules/users/users.module";
import { init, register } from "./utils/serve";

register([PostsModule, ChatModule, UsersModule]);

const server = init();

console.log(`Server running on port ${server.port}`);
