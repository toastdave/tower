import * as p from '@clack/prompts';
import { execa } from 'execa';
import { Everything } from '../../everything.js';

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
};

export default async function handleWebApp(
  language: string,
  packageManager: string,
  projectName: string
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
          const nextConfig = Everything.Typescript.companions.find(
            (t: { name: string }) => t.name === 'Next.js'
          );
          const nextInstaller = nextConfig?.installers?.find(
            (i: { packageManager: string }) => i.packageManager === packageManager
          );
          if (nextInstaller) {
            await execa(
              nextInstaller.command.split(' ')[0],
              [...nextInstaller.command.split(' ').slice(1), projectName],
              { stdio: 'inherit' }
            );
          }
        } else if (companion === 'vite') {
          const viteConfig = Everything.Typescript.companions.find(
            (t: { name: string }) => t.name === 'Vite'
          );
          const viteInstaller = viteConfig?.installers?.find(
            (i: { packageManager: string }) => i.packageManager === packageManager
          );
          if (viteInstaller) {
            await execa(
              viteInstaller.command.split(' ')[0],
              [...viteInstaller.command.split(' ').slice(1), projectName],
              { stdio: 'inherit' }
            );
          }
        }
        break;
      default:
        p.note(`Unsupported framework: ${framework}`);
        process.exit(1);
    }

    // Install dependencies
    p.note('Installing dependencies...');
    await execa(packageManager, ['install'], {
      cwd: projectName,
      stdio: 'inherit',
    });

    p.note(`Successfully created ${framework} project with ${companion}`);
  } catch (error) {
    p.note(`Failed to create project: ${error}`);
    process.exit(1);
  }
};
