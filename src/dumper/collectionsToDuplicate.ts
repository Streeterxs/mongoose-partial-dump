import mongoose from 'mongoose';

const getAllModels = () => {
    return mongoose.connection.models;
}
const findAllRefModels = (collectionName: string,) => {
    const allModels = getAllModels();
    const modelsIndexes = Object.keys(allModels);

    
    let refModels = [mongoose.model(collectionName)];

    for (const modelIndex of modelsIndexes) {
        const model = allModels[modelIndex];
        const {paths} = model.schema;
        const pathsKeys = Object.keys(paths);

        for (const path of pathsKeys) {
            if (paths[path]?.options.ref === collectionName) {
                refModels = [...refModels, model ];
                break;
            }
        }
    }
    return refModels;
};

export const collectionsToDuplicate = (collectionName: string) => {
    return findAllRefModels(collectionName)
};
