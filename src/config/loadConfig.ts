import { cosmiconfig } from 'cosmiconfig';
import TypeScriptLoader from '@endemolshinegroup/cosmiconfig-typescript-loader';

export const loadConfig = async (configName: string) => {
   const explr = cosmiconfig(configName, {
      searchPlaces: [`${configName}.config.ts`, `${configName}.config.js`],
      loaders: {
         '.ts': TypeScriptLoader,
      },
   });

   try {
      const result = await explr.search();
      if (!result) {
         return;
      }
      const { config } = result;
      return config;
   } catch (err) {
      console.log('err: ', err);
   }
};
