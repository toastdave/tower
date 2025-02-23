import * as p from '@clack/prompts';
import { execa } from 'execa';
import * as fs from 'fs/promises';
import path from 'path';
import { SetupOption, Snacks } from '../../everything.js';

export default async function handleShadCN(packageManager: string, snacksDir: string) {
  try {
    const shadCNDir = path.join(snacksDir, 'shadcn');
    await fs.mkdir(shadCNDir, { recursive: true });

    const viteConfigExists = await fs
      .stat(path.join(process.cwd(), 'vite.config.ts'))
      .then(() => true)
      .catch(() => false);

    if (viteConfigExists) {
      p.note('Detected Vite project, installing ShadCN with Vite...');
      await handleVite(packageManager, shadCNDir);
    } else {
      p.note('ShadCN currently only supports Vite projects');
      process.exit(1);
    }
  } catch (error) {
    p.note(`Failed to install ShadCN: ${error}`);
    process.exit(1);
  }
}

async function writeExampleFiles(setup: SetupOption, shadcnDir: string) {
  for (const file of setup.files) {
    const filePath = path.join(shadcnDir, path.basename(file.path));
    await fs.writeFile(filePath, file.content, 'utf8');
  }
}

async function handleVite(packageManager: string, shadcnDir: string) {
  const shadcnConfig = Snacks.find((snack) => snack.name === 'Shadcn UI');
  const viteSetup = shadcnConfig?.setup.find((setup) => setup.name === 'Vite');

  if (!shadcnConfig || !viteSetup) {
    throw new Error('ShadCN Vite configuration not found');
  }

  const installer = viteSetup.installers.find((i) => i.packageManager === packageManager);
  if (!installer) {
    throw new Error(`No installer found for package manager: ${packageManager}`);
  }

  for (const command of installer.commands) {
    const [cmd, ...args] = command.split(' ');
    await execa(cmd, args, { stdio: 'inherit' });
  }
  await writeExampleFiles(viteSetup, shadcnDir);
}
