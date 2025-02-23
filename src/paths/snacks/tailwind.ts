import * as p from '@clack/prompts';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import path from 'path';
import { SetupOption, Snacks } from '../../everything.js';

export default async function handleTailwind(packageManager: string, snacksDir: string) {
  try {
    const tailwindDir = path.join(snacksDir, 'tailwind');
    await fs.mkdir(tailwindDir, { recursive: true });

    const viteConfigExists = await fs
      .stat(path.join(process.cwd(), 'vite.config.ts'))
      .then(() => true)
      .catch(() => false);

    if (viteConfigExists) {
      p.note('Detected Vite project, installing Tailwind with Vite...');
      await handleViteTailwind(packageManager, tailwindDir);
    } else {
      p.note('Installing Tailwind with PostCSS...');
      await handlePostCssTailwind(packageManager, tailwindDir);
    }
  } catch (error) {
    p.note(`Failed to install Tailwind: ${error}`);
    process.exit(1);
  }
}

async function writeExampleFiles(setup: SetupOption, tailwindDir: string) {
  for (const file of setup.files) {
    const filePath = path.join(tailwindDir, path.basename(file.path));
    await fs.writeFile(filePath, file.content, 'utf8');
  }
}

async function handleViteTailwind(packageManager: string, tailwindDir: string) {
  const tailwindConfig = Snacks.find((snack) => snack.name === 'Tailwind CSS');
  const viteSetup = tailwindConfig?.setup.find((setup) => setup.name === 'Vite');

  if (!tailwindConfig || !viteSetup) {
    throw new Error('Tailwind Vite configuration not found');
  }

  const installer = viteSetup.installers.find((i) => i.packageManager === packageManager);
  if (!installer) {
    throw new Error(`No installer found for package manager: ${packageManager}`);
  }

  for (const command of installer.commands) {
    const [cmd, ...args] = command.split(' ');
    await execa(cmd, args, { stdio: 'inherit' });
  }
  await writeExampleFiles(viteSetup, tailwindDir);
}

async function handlePostCssTailwind(packageManager: string, tailwindDir: string) {
  const tailwindConfig = Snacks.find((snack) => snack.name === 'Tailwind CSS');
  const postcssSetup = tailwindConfig?.setup.find((setup) => setup.name === 'PostCSS');

  if (!tailwindConfig || !postcssSetup) {
    throw new Error('Tailwind PostCSS configuration not found');
  }

  const installer = postcssSetup.installers.find((i) => i.packageManager === packageManager);
  if (!installer) {
    throw new Error(`No installer found for package manager: ${packageManager}`);
  }

  for (const command of installer.commands) {
    const [cmd, ...args] = command.split(' ');
    await execa(cmd, args, { stdio: 'inherit' });
  }
  await writeExampleFiles(postcssSetup, tailwindDir);
}
