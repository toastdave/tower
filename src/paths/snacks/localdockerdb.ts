import * as p from '@clack/prompts';
import * as fs from 'fs/promises';
import path from 'path';
import { addCommandsToFile } from '../../commands/snacks.js';
import { Snacks } from '../../everything.js';

export default async function handleLocalDockerDB(
  packageManager: string,
  snacksDir: string,
  commandsFilePath: string
) {
  try {
    const dbDir = path.join(snacksDir, 'localdockerdb');
    await fs.mkdir(dbDir, { recursive: true });

    // Get the LocalDockerDB configuration
    const dbConfig = Snacks.LocalDockerDB;
    if (!dbConfig) {
      throw new Error('LocalDockerDB configuration not found');
    }

    // Ask the user which database they want to set up
    const dbOptions = dbConfig.setup.map((setup) => ({
      value: setup.name,
      label: setup.name,
    }));

    const selectedDB = await p.select({
      message: 'Which database would you like to set up?',
      options: dbOptions,
    });

    if (p.isCancel(selectedDB)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // Find the selected setup
    const selectedSetup = dbConfig.setup.find((setup) => setup.name === selectedDB);
    if (!selectedSetup) {
      throw new Error(`Setup for ${selectedDB} not found`);
    }

    // Create a database-specific directory
    const specificDbDir = path.join(dbDir, (selectedDB as string).toLowerCase());
    await fs.mkdir(specificDbDir, { recursive: true });

    // Get installer commands if available
    if (selectedSetup.installers && selectedSetup.installers.length > 0) {
      // Find Docker installer (since these are Docker databases)
      const installer = selectedSetup.installers.find((i) => i.tool === 'Docker');
      if (installer) {
        await addCommandsToFile(
          installer.commands,
          commandsFilePath,
          `LocalDockerDB (${selectedDB})`
        );
      }
    }

    // Write example files to the database-specific directory
    if (selectedSetup.files) {
      for (const file of selectedSetup.files) {
        const filePath = path.join(specificDbDir, file.path);

        // Write file content
        if (file.content) {
          await fs.writeFile(filePath, file.content.trim(), 'utf8');
        } else {
          // For files without content (like SQLite's local.db), create an empty file
          await fs.writeFile(filePath, '', 'utf8');
        }
      }
    }

    p.note(`Local ${selectedDB} database files prepared in ${specificDbDir}`);

    // Additional instructions based on the selected database
    switch (selectedDB) {
      case 'PostgreSQL':
      case 'MySQL':
        p.note(`
To start your ${selectedDB} database:
1. Navigate to the ${specificDbDir} directory
2. Run 'docker-compose up -d'
3. Connect to your database using:
   - Host: localhost
   - Port: ${selectedDB === 'PostgreSQL' ? '5432' : '3306'}
   - Username: ${selectedDB === 'PostgreSQL' ? 'postgres' : 'root'}
   - Password: ${selectedDB === 'PostgreSQL' ? 'postgres' : 'root'}
   - Database: localdb
        `);
        break;
      case 'SQLite':
        p.note(`
Your SQLite database file has been created at ${path.join(specificDbDir, 'local.db')}
You can connect to it directly using any SQLite client.
        `);
        break;
    }
  } catch (error) {
    p.note(`Failed to prepare LocalDockerDB: ${error}`);
    process.exit(1);
  }
}
