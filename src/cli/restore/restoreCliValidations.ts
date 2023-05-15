import { RestoreConfig } from '../../configs/restoreConfig/restoreConfigValidations';
import { CliRestore } from '../cliTypes';

export type CliValidation<T> = {
  errors: (string | null)[];
  argv: Nullable<T> | null;
  warnings: (string | null)[];
};

export const restoreCliValidations = (
  argv: CliRestore
): CliValidation<CliRestore> => {
  const inputDirValidatedObj = inputDirCliValidate(argv.inputDir);

  const errors = [inputDirValidatedObj.error];

  const warnings = [inputDirValidatedObj.warning];

  const nonNullErrors = errors.filter((error) => error !== null);
  const nonNullWarnings = warnings.filter((error) => error !== null);
  return {
    errors: nonNullErrors,
    warnings: nonNullWarnings,
    argv: {
      inputDir: inputDirValidatedObj.inputDir,
    },
  };
};

const inputDirCliValidate = (inputDir: string | undefined) => {
  if (!inputDir) {
    return {
      error: null,
      warning:
        'warning: <inputDir> argv was not defined. You must input a <inputDir> on CONFIG for the dump work.',
      db: null,
    };
  }

  if (!(typeof inputDir === 'string')) {
    return {
      error: null,
      warning:
        'warning: <inputDir> argv is defined, but not a function. This will cause a error if no <inputDir> input was given on CONFIG.',
      inputDir: null,
    };
  }

  return {
    error: null,
    warning: null,
    inputDir,
  };
};

export const validateRestoreCliConfig = (
  argv: void | Nullable<CliRestore>,
  config: void | Nullable<RestoreConfig> | undefined
) => {
  if (!argv) {
    console.log('error: Invalid given CLI arguments');
    return;
  }

  if (!config) {
    console.log('error: Invalid given CONFIG arguments');
    return;
  }

  if (!argv.inputDir) {
    if (!config.inputDir) {
      console.log(
        'error: At least a CONFIG <inputDir> or a CLI <inputDir> must me given'
      );
      return;
    }
  }

  const inputDir = argv.inputDir ?? config.inputDir;

  return {
    models: config.models,
    db: config.db,
    defaultValues: config.defaultValues,
    defaultSingValues: config.defaultSingValues,
    inputDir,
  };
};
