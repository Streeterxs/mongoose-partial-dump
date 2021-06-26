#!/usr/bin/env node
import fs from 'fs';
import mongoose, { Types } from 'mongoose';

import { connectToDb } from '../database/database';
import { dumper } from '../dumper/dumper';
import { modelToSchema } from '../database/modelToSchema';

import { getConfig, Configs } from '../configs/configMapper';
import { getDumpSanitizedArgv } from './dumpCli';
import { validateDumpCliConfig } from './dumpValidations';
import { getPayloadType } from '../dumper/dumperUtils';

type getDumpInput = {
   collectionName: string;
   collectionObjectId?: Types.ObjectId;
   getPayload?: getPayloadType;
};
const getDump = ({
   collectionName,
   collectionObjectId,
   getPayload,
}: getDumpInput) => {
   if (!getPayload) {
      if (!collectionObjectId) {
         return;
      }

      return dumper({
         collectionName,
         collectionObjectId,
      });
   }

   return dumper({
      collectionName,
      getPayload,
   });
};

(async () => {
   try {
      const unvalidatedConfig = await getConfig(Configs.DUMP);
      const unvalidatedArgv = getDumpSanitizedArgv();
      const validatedDumpObj = validateDumpCliConfig(
         unvalidatedArgv,
         unvalidatedConfig
      );
      if (!validatedDumpObj) {
         return;
      }

      const {
         id,
         getPayload,
         models,
         collectionName,
         log,
         db,
         outputDir,
      } = validatedDumpObj;

      for (const model of models) {
         const modelName = model.collection.name;
         const schema = modelToSchema(model);
         const collection = schema.get('collection');

         mongoose.model(modelName, schema, collection);
      }

      await connectToDb(db);

      const dump = await getDump({
         collectionName,
         collectionObjectId: id,
         getPayload,
      });

      if (log) {
         console.log({ ...dump });
         return;
      }

      fs.writeFileSync(outputDir, dump);
   } catch (err) {
      console.log('err: ', err);
   }

   process.exit();
})();
