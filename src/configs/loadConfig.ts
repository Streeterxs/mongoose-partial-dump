import { cosmiconfig } from 'cosmiconfig';
import TypeScriptLoader from '@endemolshinegroup/cosmiconfig-typescript-loader';

export const loadConfig = async (
   configFileName: string
): Promise<any | void> => {
   const explr = cosmiconfig(configFileName, {
      searchPlaces: [
         `${configFileName}.config.ts`,
         `${configFileName}.config.js`,
      ],
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
