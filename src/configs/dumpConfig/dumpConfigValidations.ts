import { Model } from 'mongoose';
import { DatabaseConfig } from '../../database/database';
import { getPayloadType } from '../../dumper/dumperUtils';
import { DumpConfig } from './loadDumpConfig';

type ConfigValidation<T> = {
   errors: (string | null)[];
   config: Nullable<T> | null;
   warnings: (string | null)[];
};
export const dumpConfigValidations = (
   config?: Partial<DumpConfig>
): ConfigValidation<DumpConfig> => {
   if (!config) {
      return {
         errors: [
            'Configuration file is missing. Example configuration file name: |partial-dump.config.js|',
         ],
         warnings: [null],
         config: null,
      };
   }

   const dbValidatedObj = dbConfigValidate(config.db);
   const modelsValidatedObj = modelsConfigValidate(config.models);
   const getPayloadValidatedObj = getPayloadConfigValidate(config.getPayload);
   const outputDirValidatedObj = outputDirConfigValidate(config.outputDir);

   const errors = [
      dbValidatedObj.error,
      modelsValidatedObj.error,
      getPayloadValidatedObj.error,
      outputDirValidatedObj.error,
   ];

   const warnings = [
      dbValidatedObj.warning,
      modelsValidatedObj.warning,
      getPayloadValidatedObj.warning,
      outputDirValidatedObj.warning,
   ];

   const nonNullErrors = errors.filter((error) => error !== null);
   const nonNullWarnings = warnings.filter((error) => error !== null);
   return {
      errors: nonNullErrors,
      warnings: nonNullWarnings,
      config: {
         db: dbValidatedObj.db,
         models: modelsValidatedObj.models,
         getPayload: getPayloadValidatedObj.getPayload,
         outputDir: outputDirValidatedObj.outputDir,
      },
   };
};

const dbConfigValidate = (db: DatabaseConfig | undefined) => {
   if (!db) {
      return {
         error: '<db> configuration is missing',
         warning: null,
         db: null,
      };
   }

   if (!db.url) {
      return {
         error: '<db.url> configuration is missing',
         warning: null,
         db: null,
      };
   }

   return {
      error: null,
      warning: null,
      db,
   };
};

const modelsConfigValidate = (models: Model<any>[] | undefined) => {
   if (!models) {
      return {
         error: '<models> configuration is missing',
         warning: null,
         models: null,
      };
   }

   if (models.length < 1) {
      return {
         error: null,
         warning: '<models> config array do not have any models',
         models,
      };
   }

   return {
      error: null,
      warning: null,
      models,
   };
};

const getPayloadConfigValidate = (getPayload: getPayloadType | undefined) => {
   if (!getPayload) {
      return {
         error: null,
         warning:
            '<getPayload> config was not defined. You must input a <id> on CLI for the dump work.',
         db: null,
      };
   }

   if (!(typeof getPayload === 'function')) {
      return {
         error: null,
         warning:
            '<getPayload> config if defined, but not a function. This will cause a error if no <id> input was given on CLI.',
         getPayload: null,
      };
   }

   return {
      error: null,
      warning: null,
      getPayload,
   };
};

const outputDirConfigValidate = (outputDir: string | undefined) => {
   if (!outputDir) {
      return {
         error: null,
         warning:
            '<outputDir> config was not defined. You must input a <outputDir> on CLI for the dump work.',
         db: null,
      };
   }

   if (!(typeof outputDir === 'string')) {
      return {
         error: null,
         warning:
            '<outputDir> config if defined, but not a function. This will cause a error if no <outputDir> input was given on CLI.',
         outputDir: null,
      };
   }

   return {
      error: null,
      warning: null,
      outputDir,
   };
};
