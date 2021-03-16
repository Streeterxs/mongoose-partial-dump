import { genericNewDocumentByModel } from './modelImportsFunctions/Generics';
import mongoose from 'mongoose';

const findAllRefPaths = (collectionName: string, paths) => {

};

export const collectionsToDuplicate = (collectionName: string) => {
    const model = mongoose.model(collectionName);
    const { paths } = model.schema;
    console.log('paths: ', paths);
};
