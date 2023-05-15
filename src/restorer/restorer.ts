import mongoose from 'mongoose';
import { chunk } from 'lodash';

const CHUNK_SIZE = 50000;
type RestoreData = {
  [key: string]: any[];
};
type RestoreInput = {
  dump: string;
  defaultValues?: any;
  defaultSingValues?: any;
};
export const restore = async ({
  dump,
  defaultValues,
  defaultSingValues,
}: RestoreInput) => {
  const data: RestoreData = JSON.parse(dump);

  const collectionNameArray = Object.keys(data);

  for (const collectionName of collectionNameArray) {
    const model = mongoose.model(collectionName);

    const dataChunks = chunk(data[collectionName], CHUNK_SIZE);
    for (const dataChunk of dataChunks) {
      if (!defaultValues && !defaultSingValues) {
        await model.insertMany(dataChunk);
        continue;
      }

      const defaultSingValue = defaultSingValues?.[collectionName] ?? {};
      const mappedDataChunk = dataChunk.map((data) => ({
        ...data,
        ...defaultValues,
        ...defaultSingValue,
      }));

      await model.insertMany(mappedDataChunk);
    }
  }
};
