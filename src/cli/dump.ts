#!/usr/bin/env node
import yargs from 'yargs';

import { hideBin } from 'yargs/helpers';
import { loadConfig } from '../config/loadConfig';
import { connectToDb } from '../database/database';
import { dumper } from '../dumper/dumper';
import { modelToSchema } from '../database/modelToSchema';

import mongoose from 'mongoose';

const argv = yargs(hideBin(process.argv))
   .command(
      'dump <collectionName> <id>',
      'Create a partial dump of a MongoDB database using mongoose'
   )
   .help().argv;

(async () => {
   try {
      const configName = 'partial-dumper';
      const config = await loadConfig(configName);

      const { models } = config;
      for (const model of models) {
         const modelName = model.collection.name;
         const schema = modelToSchema(model);
         const collection = schema.get('collection');

         mongoose.model(modelName, schema, collection);
      }
      await connectToDb(config.db);

      await dumper({
         collectionName: argv.collectionName,
         collectionObjectId: argv.id,
      });
   } catch (err) {
      console.log('err: ', err);
   }

   process.exit();
})();
