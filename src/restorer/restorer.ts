import mongoose from 'mongoose';

type RestoreData = {
   [key: string]: any[];
};
export const restore = async (dataString: string) => {
   const data: RestoreData = JSON.parse(dataString);

   const collectionNameArray = Object.keys(data);

   for (const collectionName of collectionNameArray) {
      const model = mongoose.model(collectionName);

      for (const document of data[collectionName]) {
         await new model({ ...document }).save();
      }
   }
};
