export type Companions = {
  name: string;
  description: string;
  frameworks?: string[];
  installers?: Installer[];
  documentation?: string;
};

export type Installer = {
  tool: string;
  commands: string[];
  custom?: boolean;
};

export type Language = {
  packageManagers: string[];
  description: string;
  frameworks: string[];
  companions: Companions[];
  documentation: string;
};

export type Snack = {
  name: string;
  description: string;
  languages?: string[];
  frameworks?: string[];
  documentation?: string;
  setup: SetupOption[];
  installers?: Installer[];
};

export type SetupOption = {
  name: string;
  installers?: Installer[];
  files?: File[];
};

export type File = {
  path: string;
  content?: string;
};

export enum MetaList {
  Any = 'Any',
  Other = 'Other',
  Vite = 'Vite',
  NextJS = 'NextJS',
}

export const Everything: Record<string, Language> = {
  Typescript: {
    packageManagers: ['npm', 'pnpm', 'yarn', 'bun'],
    description: 'The JavaScript Language',
    documentation: 'https://www.typescriptlang.org/docs/',
    frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
    companions: [
      {
        name: MetaList.NextJS,
        description: 'The React Framework for Production',
        frameworks: ['React'],
        installers: [
          {
            tool: 'npm',
            commands: ['npx create-next-app@latest'],
          },
          {
            tool: 'pnpm',
            commands: ['npx create-next-app@latest --use-pnpm'],
          },
          {
            tool: 'yarn',
            commands: ['npx create-next-app@latest --use-yarn'],
          },
          {
            tool: 'bun',
            commands: ['npx create-next-app@latest --use-bun'],
          },
        ],
        documentation: 'https://nextjs.org/docs',
      },
      {
        name: MetaList.Vite,
        description: 'Next Generation Frontend Tooling',
        frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
        installers: [
          {
            tool: 'npm',
            commands: ['npm create vite@latest'],
          },
          {
            tool: 'pnpm',
            commands: ['pnpm create vite --template react-ts'],
          },
          {
            tool: 'yarn',
            commands: ['yarn create vite --template react-ts'],
          },
          {
            tool: 'bun',
            commands: ['bun create vite --template react-ts'],
          },
        ],
        documentation: 'https://vitejs.dev/guide/',
      },
    ],
  },
};

export const Snacks: Record<string, Snack> = {
  TailwindCSS: {
    name: 'Tailwind CSS',
    description:
      'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
    languages: ['Typescript'],
    frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
    documentation: 'https://tailwindcss.com/docs',
    setup: [
      {
        name: MetaList.Vite,
        installers: [
          {
            tool: 'npm',
            commands: ['npm install tailwindcss @tailwindcss/vite'],
          },
          {
            tool: 'pnpm',
            commands: ['pnpm add tailwindcss @tailwindcss/vite'],
          },
          {
            tool: 'yarn',
            commands: ['yarn add tailwindcss @tailwindcss/vite'],
          },
          {
            tool: 'bun',
            commands: ['bun add tailwindcss @tailwindcss/vite'],
          },
        ],
        files: [
          {
            path: './vite.config.ts',
            content: `
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
plugins: [
tailwindcss(),
],
})
            `,
          },
          {
            path: './src/index.css',
            content: `
@import "tailwindcss";
            `,
          },
        ],
      },
      {
        name: MetaList.Other,
        installers: [
          {
            tool: 'npm',
            commands: ['npm install tailwindcss', '@tailwindcss/postcss postcss'],
          },
          {
            tool: 'pnpm',
            commands: ['pnpm add tailwindcss', '@tailwindcss/postcss postcss'],
          },
          {
            tool: 'yarn',
            commands: ['yarn add tailwindcss', '@tailwindcss/postcss postcss'],
          },
          {
            tool: 'bun',
            commands: ['bun add tailwindcss', '@tailwindcss/postcss postcss'],
          },
        ],
        files: [
          {
            path: './postcss.config.mjs',
            content: `
export default {
plugins: {
"@tailwindcss/postcss": {},
}
}
            `,
          },
          {
            path: './src/index.css',
            content: `
@import "tailwindcss";
            `,
          },
        ],
      },
    ],
  },
  ShadcnUI: {
    name: 'Shadcn UI',
    description: 'Build complex React apps with ease',
    languages: ['Typescript'],
    frameworks: ['React'],
    documentation: 'https://ui.shadcn.com/docs',
    setup: [
      {
        name: MetaList.Vite,
        installers: [
          {
            tool: 'npm',
            commands: [
              'npx shadcn@latest init',
              'npm install -D @types/node',
              'npx shadcn@latest add button',
            ],
          },
          {
            tool: 'pnpm',
            commands: [
              'pnpm dlx shadcn@latest init',
              'pnpm add -D @types/node',
              'pnpm dlx shadcn@latest add button',
            ],
          },
          {
            tool: 'yarn',
            commands: [
              'npx shadcn@latest init',
              'yarn add -D @types/node',
              'npx shadcn@latest add button',
            ],
          },
          {
            tool: 'bun',
            commands: [
              'bunx --bun shadcn@latest init',
              'bun add -D @types/node',
              'bunx --bun shadcn@latest add button',
            ],
          },
        ],
        files: [
          {
            path: './tsconfig.json',
            content: `
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
            `,
          },
          {
            path: './tsconfig.app.json',
            content: `
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
            `,
          },
          {
            path: './vite.config.ts',
            content: `
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
            `,
          },
        ],
      },
    ],
  },
  LocalDockerDB: {
    name: 'Local Docker DB',
    description: 'A local Docker DB',
    languages: ['Any'],
    frameworks: ['Any'],
    documentation: 'https://www.docker.com/products/docker-desktop/',
    setup: [
      {
        name: 'PostgreSQL',
        installers: [
          {
            tool: 'Docker',
            commands: ['docker-compose up -d'],
          },
        ],
        files: [
          {
            path: './Dockerfile',
            content: `
# Use the official PostgreSQL image as a base
FROM postgres:15

# Environment variables for database configuration
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=localdb

# Optional: Set timezone
ENV TZ=UTC

# Copy initialization scripts
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432

# Set the default command to run when starting the container
CMD ["postgres"]
            `,
          },
          {
            path: './docker-compose.yml',
            content: `
version: '3.8'

services:
  postgres:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: local-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: localdb
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
            `,
          },
        ],
      },
      {
        name: 'MySQL',
        installers: [
          {
            tool: 'Docker',
            commands: ['docker-compose up -d'],
          },
        ],
        files: [
          {
            path: './Dockerfile',
            content: `
# Use the official MySQL image as a base
FROM mysql:8.0

# Environment variables for database configuration
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=localdb

# Optional: Set timezone
ENV TZ=UTC

# Copy initialization scripts
COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306

# Set the default command to run when starting the container
CMD ["mysqld"]
            `,
          },
          {
            path: './docker-compose.yml',
            content: `
version: '3.8'

services:
  mysql:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: local-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: localdb
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql-data:
            `,
          },
        ],
      },
      {
        name: 'SQLite',
        files: [
          {
            path: './local.db',
          },
        ],
      },
    ],
  },
  Prettier: {
    name: 'Prettier',
    description: 'Prettier is an opinionated code formatter',
    languages: ['Typescript'],
    frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
    documentation: 'https://prettier.io/docs',
    setup: [
      {
        name: MetaList.Any,
        installers: [
          {
            tool: 'npm',
            commands: [
              'npm install --save-dev --save-exact prettier',
              'npm install --save-dev @trivago/prettier-plugin-sort-imports',
            ],
          },
          {
            tool: 'pnpm',
            commands: [
              'pnpm add --save-dev --save-exact prettier',
              'pnpm add --save-dev @trivago/prettier-plugin-sort-imports',
            ],
          },
          {
            tool: 'yarn',
            commands: [
              'yarn add --dev --exact prettier',
              'yarn add --dev @trivago/prettier-plugin-sort-imports',
            ],
          },
          {
            tool: 'bun',
            commands: [
              'bun add --dev --exact prettier',
              'bun add --dev @trivago/prettier-plugin-sort-imports',
            ],
          },
        ],
        files: [
          {
            path: '.prettierrc',
            content: `
"semi": true,
"singleQuote": false,
"tabWidth": 2,
"trailingComma": "es5",
"importOrder": [
  "^(react|next?/?([a-zA-Z/]*))$",
  "<THIRD_PARTY_MODULES>",
  "^@/(.*)$",
  "^[./]"
],
"importOrderSeparation": true,
"importOrderSortSpecifiers": true,
"plugins": [
  "@trivago/prettier-plugin-sort-imports",
  "prettier-plugin-tailwindcss"
]
            `,
          },
        ],
      },
    ],
  },
  VSCodeSettings: {
    name: 'VSCode Settings',
    description: 'VSCode Settings',
    languages: ['Typescript'],
    frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
    documentation: 'https://code.visualstudio.com/docs',
    setup: [
      {
        name: MetaList.Any,
        files: [
          {
            path: '.vscode/settings.json',
            content: `
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "always",
    "source.organizeImports": "always"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
            `,
          },
        ],
      },
    ],
  },
};
