import mongoose from 'mongoose';

import { collectionsToDuplicate, getAllRefPath, RefPath } from './mongoUtils';
import {
   dumperHasDocument,
   getConditions,
   getPayloadType,
   removeFields,
} from './dumperUtils';

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

      const docAlreadyDumped = dumperHasDocument({
         dump,
         collectionName: mainCollectionName,
         id: doc._id,
      });
      if (docAlreadyDumped) {
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

         await populateDumpWithRefDocs({
            dump,
            collectionName,
            fieldsToRemove,
            doc,
         });

         const docAlreadyDumped = dumperHasDocument({
            dump,
            collectionName,
            id: doc._id,
         });
         if (docAlreadyDumped) {
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

type populateDumpWithRefDocsInput = {
   dump: any;
   doc: any;
   collectionName: string;
   fieldsToRemove: any;
};
const populateDumpWithRefDocs = async ({
   dump,
   doc,
   collectionName,
   fieldsToRemove,
}: populateDumpWithRefDocsInput) => {
   const allRefPaths = getAllRefPath(collectionName);

   for (const refPath of allRefPaths) {
      if (!(refPath.collection in dump)) {
         dump[refPath.collection] = [];
      }
      const refPathModel = mongoose.model(refPath.collection);
      const docRefPath = await refPathModel.findOne({
         _id: doc[refPath.pathKey],
      });

      if (!(refPath.collection in dump)) {
         dump[refPath.collection] = [];
      }

      const docRefPathAlreadyDumped = dumperHasDocument({
         dump,
         collectionName: refPath.collection,
         id: docRefPath._id,
      });
      if (docRefPathAlreadyDumped) {
         continue;
      }
      const docRefPathWithoutFields = removeFields({
         fieldsToRemove,
         doc: docRefPath,
      });

      dump[refPath.collection] = [
         ...dump[refPath.collection],
         docRefPathWithoutFields,
      ];
   }
};
