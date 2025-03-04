import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { addCommandsToFile, writeExampleFiles } from '../../commands/snacks.js';
import { Snacks } from '../../everything.js';

export default async function handleTailwind(
  packageManager: string,
  snacksDir: string,
  commandsFilePath: string
) {
  try {
    const tailwindDir = path.join(snacksDir, 'tailwind');
    await fs.mkdir(tailwindDir, { recursive: true });

    const viteConfigExists = await fs
      .stat(path.join(process.cwd(), 'vite.config.ts'))
      .then(() => true)
      .catch(() => false);

    const tailwindConfig = Snacks.TailwindCSS;
    if (!tailwindConfig) {
      throw new Error('Tailwind configuration not found');
    }

    if (viteConfigExists) {
      p.note('Detected Vite project, preparing Tailwind with Vite...');
      const viteSetup = tailwindConfig.setup.find((setup) => setup.name === 'Vite');

      if (!viteSetup) {
        throw new Error('Tailwind Vite configuration not found');
      }

      // Get installer commands
      const installer = viteSetup.installers?.find((i) => i.tool === packageManager);
      if (!installer) {
        throw new Error(`No installer found for package manager: ${packageManager}`);
      }

      // Add commands to the central commands file
      await addCommandsToFile(installer.commands, commandsFilePath, 'Tailwind CSS (Vite)');

      // Write files to the tailwind directory
      await writeExampleFiles(viteSetup, tailwindDir);
    } else {
      p.note('Preparing Tailwind with PostCSS...');
      const postcssSetup = tailwindConfig.setup.find((setup) => setup.name === 'Other');

      if (!postcssSetup) {
        throw new Error('Tailwind PostCSS configuration not found');
      }

      // Get installer commands
      const installer = postcssSetup.installers?.find((i) => i.tool === packageManager);
      if (!installer) {
        throw new Error(`No installer found for package manager: ${packageManager}`);
      }

      // Add commands to the central commands file
      await addCommandsToFile(installer.commands, commandsFilePath, 'Tailwind CSS (PostCSS)');

      // Write files to the tailwind directory
      await writeExampleFiles(postcssSetup, tailwindDir);
    }
  } catch (error) {
    p.note(`Failed to prepare Tailwind: ${error}`);
    process.exit(1);
  }
}
