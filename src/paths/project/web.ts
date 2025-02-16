import * as p from '@clack/prompts';
import { execa } from 'execa';

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

export default async function handleWebApp(
  language: string,
  packageManager: string
): Promise<{ framework: string; companion: string; projectName: string } | symbol> {
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

  const projectName = await p.text({
    message: 'What is the name of your project?',
  });

  if (p.isCancel(projectName)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  const result = {
    framework: framework as string,
    companion: companion as string,
    projectName: projectName as string,
  };

  await createProject(result.projectName, result.framework, result.companion, packageManager);
  return result;
}

const createProject = async (
  projectName: string,
  framework: string,
  companion: string,
  packageManager: string
) => {
  p.note('Setting up Web Application...');

  try {
    switch (framework) {
      case 'react':
        if (companion === 'next') {
          await execa(packageManager, ['create', 'next-app', projectName], { stdio: 'inherit' });
        } else if (companion === 'vite') {
          switch (packageManager) {
            case 'bun':
              await execa('bun', ['create', 'vite', projectName, '--template', 'react-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'pnpm':
              await execa('pnpm', ['create', 'vite', projectName, '--template', 'react-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'yarn':
              await execa('yarn', ['create', 'vite', projectName, '--template', 'react-ts'], {
                stdio: 'inherit',
              });
              break;
            default:
              await execa('npm', ['create', 'vite@latest', projectName, '--template', 'react-ts'], {
                stdio: 'inherit',
              });
          }
        }
        break;
      case 'vue':
        if (companion === 'nuxt') {
          await execa(packageManager, ['dlx', 'nuxi', 'init', projectName]);
        } else if (companion === 'vite') {
          switch (packageManager) {
            case 'bun':
              await execa('bun', ['create', 'vite', projectName, '--template', 'vue-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'pnpm':
              await execa('pnpm', ['create', 'vite', projectName, '--template', 'vue-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'yarn':
              await execa('yarn', ['create', 'vite', projectName, '--template', 'vue-ts'], {
                stdio: 'inherit',
              });
              break;
            default:
              await execa('npm', ['create', 'vite@latest', projectName, '--template', 'vue-ts'], {
                stdio: 'inherit',
              });
          }
        }
        break;
      case 'svelte':
        if (companion === 'sveltekit') {
          await execa(packageManager, ['create', 'svelte@latest', projectName]);
        } else if (companion === 'vite') {
          switch (packageManager) {
            case 'bun':
              await execa('bun', ['create', 'vite', projectName, '--template', 'svelte-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'pnpm':
              await execa('pnpm', ['create', 'vite', projectName, '--template', 'svelte-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'yarn':
              await execa('yarn', ['create', 'vite', projectName, '--template', 'svelte-ts'], {
                stdio: 'inherit',
              });
              break;
            default:
              await execa(
                'npm',
                ['create', 'vite@latest', projectName, '--template', 'svelte-ts'],
                { stdio: 'inherit' }
              );
          }
        }
        break;
      case 'solid':
        if (companion === 'solid-start') {
          await execa(packageManager, ['create', 'solid-start', projectName]);
        } else if (companion === 'vite') {
          switch (packageManager) {
            case 'bun':
              await execa('bun', ['create', 'vite', projectName, '--template', 'solid-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'pnpm':
              await execa('pnpm', ['create', 'vite', projectName, '--template', 'solid-ts'], {
                stdio: 'inherit',
              });
              break;
            case 'yarn':
              await execa('yarn', ['create', 'vite', projectName, '--template', 'solid-ts'], {
                stdio: 'inherit',
              });
              break;
            default:
              await execa('npm', ['create', 'vite@latest', projectName, '--template', 'solid-ts'], {
                stdio: 'inherit',
              });
          }
        }
        break;
      case 'astro':
        await execa(packageManager, ['create', 'astro@latest', projectName]);
        break;
      case 'qwik':
        await execa(packageManager, ['create', 'qwik@latest', projectName]);
        break;
      case 'angular':
        await execa(packageManager, ['create', '@angular/cli', projectName]);
        break;
    }

    // Install dependencies
    p.note('Installing dependencies...');
    await execa(packageManager, ['install'], {
      cwd: projectName,
      stdio: 'inherit',
    });

    // Initialize git repository and set main branch
    p.note('Initializing git repository...');
    await execa('git', ['init'], {
      cwd: projectName,
      stdio: 'inherit',
    });
    await execa('git', ['branch', '-M', 'main'], {
      cwd: projectName,
      stdio: 'inherit',
    });

    p.note(`Successfully created ${framework} project with ${companion}`);
  } catch (error) {
    p.note(`Failed to create project: ${error}`);
    process.exit(1);
  }
};
