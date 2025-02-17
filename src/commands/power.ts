import * as p from '@clack/prompts';
import { Command } from 'commander';
import { execa } from 'execa';
import { Everything } from '../everything.js';
import handleApi from '../paths/power/api.js';
import handleBaseProject from '../paths/power/base-project.js';
import handleCrossPlatform from '../paths/power/cross-platform.js';
import handleDesktopApp from '../paths/power/desktop.js';
import handleFunctions from '../paths/power/functions.js';
import handleMobileApp from '../paths/power/mobile.js';
import handleWebApp from '../paths/power/web.js';

export type ProjectType = {
  name: string;
  value: string;
  description: string;
};

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

    const languages = Object.keys(Everything).map((key) => ({
      label: key,
      value: key,
      hint: Everything[key].description,
    }));

    // Then use this array for your select prompt
    const language = await p.select({
      message: 'Choose a programming language:',
      options: languages,
    });

    if (p.isCancel(language)) {
      p.cancel('Operation cancelled');
      process.exit(0);
    }

    // After language selection
    const packageManagers = Everything[language as string].packageManagers.map((pm: string) => ({
      label: pm,
      value: pm,
      hint: `Use ${pm} package manager`,
    }));

    const packageManager = await p.select({
      message: `Choose a package manager for ${language}:`,
      options: packageManagers,
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
