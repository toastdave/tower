import * as p from '@clack/prompts';

export type Framework = {
  name: string;
  value: string;
  description: string;
};

export const frameworks: Framework[] = [
  {
    name: 'React',
    value: 'react',
    description: 'React is a JavaScript library for building user interfaces.',
  },
  {
    name: 'Astro',
    value: 'astro',
    description: 'Astro is a JavaScript library for building user interfaces.',
  },
  {
    name: 'Vue',
    value: 'vue',
    description: 'Vue is a progressive framework for building user interfaces.',
  },
  {
    name: 'Angular',
    value: 'angular',
    description: 'Angular is a platform for building mobile and desktop web applications.',
  },
  {
    name: 'Svelte',
    value: 'svelte',
    description: 'Svelte is a JavaScript library for building user interfaces.',
  },
  {
    name: 'Solid',
    value: 'solid',
    description: 'Solid is a JavaScript library for building user interfaces.',
  },
  {
    name: 'Qwik',
    value: 'qwik',
    description: 'Qwik is a JavaScript library for building user interfaces.',
  },
];

type Companion = {
  name: string;
  value: string;
  description: string;
};

const companionOptions: Record<string, Companion[]> = {
  react: [
    {
      name: 'Next.js',
      value: 'next',
      description: 'The React Framework for Production',
    },
    {
      name: 'Vite',
      value: 'vite',
      description: 'Next Generation Frontend Tooling',
    },
  ],
  astro: [
    {
      name: 'Standalone',
      value: 'standalone',
      description: 'Basic Astro setup without additional integrations',
    },
  ],
  vue: [
    {
      name: 'Nuxt',
      value: 'nuxt',
      description: 'The Intuitive Vue Framework',
    },
    {
      name: 'Vite',
      value: 'vite',
      description: 'Next Generation Frontend Tooling',
    },
  ],
  angular: [
    {
      name: 'Standalone',
      value: 'standalone',
      description: 'Standard Angular CLI setup',
    },
  ],
  svelte: [
    {
      name: 'SvelteKit',
      value: 'sveltekit',
      description: 'The fastest way to build Svelte apps',
    },
    {
      name: 'Vite',
      value: 'vite',
      description: 'Next Generation Frontend Tooling',
    },
  ],
  solid: [
    {
      name: 'SolidStart',
      value: 'solid-start',
      description: 'The Solid meta-framework for building applications',
    },
    {
      name: 'Vite',
      value: 'vite',
      description: 'Next Generation Frontend Tooling',
    },
  ],
  qwik: [
    {
      name: 'Qwik City',
      value: 'qwik-city',
      description: 'The meta-framework for Qwik',
    },
  ],
};

async function handleWebApp(
  language: string,
  packageManager: string
): Promise<{ framework: string; companion: string } | symbol> {
  const framework = await p.select({
    message: 'What framework would you like to use?',
    options: frameworks.map((framework) => ({
      label: framework.name,
      value: framework.value,
      hint: framework.description,
    })),
  });

  if (p.isCancel(framework)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  const companion = await p.select({
    message: 'Which companion framework would you like to use?',
    options: companionOptions[framework as string].map((companion) => ({
      label: companion.name,
      value: companion.value,
      hint: companion.description,
    })),
  });

  if (p.isCancel(companion)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  p.note('Setting up Web Application...');

  return {
    framework: framework as string,
    companion: companion as string,
  };
}

export default handleWebApp;
