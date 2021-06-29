import {
   DumpConfig,
   dumpConfigValidations,
} from './dumpConfig/dumpConfigValidations';
import { loadConfig } from './loadConfig';
import { getLoadValidatedConfig } from './loadValidatedConfig';
import {
   RestoreConfig,
   restoreConfigValidations,
} from './restoreConfig/restoreConfigValidations';

export enum Configs {
   DUMP = 'DUMP',
   RESTORE = 'RESTORE',
}

export const configFileName = 'partial-dumper';

export const getConfig = async (config: Configs) => {
   const unsanitizedConfig = await loadConfig(configFileName);
   const getConfigValidation = getLoadValidatedConfig(unsanitizedConfig);

   if (config === Configs.DUMP) {
      return getConfigValidation<DumpConfig>(dumpConfigValidations);
   }

   if (config === Configs.RESTORE) {
      return getConfigValidation<DumpConfig>(restoreConfigValidations);
   }

   console.log('Invalid given config');
   return;
};
