import mongoose from 'mongoose';
import { chunk } from 'lodash';

const CHUNK_SIZE = 50000;
type RestoreData = {
  [key: string]: any[];
};
export const restore = async (dataString: string) => {
  const data: RestoreData = JSON.parse(dataString);

  const collectionNameArray = Object.keys(data);

  for (const collectionName of collectionNameArray) {
    const model = mongoose.model(collectionName);

    const dataChunks = chunk(data[collectionName], CHUNK_SIZE);
    for (const dataChunk of dataChunks) {
      await model.insertMany(dataChunk);
    }
  }
};
