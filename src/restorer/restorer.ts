// eslint-disable-next-line
import { IMPORT_DUMP_FUNCTIONS } from '../dumper/collectionsToDuplicate';

export const partialDumpPopulate = async (dataString: string) => {
  const data = JSON.parse(dataString);

  const collectionNameArray = Object.keys(data);

  for (const collectionName of collectionNameArray) {
    const collImportFunction = IMPORT_DUMP_FUNCTIONS[collectionName];
    await collImportFunction(data[collectionName]);
  }
};
