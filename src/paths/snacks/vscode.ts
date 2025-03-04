import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { writeExampleFiles } from '../../commands/snacks.js';
import { Snacks } from '../../everything.js';

export default async function handleVSCodeSettings(
  packageManager: string,
  snacksDir: string,
  commandsFilePath: string
) {
  try {
    const vscodeDir = path.join(snacksDir, 'vscode');
    await fs.mkdir(vscodeDir, { recursive: true });

    // Get the VS Code settings configuration
    const vscodeConfig = Snacks.VSCodeSettings;
    if (!vscodeConfig) {
      throw new Error('VS Code settings configuration not found');
    }

    // Use the "Any" setup since VS Code settings are framework-agnostic
    const setup = vscodeConfig.setup.find((s) => s.name === 'Any');
    if (!setup) {
      throw new Error('VS Code settings setup not found');
    }

    // Write example files to the snacks directory only
    await writeExampleFiles(setup, vscodeDir);

    p.note(`VS Code settings prepared in ${vscodeDir}`);
    p.note(`
VS Code settings have been prepared in ${vscodeDir}.
To use these settings in your project:
1. Create a .vscode directory in your project root if it doesn't exist
2. Copy the settings.json file from ${vscodeDir} to your project's .vscode directory

These settings will:
1. Format files on save
2. Run code actions on save (fix linting issues, organize imports)
3. Set up proper file associations for CSS files
4. Use the TypeScript version from node_modules
    `);
  } catch (error) {
    p.note(`Failed to prepare VS Code settings: ${error}`);
    process.exit(1);
  }
}
