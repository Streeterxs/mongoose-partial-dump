import { Model } from 'mongoose';

import { loadConfig } from '../loadConfig';
import { DatabaseConfig } from '../../database/database';
import { dumpConfigValidations } from './dumpConfigValidations';

export type DumpConfig = {
   db: DatabaseConfig;
   models: Model<any>[];
};

export const loadDumpConfig = async (
   configFileName: string
): Promise<DumpConfig | void> => {
   const unsanitizedConfig: Partial<DumpConfig> = await loadConfig(
      configFileName
   );
   const { error, config, warning } = dumpConfigValidations(unsanitizedConfig);

   if (!config) {
      if (error) {
         console.log(error);
         return;
      }

      console.log(`config is invalid`);
      return;
   }

   if (warning) {
      console.log(`warning: ${warning}`);
   }

   return config;
};
