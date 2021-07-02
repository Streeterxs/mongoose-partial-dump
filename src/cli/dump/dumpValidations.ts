import { Types } from 'mongoose';

import { DumpConfig } from '../../configs/dumpConfig/dumpConfigValidations';
import { CliDump } from '../cliTypes';

export const getValidatedDumpId = (id: string) => {
   if (!Types.ObjectId.isValid(id)) {
      return;
   }

   return new Types.ObjectId(id);
};

export const getValidatedDumpLog = (log?: boolean) => {
   if (!(typeof log === 'boolean')) {
      return;
   }

   return log;
};

export const getValidatedDumpOutputDir = (outputDir?: string) => {
   if (!(typeof outputDir === 'string')) {
      return;
   }

   return outputDir;
};

export const validateDumpCliConfig = (
   argv: void | CliDump,
   config: void | Nullable<DumpConfig> | undefined
) => {
   if (!argv) {
      console.log('error: Invalid given CLI arguments');
      return;
   }

   if (!config) {
      console.log('error: Invalid given CONFIG arguments');
      return;
   }

   if (!argv.id) {
      if (!config.getPayload) {
         console.log(
            'error: At least a CONFIG <getPayload> or a CLI <id> must me given'
         );
         return;
      }
   }

   if (!argv.outputDir) {
      if (!config.outputDir) {
         console.log(
            'error: At least a CONFIG <outputDir> or a CLI <outputDir> must me given'
         );
         return;
      }
   }

   const outputDir = argv.outputDir ?? config.outputDir;

   return {
      getPayload: config.getPayload,
      models: config.models,
      db: config.db,
      collectionName: argv.collectionName,
      id: argv.id,
      log: argv.log,
      outputDir,
   };
};
