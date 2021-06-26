import { Model } from 'mongoose';

import { loadConfig } from '../loadConfig';
import { DatabaseConfig } from '../../database/database';
import { dumpConfigValidations } from './dumpConfigValidations';
import { getPayloadType } from '../../dumper/dumperUtils';

export type DumpConfig = {
   db: DatabaseConfig;
   models: Model<any>[];
   getPayload?: getPayloadType;
   outputDir?: string;
};

export const loadDumpConfig = async (
   configFileName: string
): Promise<Nullable<DumpConfig> | void> => {
   const unsanitizedConfig: Partial<DumpConfig> = await loadConfig(
      configFileName
   );
   const { errors, config, warnings } = dumpConfigValidations(
      unsanitizedConfig
   );

   if (warnings.length > 0) {
      warnings.forEach((warning) => console.log(warning));
   }

   if (errors.length > 0) {
      errors.forEach((error) => console.log(error));
      return;
   }
   if (!config) {
      console.log(`config is invalid`);
      return;
   }

   return config;
};
