#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
   .command(
      'dump <collectionName> <id>',
      'Create a partial dump of a MongoDB database using mongoose'
   )
   .help().argv;
console.log('argv: ', argv);
console.log('(%d,%d)', argv.x, argv.y);
console.log(argv._);
