import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { addCommandsToFile, writeExampleFiles } from '../../commands/snacks.js';
import { Snacks } from '../../everything.js';

export default async function handlePrettier(
  packageManager: string,
  snacksDir: string,
  commandsFilePath: string
) {
  try {
    const prettierDir = path.join(snacksDir, 'prettier');
    await fs.mkdir(prettierDir, { recursive: true });

    // Get the Prettier configuration
    const prettierConfig = Snacks.Prettier;
    if (!prettierConfig) {
      throw new Error('Prettier configuration not found');
    }

    // Use the "Any" setup since Prettier is framework-agnostic
    const setup = prettierConfig.setup.find((s) => s.name === 'Any');
    if (!setup) {
      throw new Error('Prettier setup not found');
    }

    // Get installer commands for the current package manager
    const installer = setup.installers?.find((i) => i.tool === packageManager);
    if (!installer) {
      throw new Error(`No installer found for package manager: ${packageManager}`);
    }

    // Add commands to the central commands file
    await addCommandsToFile(installer.commands, commandsFilePath, 'Prettier');

    // Write example files to the snacks directory only
    await writeExampleFiles(setup, prettierDir);

    p.note(`Prettier configuration prepared in ${prettierDir}`);
    p.note(`
To use Prettier in your project:
1. Install the dependencies using the commands in commands.txt
2. Copy the .prettierrc file from ${prettierDir} to your project root if desired
3. Add scripts to your package.json:
   "format": "prettier --write ."
   "format:check": "prettier --check ."
4. Run 'npm run format' to format all files
    `);
  } catch (error) {
    p.note(`Failed to prepare Prettier: ${error}`);
    process.exit(1);
  }
}
