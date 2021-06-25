import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { dumpSanitize } from './dumpSanitize';

export const getDumpArgv = () => {
   return yargs(hideBin(process.argv))
      .command({
         command: 'partial-dump <collectionName> <id>',
         desc: 'Create a partial dump of a MongoDB database using mongoose',
      })
      .help().argv;
};

export const getDumpSanitizedArgv = () => {
   const argv = getDumpArgv();
   return dumpSanitize(argv);
};
