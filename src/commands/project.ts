import { Command } from 'commander';
import * as p from '@clack/prompts';
import { selectProjectType } from '../paths/project/index.js';

type Language = {
  name: string;
  value: string;
};

type PackageManager = {
  name: string;
  value: string;
  language: string;
};


const languages: Language[] = [
  { name: 'JavaScript/TypeScript', value: 'JavaScript' },
  { name: 'Python', value: 'Python' },
  { name: 'Go', value: 'Go' },
  { name: 'Rust', value: 'Rust' },
  { name: 'C#', value: 'C#' },
  { name: 'Java', value: 'Java' }
];

const packageManagers: PackageManager[] = [
  // JavaScript/Node.js
  { name: 'npm - Node Package Manager', value: 'npm', language: 'JavaScript' },
  { name: 'yarn - Alternative Node Package Manager', value: 'yarn', language: 'JavaScript' },
  { name: 'pnpm - Performant Node Package Manager', value: 'pnpm', language: 'JavaScript' },
  { name: 'bun - All-in-one JavaScript runtime & package manager', value: 'bun', language: 'JavaScript' },

  // Python
  { name: 'pip - Python Package Installer', value: 'pip', language: 'Python' },
  { name: 'poetry - Python dependency management', value: 'poetry', language: 'Python' },
  { name: 'conda - Python package and environment management', value: 'conda', language: 'Python' },

  // Go
  { name: 'go mod - Official Go package manager', value: 'go', language: 'Go' },

  // Rust
  { name: 'cargo - Official Rust package manager', value: 'cargo', language: 'Rust' },

  // C#/.NET
  { name: 'NuGet - .NET package manager', value: 'nuget', language: 'C#' },

  // Java
  { name: 'Maven - Java build and package manager', value: 'maven', language: 'Java' },
  { name: 'Gradle - Build and package manager', value: 'gradle', language: 'Java' }
];



export const project = new Command()
  .name('project')
  .description('Project management commands')
  .action(async () => {
    p.intro('Project Configuration');

    const language = await p.select({
      message: 'Choose a programming language:',
      options: languages.map(lang => ({
        label: lang.name,
        value: lang.value
      }))
    });

    if (p.isCancel(language)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    const filteredPackageManagers = packageManagers.filter(pm => pm.language === language);

    const packageManager = await p.select({
      message: `Choose a package manager for ${language}:`,
      options: filteredPackageManagers.map(pm => ({
        label: pm.name,
        value: pm.value
      }))
    });

    if (p.isCancel(packageManager)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    const projectType = await selectProjectType();

    p.note(
      `Selected language: ${language}\n` +
      `Selected package manager: ${packageManager}\n` +
      `Project type: ${projectType.toString()}`
    );
    
    // We'll add more project configuration steps here later
    
    p.outro('Project configuration completed!');
  }); 