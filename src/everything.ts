export type Companions = {
  name: string;
  description: string;
  frameworks?: string[];
  installers?: Installer[];
  documentation?: string;
};

export type Installer = {
  packageManager: string;
  command: string;
  custom?: boolean;
};

export type Language = {
  packageManagers: string[];
  description: string;
  frameworks: string[];
  companions: Companions[];
  documentation: string;
};

export const Everything: Record<string, Language> = {
  Typescript: {
    packageManagers: ['npm', 'pnpm', 'yarn', 'bun'],
    description: 'The JavaScript Language',
    documentation: 'https://www.typescriptlang.org/docs/',
    frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
    companions: [
      {
        name: 'Next.js',
        description: 'The React Framework for Production',
        frameworks: ['React'],
        installers: [
          {
            packageManager: 'npm',
            command: 'npx create-next-app@latest',
          },
          {
            packageManager: 'pnpm',
            command: 'npx create-next-app@latest --use-pnpm',
          },
          {
            packageManager: 'yarn',
            command: 'npx create-next-app@latest --use-yarn',
          },
          {
            packageManager: 'bun',
            command: 'npx create-next-app@latest --use-bun',
          },
        ],
        documentation: 'https://nextjs.org/docs',
      },
      {
        name: 'Vite',
        description: 'Next Generation Frontend Tooling',
        frameworks: ['React', 'Vue', 'Svelte', 'Lit', 'Solid', 'Qwik'],
        installers: [
          {
            packageManager: 'npm',
            command: 'npm create vite@latest',
          },
          {
            packageManager: 'pnpm',
            command: 'pnpm create vite --template react-ts',
          },
          {
            packageManager: 'yarn',
            command: 'yarn create vite --template react-ts',
          },
          {
            packageManager: 'bun',
            command: 'bun create vite --template react-ts',
          },
        ],
        documentation: 'https://vitejs.dev/guide/',
      },
    ],
  },
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
        name: 'Vite',
        installers: [
          {
            packageManager: 'npm',
            command: 'npm install tailwindcss @tailwindcss/vite',
          },
          {
            packageManager: 'pnpm',
            command: 'pnpm add tailwindcss @tailwindcss/vite',
          },
          {
            packageManager: 'yarn',
            command: 'yarn add tailwindcss @tailwindcss/vite',
          },
          {
            packageManager: 'bun',
            command: 'bun add tailwindcss @tailwindcss/vite',
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
        name: 'PostCSS',
        installers: [
          {
            packageManager: 'npm',
            command: 'npm install tailwindcss @tailwindcss/postcss postcss',
          },
          {
            packageManager: 'pnpm',
            command: 'pnpm add tailwindcss @tailwindcss/postcss postcss',
          },
          {
            packageManager: 'yarn',
            command: 'yarn add tailwindcss @tailwindcss/postcss postcss',
          },
          {
            packageManager: 'bun',
            command: 'bun add tailwindcss @tailwindcss/postcss postcss',
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
        name: 'Vite',
        installers: [
          {
            packageManager: 'npm',
            command: 'npm install @shadcn/ui',
          },
          {
            packageManager: 'pnpm',
            command: 'pnpm add @shadcn/ui',
          },
          {
            packageManager: 'yarn',
            command: 'yarn add @shadcn/ui',
          },
          {
            packageManager: 'bun',
            command: 'bun add @shadcn/ui',
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
        ],
      },
    ],
  },
];
