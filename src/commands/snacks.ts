import { Command } from 'commander';

export const snacks = new Command()
  .name('snacks')
  .description('Snacks management commands')
  .action(async () => {
    console.log('Snacks command executed');
  });
