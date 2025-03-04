import * as p from '@clack/prompts';
import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SetupOption, Snacks } from '../everything.js';
import handleShadCN from '../paths/snacks/shadcn.js';
import handleTailwind from '../paths/snacks/tailwind.js';
// Import other handlers as needed

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
    const { packageManager } = detected;

    if (!packageManager) {
      p.cancel('No package manager detected');
      process.exit(0);
    }

    const selectedSnacks = await p.multiselect({
      message: 'Select snacks to add to your project:',
      options: Object.keys(Snacks).map((key) => ({
        label: Snacks[key].name,
        value: Snacks[key].name,
        hint: Snacks[key].description,
      })),
    });

    if (p.isCancel(selectedSnacks)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // Create snacks directory if it doesn't exist
    const snacksDir = path.join(process.cwd(), 'snacks');
    await fs.mkdir(snacksDir, { recursive: true });

    // Create a central commands.txt file
    const commandsFilePath = path.join(snacksDir, 'commands.txt');
    // Initialize with empty content or create if doesn't exist
    await fs.writeFile(commandsFilePath, '', 'utf8');

    // Process each selected snack
    for (const snackName of selectedSnacks as string[]) {
      try {
        // Use a handler registry to map snack names to their handlers
        const handlerRegistry: {
          [key: string]: (
            packageManager: string,
            snacksDir: string,
            commandsFilePath: string
          ) => Promise<void>;
        } = {
          'Tailwind CSS': handleTailwind,
          'Shadcn UI': handleShadCN,
          // Add other handlers here
        };

        const handler = handlerRegistry[snackName];

        if (handler) {
          // Use the specialized handler
          await handler(packageManager, snacksDir, commandsFilePath);
        } else {
          // Fallback to generic handling for simple snacks
          await handleGenericSnack(snackName, packageManager, snacksDir, commandsFilePath);
        }

        p.note(`✓ Successfully prepared ${snackName}`);
      } catch (error) {
        p.note(`Failed to prepare ${snackName}: ${error}`);
      }
    }

    p.note(`All required commands have been listed in ${commandsFilePath}`);
    p.outro('All selected snacks have been prepared in the snacks directory!');
  });

// Generic handler for simple snacks that don't need complex setup logic
async function handleGenericSnack(
  snackName: string,
  packageManager: string,
  snacksDir: string,
  commandsFilePath: string
) {
  const snackConfig = Object.values(Snacks).find((snack) => snack.name === snackName);

  if (!snackConfig) {
    throw new Error(`Snack configuration not found for: ${snackName}`);
  }

  // Create directory for this snack
  const snackDir = path.join(snacksDir, snackName.toLowerCase().replace(/\s+/g, '-'));
  await fs.mkdir(snackDir, { recursive: true });

  // Use the first available setup (for simple snacks)
  const setupToUse = snackConfig.setup[0];

  if (!setupToUse) {
    throw new Error(`No setup found for ${snackName}`);
  }

  // Get installer for the current package manager
  const installer = setupToUse.installers.find((i) => i.packageManager === packageManager);
  if (!installer) {
    throw new Error(`No installer found for package manager: ${packageManager}`);
  }

  // Add commands to the central commands file
  await addCommandsToFile(installer.commands, commandsFilePath, snackName);

  // Write example files
  await writeExampleFiles(setupToUse, snackDir);
}

// Export these helper functions so they can be used by individual handlers
export async function addCommandsToFile(
  commands: string[],
  commandsFilePath: string,
  snackName: string
) {
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

  // Format the new content to add
  let newContent;
  if (existingContent.trim().length === 0) {
    // First entry - no leading newlines
    newContent = `# ${snackName}\n${commands.join('\n')}`;
  } else {
    // Subsequent entries - add exactly one blank line before
    newContent = `${existingContent.trim()}\n\n# ${snackName}\n${commands.join('\n')}`;
  }

  // Write back to the central commands file
  await fs.writeFile(commandsFilePath, newContent, 'utf8');
}

export async function writeExampleFiles(setup: SetupOption, snackDir: string) {
  // Write all example files to the snack directory
  for (const file of setup.files) {
    const filePath = path.join(snackDir, path.basename(file.path));
    // Trim the content to remove extra blank lines at beginning and end
    await fs.writeFile(filePath, file.content.trim(), 'utf8');
  }
}
