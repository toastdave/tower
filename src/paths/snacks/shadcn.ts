import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { addCommandsToFile, writeExampleFiles } from '../../commands/snacks.js';
import { Snacks } from '../../everything.js';

export default async function handleShadCN(
  packageManager: string,
  snacksDir: string,
  commandsFilePath: string
) {
  try {
    const shadCNDir = path.join(snacksDir, 'shadcn');
    await fs.mkdir(shadCNDir, { recursive: true });

    const viteConfigExists = await fs
      .stat(path.join(process.cwd(), 'vite.config.ts'))
      .then(() => true)
      .catch(() => false);

    if (viteConfigExists) {
      p.note('Detected Vite project, preparing ShadCN with Vite...');

      const shadcnConfig = Snacks.ShadcnUI;
      if (!shadcnConfig) {
        throw new Error('ShadCN configuration not found');
      }

      const viteSetup = shadcnConfig.setup.find((setup) => setup.name === 'Vite');
      if (!viteSetup) {
        throw new Error('ShadCN Vite configuration not found');
      }

      // Get installer commands
      const installer = viteSetup.installers.find((i) => i.packageManager === packageManager);
      if (!installer) {
        throw new Error(`No installer found for package manager: ${packageManager}`);
      }

      // Add commands to the central commands file
      await addCommandsToFile(installer.commands, commandsFilePath, 'Shadcn UI (Vite)');

      // Write files to the shadcn directory
      await writeExampleFiles(viteSetup, shadCNDir);
    } else {
      p.note('ShadCN currently only supports Vite projects');
      process.exit(1);
    }
  } catch (error) {
    p.note(`Failed to prepare ShadCN: ${error}`);
    process.exit(1);
  }
}
