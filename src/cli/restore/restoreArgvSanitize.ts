import { CliRestore } from '../cliTypes';

import { restoreCliValidations } from './restoreCliValidations';

export const restoreArgvSanitize = (
   argvInput: any
): Nullable<CliRestore> | void => {
   const { errors, warnings, argv } = restoreCliValidations(argvInput);

   if (warnings.length > 0) {
      warnings.forEach((warning) => console.log(warning));
   }

   if (errors.length > 0) {
      errors.forEach((error) => console.log(error));
      return;
   }

   if (!argv) {
      return;
   }

   return argv;
};
