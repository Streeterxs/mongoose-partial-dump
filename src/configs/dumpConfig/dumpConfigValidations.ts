import { DumpConfig } from './loadDumpConfig';

type ConfigValidation<T> = {
   error: string | null;
   config: T | null;
   warning?: string;
};
export const dumpConfigValidations = (
   config?: Partial<DumpConfig>
): ConfigValidation<DumpConfig> => {
   if (!config) {
      return {
         error:
            'Configuration file is missing. Example configuration file name: |partial-dump.config.js|',
         config: null,
      };
   }

   if (!config.db) {
      return {
         error: '<db> configuration is missing',
         config: null,
      };
   }

   if (!config.db.url) {
      return {
         error: '<db.url> configuration is missing',
         config: null,
      };
   }

   if (!config.models) {
      return {
         error: '<models> configuration is missing',
         config: null,
      };
   }

   if (config.models.length < 1) {
      return {
         error: null,
         warning: '<models> config array do not have any models',
         config: {
            db: config.db,
            models: config.models,
         },
      };
   }

   return {
      error: null,
      config: {
         db: config.db,
         models: config.models,
      },
   };
};
