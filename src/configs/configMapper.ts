import { loadDumpConfig } from './dumpConfig/loadDumpConfig';

export enum Configs {
   DUMP = 'DUMP',
}

export const configFileName = 'partial-dumper';

export const getConfig = (config: Configs) => {
   switch (config) {
      case Configs.DUMP:
         return loadDumpConfig(configFileName);

      default:
         console.log('Invalid given config');
   }
};
