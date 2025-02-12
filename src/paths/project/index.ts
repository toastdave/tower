import * as p from '@clack/prompts';
import handleApi from './api.js';
import handleBaseProject from './base-project.js';
import handleCrossPlatform from './cross-platform.js';
import handleDesktopApp from './desktop.js';
import handleFunctions from './functions.js';
import handleMobileApp from './mobile.js';
import handleWebApp from './web.js';

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

export async function selectProjectType(): Promise<string | symbol> {
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

  switch (projectType as string) {
    case 'web':
      await handleWebApp();
      break;
    case 'api':
      await handleApi();
      break;
    case 'functions':
      await handleFunctions();
      break;
    case 'mobile':
      await handleMobileApp();
      break;
    case 'desktop':
      await handleDesktopApp();
      break;
    case 'cross-platform':
      await handleCrossPlatform();
      break;
    case 'base':
      await handleBaseProject();
      break;
  }

  return projectType as string;
}
