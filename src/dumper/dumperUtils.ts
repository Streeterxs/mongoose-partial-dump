import mongoose, { Types } from 'mongoose';
import { getRefPaths, getSchemaPathsAndKeys } from '../database/mongoUtils';
import { AnonymizationType, anonymize } from '../utils/anonymizer';

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
   const objectId = new Types.ObjectId(collectionObjectId);
   if (!mainModel) {
      return { _id: objectId };
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
};
export const removeFields = ({ fieldsToRemove = [] }: removeFieldsInput) => {
   return Object.fromEntries(fieldsToRemove.map((field) => [field, null]));
};

export type AnonymizationField = {
   field: string;
   type: AnonymizationType;
};

type anonymizeFieldsInput = {
   fieldsToAnonymize: AnonymizationField[];
};
export const anonymizeFields = ({
   fieldsToAnonymize = [],
}: anonymizeFieldsInput) => {
   return Object.fromEntries(
      fieldsToAnonymize.map((field) => {
         return [field.field, anonymize(field.type)];
      })
   );
};

type normalizeFieldsInput = {
   fieldsToAnonymize: AnonymizationField[];
   doc: any;
   fieldsToRemove: string[];
};
export const normalizeFields = ({
   fieldsToAnonymize,
   fieldsToRemove,
   doc,
}: normalizeFieldsInput) => {
   return {
      ...doc,
      ...anonymizeFields({ fieldsToAnonymize }),
      ...removeFields({ fieldsToRemove }),
   };
};

type dumperHasDocumentInput = {
   dump: any;
   collectionName: string;
   id: Types.ObjectId;
};
export const dumperHasDocument = ({
   dump,
   collectionName,
   id,
}: dumperHasDocumentInput): boolean => {
   const docAlreadyDumped = dump[collectionName].filter(
      ({ _id }) => _id.toString() === id.toString()
   );

   if (docAlreadyDumped.length > 0) {
      return true;
   }

   return false;
};
