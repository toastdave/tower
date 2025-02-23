export type Companions = {
  name: string;
  description: string;
  frameworks?: string[];
  installers?: Installer[];
  documentation?: string;
};

export type Installer = {
  packageManager: string;
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
  installers: Installer[];
  files: File[];
};

export type File = {
  path: string;
  content: string;
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
            packageManager: 'npm',
            commands: ['npx create-next-app@latest'],
          },
          {
            packageManager: 'pnpm',
            commands: ['npx create-next-app@latest --use-pnpm'],
          },
          {
            packageManager: 'yarn',
            commands: ['npx create-next-app@latest --use-yarn'],
          },
          {
            packageManager: 'bun',
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
            packageManager: 'npm',
            commands: ['npm create vite@latest'],
          },
          {
            packageManager: 'pnpm',
            commands: ['pnpm create vite --template react-ts'],
          },
          {
            packageManager: 'yarn',
            commands: ['yarn create vite --template react-ts'],
          },
          {
            packageManager: 'bun',
            commands: ['bun create vite --template react-ts'],
          },
        ],
        documentation: 'https://vitejs.dev/guide/',
      },
    ],
  },
};

export const Snacks: Snack[] = [
  {
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
            packageManager: 'npm',
            commands: ['npm install tailwindcss @tailwindcss/vite'],
          },
          {
            packageManager: 'pnpm',
            commands: ['pnpm add tailwindcss @tailwindcss/vite'],
          },
          {
            packageManager: 'yarn',
            commands: ['yarn add tailwindcss @tailwindcss/vite'],
          },
          {
            packageManager: 'bun',
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
            packageManager: 'npm',
            commands: [
              'npm install tailwindcss',
              '@tailwindcss/postcss postcss',
              'npx shadcn@latest add button',
            ],
          },
          {
            packageManager: 'pnpm',
            commands: [
              'pnpm add tailwindcss',
              '@tailwindcss/postcss postcss',
              'pnpm dlx shadcn@latest add button',
            ],
          },
          {
            packageManager: 'yarn',
            commands: [
              'yarn add tailwindcss',
              '@tailwindcss/postcss postcss',
              'npx shadcn@latest add button',
            ],
          },
          {
            packageManager: 'bun',
            commands: [
              'bun add tailwindcss',
              '@tailwindcss/postcss postcss',
              'bunx --bun shadcn@latest add button',
            ],
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
  {
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
            packageManager: 'npm',
            commands: [
              'npx shadcn@latest init',
              'npm install -D @types/node',
              'npx shadcn@latest add button',
            ],
          },
          {
            packageManager: 'pnpm',
            commands: [
              'pnpm dlx shadcn@latest init',
              'pnpm add -D @types/node',
              'pnpm dlx shadcn@latest add button',
            ],
          },
          {
            packageManager: 'yarn',
            commands: [
              'npx shadcn@latest init',
              'yarn add -D @types/node',
              'npx shadcn@latest add button',
            ],
          },
          {
            packageManager: 'bun',
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
];
