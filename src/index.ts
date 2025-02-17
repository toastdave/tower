#!/usr/bin/env node

import { Command } from 'commander';
import { power } from './commands/power.js';
import { snacks } from './commands/snacks.js';
import { towerAscii } from './utils/ascii-art.js';

const program = new Command();

// Display the ASCII art
console.log(towerAscii);

program.name('tower').description('Scaffold Anything: Script to Startup').version('0.0.1');

program.addCommand(power).addCommand(snacks);

program.parse();
