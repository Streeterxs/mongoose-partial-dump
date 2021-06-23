import { loadDumpConfig } from './dumpConfig/loadDumpConfig';

export enum Configs {
   DUMP = 'DUMP',
}

export const configMapper = (config: Configs) => {
   switch (config) {
      case Configs.DUMP:
         return loadDumpConfig;

      default:
         console.log('Invalid given config');
   }
};
