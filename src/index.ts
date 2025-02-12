#!/usr/bin/env node

import { Command } from 'commander';
import { project } from './commands/project.js';
import { tools } from './commands/tools.js';
import { towerAscii } from './utils/ascii-art.js';

const program = new Command();

// Display the ASCII art
console.log(towerAscii);

program
  .name('tower')
  .description('Scaffold Anything: Script to Startup')
  .version('1.0.0');

program
  .addCommand(project)
  .addCommand(tools);

program.parse(); 