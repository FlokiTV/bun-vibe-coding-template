# Bun Vibe Coding Template

Este é um template de projeto backend usando [Bun](https://bun.com), organizado em uma **Arquitetura Modular** (inspirada no NestJS) para manter o código limpo, escalável e desacoplado.

## ✨ Funcionalidades

- ⚡ **Bun**: Runtime e gerenciador de pacotes JavaScript ultra-rápido.
- 🔷 **TypeScript**: Código fortemente tipado para melhor manutenibilidade.
- 🏗️ **Arquitetura Modular**: Separação clara de responsabilidades inspirada no NestJS (Módulos, Serviços, Controllers, Repositórios).
- ⚛️ **React**: Biblioteca frontend moderna para construção de interfaces.
- 🎨 **TailwindCSS**: Framework CSS utilitário para desenvolvimento rápido de UI.
- 🗄️ **SQLite**: Banco de dados leve e embutido.
- 🛠️ **Biome**: Formatador e linter rápido.
- 🔌 **WebSocket**: Suporte nativo a comunicação em tempo real.
- 🔥 **Hot Reload**: Feedback instantâneo durante o desenvolvimento.

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

O projeto segue uma arquitetura modular:

- **server/modules/**: Módulos de funcionalidades (ex: `posts/`, `users/`). Cada módulo contém:
  - **dto/**: Data Transfer Objects (validação e definição de tipos para requisições).
  - **entities/**: Entidades de domínio (modelos do banco).
  - **controllers**: Lida com as requisições HTTP.
  - **services**: Lógica de negócios.
  - **repositories**: Interações com o banco de dados.
  - **module**: Ponto de entrada do módulo.
- **server/common/**: Recursos compartilhados como BaseService e BaseRepository.
- **public/**: Frontend da aplicação (HTML/CSS/JS estáticos).

## 🛠️ Como criar um novo módulo

Para adicionar uma nova funcionalidade (ex: "Comentários"), siga este fluxo:

### 1. Crie a Estrutura de Diretórios
Crie `server/modules/comments/` com `dto`, `entities` e os arquivos.

### 2. Defina a Entidade e DTOs
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

### 3. Crie o Repositório (`repository.ts`)
Estenda `BaseRepository` para lidar com operações de banco.
```typescript
export class CommentsRepository extends BaseRepository<Comment, CreateCommentDto> {
  // Implemente os métodos abstratos (findAll, create, etc.)
}
```

### 4. Crie o Serviço (`service.ts`)
Estenda `BaseService` e use o Repositório.
```typescript
export class CommentsService extends BaseService<Comment, CreateCommentDto> {
  constructor() {
    super();
    this.repo = new CommentsRepository();
  }
}
```

### 5. Crie o Controller (`controller.ts`)
Defina as rotas usando o Serviço.
```typescript
export const commentsController = router({
  "/api/comments": {
    GET: () => Response.json(commentsService.findAll()),
    POST: async (req) => { /* ... */ }
  }
});
```

### 6. Crie o Módulo (`module.ts`) e Registre
Exporte o controller no arquivo do módulo e registre no `server/index.ts`.

```typescript
// server/index.ts
import { CommentsModule } from "@modules/comments/comments.module";

routes: {
    ...CommentsModule.controller,
},
```

## 🎨 Frontend

Os arquivos de frontend (HTML, CSS, Imagens) estão localizados na pasta:
**`public/`**

O projeto utiliza [TailwindCSS](https://tailwindcss.com/) para estilização.

O servidor está configurado para servir o arquivo `public/index.html` na rota raiz (`/`).
