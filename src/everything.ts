export type Framework = {
  name: string;
  description: string;
  languages?: string[];
  frameworks?: string[];
  installers?: Installer[];
  documentation?: string;
};

export type Installer = {
  packageManager: string;
  command: string;
  custom?: boolean;
};

export enum Language {
  TypeScript = 'TypeScript',
  Python = 'Python',
  Go = 'Go',
  Rust = 'Rust',
  Csharp = 'C#',
  Java = 'Java',
}

export const Frameworks: Framework[] = [
  {
    name: 'Next.js',
    description: 'The React Framework for Production',
    languages: [Language.TypeScript],
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
    languages: [Language.TypeScript],
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
];

export type Snack = {
  name: string;
  description: string;
  installers?: Installer[];
  documentation?: string;
};

export const Snacks: Snack[] = [];
