import { CliDump } from './cliTypes';
import {
   getValidatedDumpId,
   getValidatedDumpLog,
   getValidatedDumpOutputDir,
} from './dumpValidations';

export const dumpSanitize = (argv: any): CliDump | void => {
   const collectionName = argv.collectionName;
   const id = getValidatedDumpId(argv.id);
   const log = getValidatedDumpLog(argv.log);
   const outputDir = getValidatedDumpOutputDir(argv.outputDir);

   const dumpSanitizedObj = {
      collectionName,
      id,
      log,
      outputDir,
   };

   if (!id) {
      console.log('Invalid given <id>. Must be a valid MongoDB ObjectId');
   }

   return dumpSanitizedObj;
};
