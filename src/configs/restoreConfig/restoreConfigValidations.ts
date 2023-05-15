import { Model } from 'mongoose';
import { DatabaseConfig } from '../../database/database';
import {
  ConfigValidation,
  dbConfigValidate,
  modelsConfigValidate,
} from '../basicValidations';

export type RestoreConfig = {
  db: DatabaseConfig;
  models: Model<any>[];
  inputDir?: string;
  defaultValues?: any;
  defaultSingValues?: any;
};

export const restoreConfigValidations = (
  config?: Partial<RestoreConfig>
): ConfigValidation<RestoreConfig> => {
  if (!config) {
    return {
      errors: [
        'error: Configuration file is missing. Example configuration file name: |partial-dump.config.js|',
      ],
      warnings: [null],
      config: null,
    };
  }

  const dbValidatedObj = dbConfigValidate(config.db);
  const modelsValidatedObj = modelsConfigValidate(config.models);
  const inputDirValidatedObj = inputDirConfigValidate(config.inputDir);

  const errors = [
    dbValidatedObj.error,
    modelsValidatedObj.error,
    inputDirValidatedObj.error,
  ];

  const warnings = [
    dbValidatedObj.warning,
    modelsValidatedObj.warning,
    inputDirValidatedObj.warning,
  ];

  const nonNullErrors = errors.filter((error) => error !== null);
  const nonNullWarnings = warnings.filter((error) => error !== null);
  return {
    errors: nonNullErrors,
    warnings: nonNullWarnings,
    config: {
      db: dbValidatedObj.db,
      models: modelsValidatedObj.models,
      inputDir: inputDirValidatedObj.inputDir,
      defaultValues: config.defaultValues,
      defaultSingValues: config.defaultSingValues,
    },
  };
};

const inputDirConfigValidate = (inputDir: string | undefined) => {
  if (!inputDir) {
    return {
      error: null,
      warning:
        'warning: <inputDir> was not defined on [CONFIG]. You must input a <inputDir> on CLI for the dump work.',
      db: null,
    };
  }

  if (!(typeof inputDir === 'string')) {
    return {
      error: null,
      warning:
        'warning: <inputDir> config is defined, but not a function on [CONFIG]. This will cause a error if no <inputDir> input was given on CLI.',
      inputDir: null,
    };
  }

  return {
    error: null,
    warning: null,
    inputDir,
  };
};
