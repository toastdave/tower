import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { SetupOption, Snacks } from '../../everything.js';

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
      await handleVite(packageManager, shadCNDir, commandsFilePath);
    } else {
      p.note('ShadCN currently only supports Vite projects');
      process.exit(1);
    }
  } catch (error) {
    p.note(`Failed to prepare ShadCN: ${error}`);
    process.exit(1);
  }
}

async function writeExampleFiles(setup: SetupOption, shadcnDir: string) {
  // Write all example files to the shadcn directory
  for (const file of setup.files) {
    const filePath = path.join(shadcnDir, path.basename(file.path));
    // Trim the content to remove extra blank lines at beginning and end
    await fs.writeFile(filePath, file.content.trim(), 'utf8');
  }

  p.note(`ShadCN UI files prepared in ${shadcnDir}`);
}

async function handleVite(packageManager: string, shadcnDir: string, commandsFilePath: string) {
  const shadcnConfig = Snacks.find((snack) => snack.name === 'Shadcn UI');
  const viteSetup = shadcnConfig?.setup.find((setup) => setup.name === 'Vite');

  if (!shadcnConfig || !viteSetup) {
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
  await writeExampleFiles(viteSetup, shadcnDir);
}

// Helper function to add commands to the central commands file
async function addCommandsToFile(commands: string[], commandsFilePath: string, snackName: string) {
  if (commands.length === 0) return;

  // Read existing content
  let existingContent = '';
  try {
    existingContent = await fs.readFile(commandsFilePath, 'utf8');
  } catch (error) {
    // File might not exist yet, that's okay
  }

  // Check if this snack's commands are already in the file
  if (existingContent.includes(`# ${snackName}`)) {
    // This snack's commands are already in the file, no need to add them again
    return;
  }

  // Add a comment with the snack name before the commands
  // Make sure we have a double newline before each section (except the first one)
  const prefix = existingContent.trim().length > 0 ? '\n\n' : '';
  const snackComment = `${prefix}# ${snackName}\n`;
  const commandsWithComment = snackComment + commands.join('\n') + '\n';

  // Append to the file
  const newContent = existingContent.trim() + commandsWithComment;

  // Write back to the central commands file
  await fs.writeFile(commandsFilePath, newContent, 'utf8');
}
