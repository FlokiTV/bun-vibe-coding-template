# Bun Vibe Coding Template

This is a backend project template using [Bun](https://bun.com), organized in a **Modular Architecture** (inspired by NestJS) to keep code clean, scalable, and decoupled.

> 🇧🇷 [Leia em Português](README-pt.md)

## ✨ Features

- ⚡ **Bun**: Ultra-fast JavaScript runtime and package manager.
- 🔷 **TypeScript**: Strongly typed code for better maintainability.
- 🏗️ **Modular Architecture**: Clean separation of concerns inspired by NestJS (Modules, Services, Controllers, Repositories).
- ⚛️ **React**: Modern frontend library for building user interfaces.
- 🎨 **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- 🗄️ **SQLite**: Lightweight and embedded database.
- 🛠️ **Biome**: Fast formatter and linter.
- 🔌 **WebSocket**: Native real-time communication support.
- 🔥 **Hot Reload**: Instant feedback during development.

## 🚀 Installation and Execution

To install dependencies:

```bash
bun install
```

To run the project:

```bash
bun run server/index.ts
```

Or in development mode (with watch):

```bash
bun run dev
```

## 📂 Project Structure

The project follows a modular architecture:

- **server/modules/**: Feature modules (e.g., `posts/`, `users/`). Each module contains:
  - **dto/**: Data Transfer Objects (validation and type definition for requests).
  - **entities/**: Domain entities (database models).
  - **controllers**: Handles HTTP requests.
  - **services**: Business logic.
  - **repositories**: Database interactions.
  - **module**: Entry point for the module.
- **server/common/**: Shared resources like BaseService and BaseRepository.
- **public/**: Frontend application (static HTML/CSS/JS).

## 🛠️ How to Create a New Module

To add a new feature (e.g., "Comments"), follow this flow:

### 1. Create the Directory Structure
Create `server/modules/comments/` with `dto`, `entities`, and files.

### 2. Define Entity and DTOs
```typescript
// entities/comment.entity.ts
export class Comment {
  id!: string;
  content!: string;
  // ...
}

// dto/create-comment.dto.ts
export class CreateCommentDto {
  content!: string;
}
```

### 3. Create the Repository (`repository.ts`)
Extend `BaseRepository` to handle database operations.
```typescript
export class CommentsRepository extends BaseRepository<Comment, CreateCommentDto> {
  // Implement abstract methods (findAll, create, etc.)
}
```

### 4. Create the Service (`service.ts`)
Extend `BaseService` and use the Repository.
```typescript
export class CommentsService extends BaseService<Comment, CreateCommentDto> {
  constructor() {
    super();
    this.repo = new CommentsRepository();
  }
}
```

### 5. Create the Controller (`controller.ts`)
Define routes using the Service.
```typescript
export const commentsController = router({
  "/api/comments": {
    GET: () => Response.json(commentsService.findAll()),
    POST: async (req) => { /* ... */ }
  }
});
```

### 6. Create the Module (`module.ts`) and Register
Group the controller, service, and websocket (if any) into a class that extends `BaseModule`.

```typescript
// server/modules/comments/comments.module.ts
import { BaseModule } from "@common/base.module";
import { commentsController } from "./comments.controller";
import { commentsService } from "./comments.service";

export class CommentsModule extends BaseModule {
  controller = commentsController;
  service = commentsService;
}
```

Register the module in `server/index.ts`:

```typescript
// server/index.ts
import { CommentsModule } from "@modules/comments/comments.module";

// Add to the module list for automatic registration
register([
  CommentsModule,
  // other modules...
]);
```

## 🔌 How to Create a WebSocket Component

To add real-time capabilities (like the Chat module), follow this structure:

### 1. Define the Data Type
Define the shape of the data attached to each WebSocket connection (e.g., username, session ID).

```typescript
type MyWebsocketData = {
  userId: string;
  channel: string;
};
```

### 2. Create the WebSocket Service (`feature.ws.ts`)
Extend `BaseWebsocket` with your data type and implement the required methods. You have access to the server instance via `this.getServer()` to use features like Pub/Sub.

```typescript
import { BaseWebsocket } from "@common/base.ws";
import type { ServerWebSocket } from "bun";

export class MyWebsocketService extends BaseWebsocket<MyWebsocketData> {
  // Topic for Pub/Sub
  private readonly TOPIC = "my-topic";

  open(ws: ServerWebSocket<MyWebsocketData>): void {
    console.log("Client connected");
    // Subscribe client to a topic
    ws.subscribe(this.TOPIC);
    // Publish message to everyone on the topic
    this.getServer().publish(this.TOPIC, "New user joined!");
  }

  message(ws: ServerWebSocket<MyWebsocketData>, message: string | Buffer<ArrayBuffer>): void {
    // Send message back only to the sender
    ws.send(`Echo: ${message}`);
  }

  close(ws: ServerWebSocket<MyWebsocketData>, code: number, reason: string): void {
    ws.unsubscribe(this.TOPIC);
  }

  drain(ws: ServerWebSocket<MyWebsocketData>): void {}
}

export const myWebsocket = new MyWebsocketService();
```

### 3. Integrate into the Module
Add the WebSocket service to your module.

```typescript
// comments.module.ts
export class CommentsModule extends BaseModule {
  // ...
  websocket = myWebsocket;
}
```
Server registration happens automatically when registering the module.

## 🎨 Frontend

Frontend files (HTML, CSS, Images) are located in the folder:
**`public/`**

The project uses [TailwindCSS](https://tailwindcss.com/) for styling.

The server is configured to serve the `public/index.html` file at the root route (`/`).
