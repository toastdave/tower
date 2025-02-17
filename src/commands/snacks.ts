import * as p from '@clack/prompts';
import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';

type Tool = {
  name: string;
  value: string;
  description: string;
  frameworks?: string[];
};

const tools: Tool[] = [
  {
    name: 'Tailwind CSS',
    value: 'tailwind',
    description: 'A utility-first CSS framework',
    frameworks: ['react', 'vue', 'svelte', 'astro', 'solid', 'next'],
  },
  {
    name: 'shadcn/ui',
    value: 'shadcn',
    description: 'Re-usable components built with Radix UI and Tailwind',
    frameworks: ['react', 'next'],
  },
  {
    name: 'Drizzle ORM',
    value: 'drizzle',
    description: 'TypeScript ORM with edge-runtime compatibility',
  },
  {
    name: 'SQLite + LibSQL',
    value: 'libsql',
    description: 'Local SQLite database with LibSQL extensions',
  },
  {
    name: 'PostgreSQL Docker',
    value: 'postgres-docker',
    description: 'PostgreSQL database in Docker container',
  },
  {
    name: 'MySQL Docker',
    value: 'mysql-docker',
    description: 'MySQL database in Docker container',
  },
  {
    name: 'Prisma',
    value: 'prisma',
    description: 'Next-generation ORM for Node.js and TypeScript',
  },
  {
    name: 'tRPC',
    value: 'trpc',
    description: 'End-to-end typesafe APIs made easy',
    frameworks: ['react', 'next'],
  },
];

async function detectFrameworkAndPackageManager(): Promise<{
  framework: string | null;
  packageManager: string | null;
}> {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

    // Detect package manager
    let packageManager = null;
    const lockfiles = {
      'package-lock.json': 'npm',
      'yarn.lock': 'yarn',
      'pnpm-lock.yaml': 'pnpm',
      'bun.lockb': 'bun',
    };

    for (const [file, pm] of Object.entries(lockfiles)) {
      if (await fs.stat(path.join(process.cwd(), file)).catch(() => false)) {
        packageManager = pm;
        break;
      }
    }

    // Detect framework
    let framework = null;
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    if (dependencies['next']) framework = 'next';
    else if (dependencies['react']) framework = 'react';
    else if (dependencies['vue']) framework = 'vue';
    else if (dependencies['svelte']) framework = 'svelte';
    else if (dependencies['astro']) framework = 'astro';
    else if (dependencies['solid-js']) framework = 'solid';

    return { framework, packageManager };
  } catch (error) {
    return { framework: null, packageManager: null };
  }
}

export const snacks = new Command()
  .name('snacks')
  .description('Add development tools to your project')
  .action(async () => {
    p.intro('Snacks - Add tools to your project');

    // Detect current project setup
    const detected = await detectFrameworkAndPackageManager();

    let framework: string;
    if (detected.framework) {
      const confirmFramework = await p.confirm({
        message: `Detected ${detected.framework} project. Is this correct?`,
      });

      if (p.isCancel(confirmFramework)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      if (!confirmFramework) {
        const selectedFramework = await p.select({
          message: 'What framework are you using?',
          options: [
            { label: 'React', value: 'react' },
            { label: 'Next.js', value: 'next' },
            { label: 'Vue', value: 'vue' },
            { label: 'Svelte', value: 'svelte' },
            { label: 'Astro', value: 'astro' },
            { label: 'Solid', value: 'solid' },
          ],
        });

        if (p.isCancel(selectedFramework)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        framework = selectedFramework as string;
      } else {
        framework = detected.framework;
      }
    } else {
      const selectedFramework = await p.select({
        message: 'Could not detect framework. Please select:',
        options: [
          { label: 'React', value: 'react' },
          { label: 'Next.js', value: 'next' },
          { label: 'Vue', value: 'vue' },
          { label: 'Svelte', value: 'svelte' },
          { label: 'Astro', value: 'astro' },
          { label: 'Solid', value: 'solid' },
        ],
      });

      if (p.isCancel(selectedFramework)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }
      framework = selectedFramework as string;
    }

    let packageManager: string;
    if (detected.packageManager) {
      const confirmPM = await p.confirm({
        message: `Detected ${detected.packageManager}. Is this correct?`,
      });

      if (p.isCancel(confirmPM)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }

      if (!confirmPM) {
        const selectedPM = await p.select({
          message: 'Which package manager are you using?',
          options: [
            { label: 'npm', value: 'npm' },
            { label: 'pnpm', value: 'pnpm' },
            { label: 'yarn', value: 'yarn' },
            { label: 'bun', value: 'bun' },
          ],
        });

        if (p.isCancel(selectedPM)) {
          p.cancel('Operation cancelled');
          process.exit(0);
        }
        packageManager = selectedPM as string;
      } else {
        packageManager = detected.packageManager;
      }
    } else {
      const selectedPM = await p.select({
        message: 'Could not detect package manager. Please select:',
        options: [
          { label: 'npm', value: 'npm' },
          { label: 'pnpm', value: 'pnpm' },
          { label: 'yarn', value: 'yarn' },
          { label: 'bun', value: 'bun' },
        ],
      });

      if (p.isCancel(selectedPM)) {
        p.cancel('Operation cancelled');
        process.exit(0);
      }
      packageManager = selectedPM as string;
    }

    const compatibleTools = tools.filter(
      (tool) => !tool.frameworks || tool.frameworks.includes(framework as string)
    );

    const selectedTools = await p.multiselect({
      message: 'Select tools to add to your project:',
      options: compatibleTools.map((tool) => ({
        label: tool.name,
        value: tool.value,
        hint: tool.description,
      })),
    });

    if (p.isCancel(selectedTools)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    const { execa } = await import('execa');

    for (const tool of selectedTools as string[]) {
      try {
        switch (tool) {
          case 'tailwind':
            await execa(
              packageManager as string,
              ['add', '-D', 'tailwindcss', 'postcss', 'autoprefixer'],
              { stdio: 'inherit' }
            );
            await execa('npx', ['tailwindcss', 'init', '-p'], { stdio: 'inherit' });
            break;
          case 'shadcn':
            await execa('npx', ['shadcn-ui@latest', 'init'], { stdio: 'inherit' });
            break;
          case 'drizzle':
            await execa(packageManager as string, ['add', 'drizzle-orm'], { stdio: 'inherit' });
            await execa(packageManager as string, ['add', '-D', 'drizzle-kit'], {
              stdio: 'inherit',
            });
            break;
          case 'libsql':
            await execa(packageManager as string, ['add', '@libsql/client'], { stdio: 'inherit' });
            break;
          case 'postgres-docker':
          case 'mysql-docker':
            // TODO: Copy appropriate Dockerfile and docker-compose.yml
            break;
          case 'prisma':
            await execa(packageManager as string, ['add', '-D', 'prisma'], { stdio: 'inherit' });
            await execa(packageManager as string, ['add', '@prisma/client'], { stdio: 'inherit' });
            await execa('npx', ['prisma', 'init'], { stdio: 'inherit' });
            break;
          case 'trpc':
            await execa(packageManager as string, ['add', '@trpc/server', '@trpc/client'], {
              stdio: 'inherit',
            });
            break;
        }
        p.note(`✓ Successfully installed ${tool}`);
      } catch (error) {
        p.note(`Failed to install ${tool}: ${error}`);
      }
    }

    p.outro('All selected tools have been installed!');
  });
