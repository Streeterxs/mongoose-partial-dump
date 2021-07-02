import fs from 'fs';
import mongoose, { Types } from 'mongoose';

import { connectToDb, DatabaseConfig } from '../../database/database';
import { dumper } from '../../dumper/dumper';
import { modelToSchema } from '../../database/modelToSchema';

import { getConfig, Configs } from '../../configs/configMapper';
import { validateDumpCliConfig } from './dumpValidations';
import { getPayloadType } from '../../dumper/dumperUtils';
import { dumpSanitize } from './dumpSanitize';

type getDumpInput = {
   collectionName: string;
   collectionObjectId?: Types.ObjectId;
   getPayload?: getPayloadType;
};

type dumpInput =
   | {
        getPayload: getPayloadType | null | undefined;
        models: mongoose.Model<any, any, any>[] | null;
        db: DatabaseConfig | null;
        collectionName: string;
        id: Types.ObjectId | undefined;
        log: boolean | undefined;
        outputDir: string | null | undefined;
     }
   | undefined;

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

export const getDumpSanitizedArgv = (argv: any) => {
   return dumpSanitize(argv);
};

export const getDumpObject = async (argv: any) => {
   const unvalidatedConfig = await getConfig(Configs.DUMP);
   const unvalidatedArgv = getDumpSanitizedArgv(argv);
   return validateDumpCliConfig(unvalidatedArgv, unvalidatedConfig);
};

export const dump = async (validatedDumpObj: dumpInput) => {
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

   const stringfiedDump = JSON.stringify(dump);

   fs.writeFileSync(outputDir, stringfiedDump);
};

export const runDump = async (argv: any) => {
   const dumpObject = await getDumpObject(argv);
   await dump(dumpObject);
};
