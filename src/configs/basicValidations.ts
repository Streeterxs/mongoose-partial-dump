import { Model } from 'mongoose';
import { DatabaseConfig } from '../database/database';

export type ConfigValidation<T> = {
   errors: (string | null)[];
   config: Nullable<T> | null;
   warnings: (string | null)[];
};

export const dbConfigValidate = (db: DatabaseConfig | undefined) => {
   if (!db) {
      return {
         error: 'error: <db> configuration is missing',
         warning: null,
         db: null,
      };
   }

   if (!db.url) {
      return {
         error: 'error: <db.url> configuration is missing',
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

export const modelsConfigValidate = (models: Model<any>[] | undefined) => {
   if (!models) {
      return {
         error: 'error: <models> configuration is missing',
         warning: null,
         models: null,
      };
   }

   if (models.length < 1) {
      return {
         error: null,
         warning: 'warning: <models> config array do not have any models',
         models,
      };
   }

   return {
      error: null,
      warning: null,
      models,
   };
};
