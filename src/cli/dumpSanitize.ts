import { CliDump } from './cliTypes';
import { getValidatedDumpId, getValidatedDumpLog } from './dumpValidations';

export const dumpSanitize = (argv): CliDump | void => {
   const collectionName = argv.collectionName;
   const id = getValidatedDumpId(argv.id);
   const log = getValidatedDumpLog(argv.log);

   if (!id) {
      console.log('Invalid given <id>. Must be a valid MongoDB ObjectId');
      if (!log) {
         return {
            collectionName,
         };
      }

      return {
         collectionName,
         log,
      };
   }

   if (!log) {
      return {
         id,
         collectionName,
      };
   }

   return {
      id,
      collectionName,
      log,
   };
};
