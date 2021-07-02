#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { runDump } from './dump/dump';
import { restoreCli } from './restore/restore';

export const runCli = () => {
   return yargs(hideBin(process.argv))
      .command({
         command: 'dump <collectionName> [id] [outputDir]',
         desc: 'Create a partial dump of a MongoDB database using mongoose',
         handler: async (argv) => {
            await runDump(argv);
            console.log(`setting ${argv.key} to ${argv.value}`);
            return null;
         },
      })
      .command({
         command: 'restore <inputDir>',
         desc: 'Reimport a dump file',
         handler: async (argv) => {
            console.log({ argv });
            console.log(`setting ${argv.key} to ${argv.value}`);
            await restoreCli(argv);
         },
      })
      .help().argv;
};

(async () => {
   try {
      await runCli();
   } catch (err) {
      console.log('err: ', err);
   }

   process.exit();
})();
