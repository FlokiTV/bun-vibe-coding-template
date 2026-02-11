# Bun Vibe Coding Template

This is a backend project template using [Bun](https://bun.com), organized in the **MVC (Model-View-Controller)** pattern to keep code clean, scalable, and decoupled.

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

The project follows a simplified MVC architecture:

- **server/models/**: Data layer. Contains SQL queries and direct database interactions.
- **server/controllers/**: Control layer. Contains business logic and HTTP request handling.
- **server/types/**: TypeScript type definitions.
- **public/**: Frontend application (static HTML/CSS/JS).

## 🛠️ How to Create a New Route

To add a new feature (e.g., "Comments"), follow this flow to maintain the pattern:

### 1. Create the Type (Optional)
If there is a new data structure, define it in `server/types/`.

### 2. Create the Model (`server/models/`)
Create a file to abstract the database. E.g., `server/models/commentModel.ts`.
Here you place **only** the SQL code and data access methods.

```typescript
// server/models/commentModel.ts
import { db } from "@db";

export const CommentModel = {
  findAll: () => db.query("SELECT * FROM comments").all(),
  create: (content: string) => { /* insert logic */ }
};
```

### 3. Create the Controller (`server/controllers/`)
Create a file to manage routes. E.g., `server/controllers/commentController.ts`.
Here you use the Model and define HTTP routes.

```typescript
// server/controllers/commentController.ts
import { router } from "@utils/rounter";
import { CommentModel } from "../models/commentModel";

export const commentController = router({
  "/api/comments": {
    GET: () => Response.json(CommentModel.findAll()),
    POST: async (req) => { /* logic */ }
  }
});
```

### 4. Register in Server (`server/index.ts`)
Import your controller and add it to the server routes.

```typescript
// server/index.ts
import { commentController } from "./controllers/commentController";

// ...
routes: {
    "/": homepage,
    ...postsController,
    ...commentController, // Add here
},
```

## 🎨 Frontend

Frontend files (HTML, CSS, Images) are located in the folder:
**`public/`**

The project uses [TailwindCSS](https://tailwindcss.com/) for styling.

The server is configured to serve the `public/index.html` file at the root route (`/`).
