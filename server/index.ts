import { ChatModule } from "@modules/chat/chat.module";
import { PostsModule } from "@modules/posts/posts.module";
import { init, register } from "./utils/serve";

register([PostsModule, ChatModule]);

const server = init();

console.log(`Server running on port ${server.port}`);
