import * as p from '@clack/prompts';
import { Command } from 'commander';
import { execa } from 'execa';
import handleApi from '../paths/power/api.js';
import handleBaseProject from '../paths/power/base-project.js';
import handleCrossPlatform from '../paths/power/cross-platform.js';
import handleDesktopApp from '../paths/power/desktop.js';
import handleFunctions from '../paths/power/functions.js';
import handleMobileApp from '../paths/power/mobile.js';
import handleWebApp from '../paths/power/web.js';

type Language = {
  name: string;
  value: string;
};

type PackageManager = {
  name: string;
  value: string;
  language: string;
};

export type ProjectType = {
  name: string;
  value: string;
  description: string;
};

const languages: Language[] = [
  { name: 'JavaScript/TypeScript', value: 'JavaScript' },
  { name: 'Python', value: 'Python' },
  { name: 'Go', value: 'Go' },
  { name: 'Rust', value: 'Rust' },
  { name: 'C#', value: 'C#' },
  { name: 'Java', value: 'Java' },
];

const packageManagers: PackageManager[] = [
  // JavaScript/Node.js
  { name: 'npm - Node Package Manager', value: 'npm', language: 'JavaScript' },
  { name: 'yarn - Alternative Node Package Manager', value: 'yarn', language: 'JavaScript' },
  { name: 'pnpm - Performant Node Package Manager', value: 'pnpm', language: 'JavaScript' },
  {
    name: 'bun - All-in-one JavaScript runtime & package manager',
    value: 'bun',
    language: 'JavaScript',
  },

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
  { name: 'Gradle - Build and package manager', value: 'gradle', language: 'Java' },
];

export const projectTypes: ProjectType[] = [
  {
    name: 'Web App',
    value: 'web',
    description: 'Frontend web application with UI',
  },
  {
    name: 'API',
    value: 'api',
    description: 'Backend REST/GraphQL API service',
  },
  {
    name: 'Functions',
    value: 'functions',
    description: 'Serverless/Cloud functions',
  },
  {
    name: 'Mobile App',
    value: 'mobile',
    description: 'Native or cross-platform mobile app',
  },
  {
    name: 'Desktop App',
    value: 'desktop',
    description: 'Native desktop application',
  },
  {
    name: 'Cross Platform',
    value: 'cross-platform',
    description: 'Application that runs on multiple platforms',
  },
  {
    name: 'Base Project',
    value: 'base',
    description: 'Simple starter project with minimal setup',
  },
];

export const power = new Command()
  .name('power')
  .description('Power commands')
  .action(async () => {
    p.intro('Project Configuration');

    // Project Type Selection
    const projectType = await p.select({
      message: 'What type of project would you like to create?',
      options: projectTypes.map((type) => ({
        label: type.name,
        value: type.value,
        hint: type.description,
      })),
    });

    if (p.isCancel(projectType)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // Pick a name any name
    const projectName = await p.text({
      message: 'What is the name of your project?',
    });

    if (p.isCancel(projectName)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // Language Selection
    const language = await p.select({
      message: 'Choose a programming language:',
      options: languages.map((lang) => ({
        label: lang.name,
        value: lang.value,
      })),
    });

    if (p.isCancel(language)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // Package Manager Selection
    const filteredPackageManagers = packageManagers.filter((pm) => pm.language === language);
    const packageManager = await p.select({
      message: `Choose a package manager for ${language}:`,
      options: filteredPackageManagers.map((pm) => ({
        label: pm.name,
        value: pm.value,
      })),
    });

    if (p.isCancel(packageManager)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // 4. Handle Project Type with Language and Package Manager
    let result = null;
    switch (projectType as string) {
      case 'web':
        result = await handleWebApp(
          language as string,
          packageManager as string,
          projectName as string
        );
        if (typeof result === 'object' && 'framework' in result) {
          p.note(
            `Selected framework: ${result.framework}\n` +
              `Selected companion: ${result.companion}\n` +
              `Language: ${language}\n` +
              `Package Manager: ${packageManager}`
          );
        }
        break;
      case 'api':
        result = await handleApi(language as string, packageManager as string);
        break;
      case 'functions':
        result = await handleFunctions(language as string, packageManager as string);
        break;
      case 'mobile':
        result = await handleMobileApp(language as string, packageManager as string);
        break;
      case 'desktop':
        result = await handleDesktopApp(language as string, packageManager as string);
        break;
      case 'cross-platform':
        result = await handleCrossPlatform(language as string, packageManager as string);
        break;
      case 'base':
        result = await handleBaseProject(language as string, packageManager as string);
        break;
    }

    // Initialize git repository and set main branch
    p.note('Initializing git repository...');
    await execa('git', ['init'], {
      cwd: projectName,
      stdio: 'inherit',
    });
    await execa('git', ['branch', '-M', 'main'], {
      cwd: projectName,
      stdio: 'inherit',
    });

    p.outro('Project configuration completed!');
  });
