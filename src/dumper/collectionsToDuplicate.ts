import mongoose, { Types } from 'mongoose';

const getModelObject = (
    model: mongoose.Model<any>,
    id: string | Types.ObjectId
) => {
    return model.findOne({ _id: id });
};

const getSchemaPathsAndKeys = (model: mongoose.Model<any>) => {
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
            console.log('paths[path]?.options: ', paths[path]?.options);
            refPathsKeys = [path];
            break;
        }
    }

    return refPathsKeys;
};

const getAllRefModelsByCollection = (collectionName: string) => {
    const allModels = getAllModels();
    const modelsIndexes = Object.keys(allModels);

    let refModels = [];

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
