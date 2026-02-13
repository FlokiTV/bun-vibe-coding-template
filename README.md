# Bun Vibe Coding Template

This is a backend project template using [Bun](https://bun.com), organized in a **Modular Architecture** (inspired by NestJS) to keep code clean, scalable, and decoupled.

> 🇧🇷 [Leia em Português](README-pt.md)

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
Export the controller in your module file and register it in `server/index.ts`.

```typescript
// server/index.ts
import { CommentsModule } from "@modules/comments/comments.module";

routes: {
    ...CommentsModule.controller,
},
```

## 🎨 Frontend

Frontend files (HTML, CSS, Images) are located in the folder:
**`public/`**

The project uses [TailwindCSS](https://tailwindcss.com/) for styling.

The server is configured to serve the `public/index.html` file at the root route (`/`).
