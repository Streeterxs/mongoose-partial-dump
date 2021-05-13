import mongoose, { Types } from 'mongoose';
import {
   collectionsToDuplicate,
   getRefPaths,
   getSchemaPathsAndKeys,
} from './collectionsToDuplicate';

type getPayloadType = (
   collectionName: string
) => {
   [arg: string]:
      | string
      | Types.ObjectId
      | { $in: string[] | Types.ObjectId[] }
      | undefined;
};
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

type getConditionsInput = {
   collectionName: string;
   model: mongoose.Model<any>;
   collectionObjectId?: string;
   getPayload?: getPayloadType;
   mainModel?: mongoose.Model<any>;
};
const getConditions = ({
   collectionName,
   model,
   collectionObjectId,
   getPayload,
   mainModel,
}: getConditionsInput) => {
   let conditions = {};

   if (getPayload) {
      conditions = {
         ...conditions,
         ...getPayload(collectionName),
      };
   }

   if (collectionObjectId) {
      if (!mainModel) {
         conditions = {
            ...conditions,
            _id: collectionObjectId,
         };
      } else {
         conditions = {
            ...conditions,
            ...getIdConditions({
               collectionObjectId,
               model,
               mainModel,
            }),
         };
      }
   }

   const { pathsKeys } = getSchemaPathsAndKeys(model);
   const conditionKeys = Object.keys(conditions);
   for (const conditionKey of conditionKeys) {
      if (!pathsKeys.includes(conditionKey)) {
         delete conditions[conditionKey];
      }
   }
   return conditions;
};

type getIdConditionInput = {
   collectionObjectId: string | Types.ObjectId;
   model: mongoose.Model<any>;
   mainModel?: mongoose.Model<any>;
};
const getIdConditions = ({
   collectionObjectId,
   model,
   mainModel,
}: getIdConditionInput) => {
   if (!mainModel) {
      return { _id: collectionObjectId };
   }

   let conditions = {};

   const refPaths = getRefPaths(model, mainModel);
   for (const path of refPaths) {
      conditions = {
         ...conditions,
         [path]: collectionObjectId,
      };
   }
   return conditions;
};

type removeFieldsInput = {
   fieldsToRemove: string[];
   doc: any;
};
const removeFields = ({ fieldsToRemove, doc }: removeFieldsInput) => {
   if (fieldsToRemove) {
      for (const field of fieldsToRemove) {
         doc[field] = null;
      }
   }

   return doc;
};
