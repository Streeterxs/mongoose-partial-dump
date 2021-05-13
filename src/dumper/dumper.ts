import mongoose from 'mongoose';
import { collectionsToDuplicate } from './collectionsToDuplicate';
import { getConditions, getPayloadType, removeFields } from './utils';

type DumperInput = {
   collectionName: string;
   collectionObjectId?: string;
   getPayload?: getPayloadType;
   fieldsToRemove?: string[];
   dump?: any;
};
export const dumper = async ({
   collectionName,
   collectionObjectId,
   getPayload,
   fieldsToRemove,
   dump = {},
}: DumperInput) => {
   const mainModel = mongoose.model(collectionName);
   const mainCollectionName = mainModel.collection.collectionName;
   const collections = collectionsToDuplicate(collectionName);

   const conditions = getConditions({
      collectionName,
      model: mainModel,
      collectionObjectId,
      getPayload,
   });

   const mainDocs = mainModel.find(conditions).lean();
   for await (const doc of mainDocs) {
      if (!(mainCollectionName in dump)) {
         dump[mainCollectionName] = [];
      }
      const docAlreadyDumped = dump[mainCollectionName].filter(
         ({ _id }) => _id.toString() === doc._id.toString()
      );
      if (docAlreadyDumped.length > 0) {
         continue;
      }

      const docWithoutFields = removeFields({
         fieldsToRemove,
         doc,
      });
      dump[mainCollectionName] = [
         ...dump[mainCollectionName],
         docWithoutFields,
      ];
   }

   for (const model of collections) {
      const collectionName = model.collection.collectionName;
      const recursiveCollectionsToDuplicate = collectionsToDuplicate(
         collectionName
      );

      const conditions = getConditions({
         collectionName,
         model,
         collectionObjectId,
         getPayload,
         mainModel,
      });

      for await (const doc of model.find(conditions).lean()) {
         if (!(collectionName in dump)) {
            dump[collectionName] = [];
         }

         const docAlreadyDumped = dump[mainCollectionName].filter(
            ({ _id }) => _id.toString() === doc._id.toString()
         );

         if (docAlreadyDumped.length > 0) {
            continue;
         }

         const docWithoutFields = removeFields({
            fieldsToRemove,
            doc,
         });
         dump[collectionName] = [...dump[collectionName], docWithoutFields];

         if (recursiveCollectionsToDuplicate.length > 0) {
            dump = await dumper({
               collectionName,
               collectionObjectId: doc._id.toString(),
               getPayload,
               fieldsToRemove,
               dump,
            });
         }
      }
   }

   //eslint-disable-next-line
   console.log('dump: ', dump);

   return dump;
};
