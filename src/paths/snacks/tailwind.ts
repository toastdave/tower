import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { SetupOption, Snacks } from '../../everything.js';

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

    if (viteConfigExists) {
      p.note('Detected Vite project, preparing Tailwind with Vite...');
      await handleViteTailwind(packageManager, tailwindDir, commandsFilePath);
    } else {
      p.note('Preparing Tailwind with PostCSS...');
      await handlePostCssTailwind(packageManager, tailwindDir, commandsFilePath);
    }
  } catch (error) {
    p.note(`Failed to prepare Tailwind: ${error}`);
    process.exit(1);
  }
}

async function writeExampleFiles(setup: SetupOption, tailwindDir: string) {
  // Write all example files to the tailwind directory
  for (const file of setup.files) {
    const filePath = path.join(tailwindDir, path.basename(file.path));
    // Trim the content to remove extra blank lines at beginning and end
    await fs.writeFile(filePath, file.content.trim(), 'utf8');
  }

  p.note(`Tailwind CSS files prepared in ${tailwindDir}`);
}

async function handleViteTailwind(
  packageManager: string,
  tailwindDir: string,
  commandsFilePath: string
) {
  const tailwindConfig = Snacks.find((snack) => snack.name === 'Tailwind CSS');
  const viteSetup = tailwindConfig?.setup.find((setup) => setup.name === 'Vite');

  if (!tailwindConfig || !viteSetup) {
    throw new Error('Tailwind Vite configuration not found');
  }

  // Get installer commands
  const installer = viteSetup.installers.find((i) => i.packageManager === packageManager);
  if (!installer) {
    throw new Error(`No installer found for package manager: ${packageManager}`);
  }

  // Add commands to the central commands file
  await addCommandsToFile(installer.commands, commandsFilePath, 'Tailwind CSS (Vite)');

  // Write files to the tailwind directory
  await writeExampleFiles(viteSetup, tailwindDir);
}

async function handlePostCssTailwind(
  packageManager: string,
  tailwindDir: string,
  commandsFilePath: string
) {
  const tailwindConfig = Snacks.find((snack) => snack.name === 'Tailwind CSS');
  const postcssSetup = tailwindConfig?.setup.find((setup) => setup.name === 'Other');

  if (!tailwindConfig || !postcssSetup) {
    throw new Error('Tailwind PostCSS configuration not found');
  }

  // Get installer commands
  const installer = postcssSetup.installers.find((i) => i.packageManager === packageManager);
  if (!installer) {
    throw new Error(`No installer found for package manager: ${packageManager}`);
  }

  // Add commands to the central commands file
  await addCommandsToFile(installer.commands, commandsFilePath, 'Tailwind CSS (PostCSS)');

  // Write files to the tailwind directory
  await writeExampleFiles(postcssSetup, tailwindDir);
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
