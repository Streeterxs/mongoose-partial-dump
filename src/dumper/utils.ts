import mongoose, { Types } from 'mongoose';
import { getRefPaths, getSchemaPathsAndKeys } from './collectionsToDuplicate';

export type getPayloadType = (
   collectionName: string
) => {
   [arg: string]:
      | string
      | Types.ObjectId
      | { $in: string[] | Types.ObjectId[] }
      | undefined;
};

type getConditionsInput = {
   collectionName: string;
   model: mongoose.Model<any>;
   collectionObjectId?: string;
   getPayload?: getPayloadType;
   mainModel?: mongoose.Model<any>;
};
export const getConditions = ({
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
      conditions = {
         ...conditions,
         ...getIdConditions({
            collectionObjectId,
            model,
            mainModel,
         }),
      };
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
export const getIdConditions = ({
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
export const removeFields = ({ fieldsToRemove, doc }: removeFieldsInput) => {
   if (fieldsToRemove) {
      for (const field of fieldsToRemove) {
         doc[field] = null;
      }
   }

   return doc;
};
