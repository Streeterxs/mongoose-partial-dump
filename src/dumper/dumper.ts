import mongoose, { Types } from 'mongoose';

import {
   collectionsToDuplicate,
   getAllRefPath,
   RefPath,
} from '../database/mongoUtils';
import {
   AnonymizationField,
   dumperHasDocument,
   getConditions,
   getPayloadType,
   normalizeFields,
} from './dumperUtils';

type DumperInput = {
   collectionName: string;
   collectionObjectId?: Types.ObjectId | string;
   getPayload?: getPayloadType;
   fieldsToRemove?: string[];
   fieldsToAnonymize?: AnonymizationField[];
   dump?: any;
};
export const dumper = async ({
   collectionName,
   collectionObjectId,
   getPayload,
   fieldsToRemove = [],
   fieldsToAnonymize = [],
   dump = {},
}: DumperInput) => {
   console.log('dumper running :)');
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

      const docWithoutFields = normalizeFields({
         fieldsToRemove,
         fieldsToAnonymize,
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
            fieldsToAnonymize,
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

         const docWithoutFields = normalizeFields({
            fieldsToRemove,
            fieldsToAnonymize,
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

   return dump;
};

type populateDumpWithRefDocsInput = {
   dump: any;
   doc: any;
   collectionName: string;
   fieldsToRemove: string[];
   fieldsToAnonymize: AnonymizationField[];
};
const populateDumpWithRefDocs = async ({
   dump,
   doc,
   collectionName,
   fieldsToRemove,
   fieldsToAnonymize,
}: populateDumpWithRefDocsInput) => {
   const allRefPaths = getAllRefPath(collectionName);

   for (const refPath of allRefPaths) {
      if (!(refPath.collection in dump)) {
         dump[refPath.collection] = [];
      }
      const refPathModel = mongoose.model(refPath.collection);
      const docRefPath = await refPathModel
         .findOne({
            _id: doc[refPath.pathKey],
         })
         .lean();

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
      const docRefPathWithoutFields = normalizeFields({
         fieldsToRemove,
         fieldsToAnonymize,
         doc: docRefPath,
      });

      dump[refPath.collection] = [
         ...dump[refPath.collection],
         docRefPathWithoutFields,
      ];
   }
};
