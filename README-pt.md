# Bun Vibe Coding Template

Este é um template de projeto backend usando [Bun](https://bun.com), organizado no padrão **MVC (Model-View-Controller)** para manter o código limpo, escalável e desacoplado.

## 🚀 Instalação e Execução

Para instalar as dependências:

```bash
bun install
```

Para rodar o projeto:

```bash
bun run server/index.ts
```

Ou em modo de desenvolvimento (com watch):

```bash
bun run dev
```

## 📂 Estrutura do Projeto

O projeto segue a arquitetura MVC simplificada:

- **server/models/**: Camada de dados. Aqui ficam as queries SQL e a interação direta com o banco de dados.
- **server/controllers/**: Camada de controle. Aqui fica a lógica de negócios e o tratamento das requisições HTTP.
- **server/types/**: Definições de tipos TypeScript.
- **public/**: Frontend da aplicação (HTML/CSS/JS estáticos).

## 🛠️ Como criar uma nova rota

Para adicionar uma nova funcionalidade (ex: "Comentários"), siga este fluxo para manter o padrão:

### 1. Crie o Tipo (Opcional)
Se houver uma nova estrutura de dados, defina em `server/types/`.

### 2. Crie o Model (`server/models/`)
Crie um arquivo para abstrair o banco de dados. Ex: `server/models/commentModel.ts`.
Aqui você coloca **apenas** o código SQL e métodos de acesso aos dados.

```typescript
// server/models/commentModel.ts
import { db } from "@db";

export const CommentModel = {
  findAll: () => db.query("SELECT * FROM comments").all(),
  create: (content: string) => { /* lógica de insert */ }
};
```

### 3. Crie o Controller (`server/controllers/`)
Crie um arquivo para gerenciar as rotas. Ex: `server/controllers/commentController.ts`.
Aqui você usa o Model e define as rotas HTTP.

```typescript
// server/controllers/commentController.ts
import { router } from "@utils/rounter";
import { CommentModel } from "../models/commentModel";

export const commentController = router({
  "/api/comments": {
    GET: () => Response.json(CommentModel.findAll()),
    POST: async (req) => { /* lógica */ }
  }
});
```

### 4. Registre no Servidor (`server/index.ts`)
Importe seu controller e adicione nas rotas do servidor.

```typescript
// server/index.ts
import { commentController } from "./controllers/commentController";

// ...
routes: {
    "/": homepage,
    ...postsController,
    ...commentController, // Adicione aqui
},
```

## 🎨 Frontend

Os arquivos de frontend (HTML, CSS, Imagens) estão localizados na pasta:
**`public/`**

O projeto utiliza [TailwindCSS](https://tailwindcss.com/) para estilização.

O servidor está configurado para servir o arquivo `public/index.html` na rota raiz (`/`).
