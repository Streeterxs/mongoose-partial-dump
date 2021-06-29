import { Model } from 'mongoose';

import { ConfigValidation } from './basicValidations';

export type ValidationFunction<T> = (config: any) => ConfigValidation<T>;
type getLoadValidatedConfigOutput = <T>(
   configValidations: ValidationFunction<T>
) => Nullable<T> | undefined;

export const getLoadValidatedConfig = (
   unsanitizedConfig: any
): getLoadValidatedConfigOutput => {
   const loadValidatedConfig = <T>(
      configValidations: ValidationFunction<T>
   ) => {
      const { errors, config, warnings } = configValidations(unsanitizedConfig);

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

   return loadValidatedConfig;
};
