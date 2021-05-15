import mongoose, { mongo, Types } from 'mongoose';

export const getSchemaPathsAndKeys = (model: mongoose.Model<any>) => {
   const { paths } = model.schema;
   const pathsKeys = Object.keys(paths);

   return {
      paths,
      pathsKeys,
   };
};

const getAllModels = () => {
   return mongoose.connection.models;
};

export const getRefPaths = (
   model: mongoose.Model<any>,
   refModel: mongoose.Model<any>
) => {
   const { paths, pathsKeys } = getSchemaPathsAndKeys(model);
   let refPathsKeys = [];

   for (const path of pathsKeys) {
      if (paths[path]?.options.ref === refModel.collection.collectionName) {
         refPathsKeys = [path];
         break;
      }
   }

   return refPathsKeys;
};

export type RefPath = {
   pathKey: string;
   collection: string;
};
export const getAllRefPath = (collectionName: string) => {
   const model = mongoose.model(collectionName);
   const { paths, pathsKeys } = getSchemaPathsAndKeys(model);

   let refPaths: RefPath[] = [];

   for (const key of pathsKeys) {
      if (paths[key].options.ref) {
         refPaths = [
            ...refPaths,
            { pathKey: key, collection: paths[key].options.ref },
         ];
      }
   }
   return refPaths;
};

const getAllRefModelsByCollection = (collectionName: string) => {
   const allModels = getAllModels();
   const modelsIndexes = Object.keys(allModels);

   let refModels: mongoose.Model<any, any>[] = [];

   for (const modelIndex of modelsIndexes) {
      const model = allModels[modelIndex];
      const { paths, pathsKeys } = getSchemaPathsAndKeys(model);

      for (const path of pathsKeys) {
         if (paths[path]?.options.ref === collectionName) {
            refModels = [...refModels, model];
            break;
         }
      }
   }
   return refModels;
};

export const collectionsToDuplicate = (
   collectionName: string,
   id?: string | Types.ObjectId
) => {
   return getAllRefModelsByCollection(collectionName);
};
