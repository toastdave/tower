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
  installers?: Installer[];
  documentation?: string;
};

export const Snacks: Snack[] = [];
