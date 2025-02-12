import { Command } from 'commander';
import * as p from '@clack/prompts';

export const tools = new Command()
  .name('tools')
  .description('Tools management commands')
  .action(async () => {
    console.log('Tools command executed');
  }); 