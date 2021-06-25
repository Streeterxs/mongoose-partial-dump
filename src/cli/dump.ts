#!/usr/bin/env node
import mongoose from 'mongoose';

import { connectToDb } from '../database/database';
import { dumper } from '../dumper/dumper';
import { modelToSchema } from '../database/modelToSchema';

import { getConfig, Configs } from '../configs/configMapper';
import { getDumpSanitizedArgv } from './dumpCli';

(async () => {
   try {
      const config = await getConfig(Configs.DUMP);
      if (!config) {
         return;
      }

      const { models } = config;
      for (const model of models) {
         const modelName = model.collection.name;
         const schema = modelToSchema(model);
         const collection = schema.get('collection');

         mongoose.model(modelName, schema, collection);
      }
      await connectToDb(config.db);

      const sanitizedArgv = getDumpSanitizedArgv();
      console.log({ sanitizedArgv });
      if (!sanitizedArgv) {
         return;
      }
      await dumper({
         collectionName: sanitizedArgv.collectionName,
         collectionObjectId: sanitizedArgv.id,
      });
   } catch (err) {
      console.log('err: ', err);
   }

   process.exit();
})();
