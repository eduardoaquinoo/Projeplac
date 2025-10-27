# Projeplac

Projeplac é uma plataforma web que centraliza projetos acadêmicos produzidos na UNICEPLAC, oferecendo um catálogo pesquisável com destaque para autores, cursos e categorias. A aplicação foi construída com React, Vite e Tailwind CSS e conta com uma API Node.js/SQLite responsável pelos dados dos projetos.

## Estrutura do repositório

- `Projeplac 1.1.0/` – versão atual da aplicação. Projeto Vite + React com componentes em `src/components`, estilos em `src/styles`, utilitários em `src/utils` (validados para autenticação local e integrações com a API) e recursos estáticos em `src/assets`.
- `projeplac 1.0.0/` – versão anterior do frontend, mantida como referência histórica.
- `paginaInicialFront/` – protótipo inicial exportado do Figma, útil para consulta.
- `README.md` – este arquivo.

Dentro de `Projeplac 1.1.0/src`, os principais diretórios são:

- `components/` – componentes React que compõem as telas (Header, Hero, Projects, Login, Dashboard etc.). Os subdiretórios `components/ui` e `components/figma` abrigam elementos estilizados reutilizáveis e assets importados do Figma.
- `styles/` – arquivos de estilo globais (Tailwind CSS 4).
- `utils/` – funções auxiliares, incluindo o helper de autenticação local (`utils/auth.ts`) e utilitários da aplicação.
- `guidelines/` – notas e diretrizes de design/cópia usadas no desenvolvimento.

## Pré-requisitos

- Node.js 18 ou superior (recomendado instalar via [nvm](https://github.com/nvm-sh/nvm)).
- npm (instalado junto com o Node.js). Se preferir, adapte os comandos para pnpm ou yarn.
- Opcional: ferramentas SQLite (como o `sqlite3`) para inspecionar o banco local (`api/projeplac.db`).

## Instalação e execução local (versão 1.1.0)

1. Abra um terminal na raiz do repositório:
   ```bash
   cd /caminho/para/ProjetoIntegrador/Projeplac
   ```
2. Acesse a pasta da versão atual (note as aspas por causa do espaço no nome):
   ```bash
   cd "Projeplac 1.1.0"
   ```
3. Instale as dependências do frontend:
   ```bash
   npm install
   ```
4. Instale as dependências do backend e popule o banco:
   ```bash
   cd api
   npm install
   npm run seed
   cd ..
   ```
5. Inicie o servidor de desenvolvimento (frontend e API) em terminais separados ou use o script agregado:
   ```bash
   # duas abas/terminais
   npm run dev        # frontend (porta 5173)
   npm run dev:api    # backend (porta 3333)

   # ou com um único comando
   npm run dev:full
   ```
6. Abra o navegador em `http://localhost:5173`. O hot reload ficará ativo enquanto os comandos estiverem rodando.

### Integração com a API local

- O frontend consome a API Express/SQLite exposta em `http://localhost:3333`.
- A autenticação de exemplo é feita no navegador (armazenada em `localStorage`), permitindo logins de teste sem depender de serviços externos. Ajuste `src/utils/auth.ts` se desejar uma estratégia diferente.

## Scripts disponíveis

Dentro de `Projeplac 1.1.0`:

- `npm run dev` – inicia somente o frontend.
- `npm run dev:api` – inicia o backend em `api/`.
- `npm run dev:full` – executa frontend e backend em paralelo.
- `npm run build` – gera a build de produção em `dist/`.

### Somente frontend (prototipagem rápida)

Se quiser apenas subir o frontend atual sem o backend:

```bash
cd "Projeplac 1.1.0"
npm install
npm run dev
```

O app ficará disponível em `http://localhost:5173`.

### Frontend legado (`paginaInicialFront/`)

Para executar o protótipo exportado do Figma:

```bash
cd paginaInicialFront
npm install
npm run dev
```

Abra `http://localhost:5173` em outra aba para visualizar essa versão.

## Próximos passos sugeridos

- Revisar e eventualmente remover as versões legadas (`projeplac 1.0.0/` e `paginaInicialFront/`) se não forem mais necessárias.
