import { Types } from 'mongoose';
import { getValidatedDumpId, getValidatedDumpLog } from './dumpValidations';

type CliDump = {
   id: Types.ObjectId;
   collectionName: string;
   log?: boolean;
};

export const dumpSanitize = (argv): CliDump | void => {
   const collectionName = argv.collectionName;
   const id = getValidatedDumpId(argv.id);

   if (!id) {
      console.log('Invalid given <id>. Must be a valid MongoDB ObjectId');
      return;
   }

   const log = getValidatedDumpLog(argv.log);
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
