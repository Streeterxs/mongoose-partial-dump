import mongoose, { Types } from 'mongoose';
import { collectionsToDuplicate, getRefPaths } from './collectionsToDuplicate';

type getPayloadType = (
    collectionName: string
) => {
    [arg: string]:
        | string
        | Types.ObjectId
        | { $in: string[] | Types.ObjectId[] }
        | undefined;
};
type DumperInput = {
    collectionName: string;
    collectionObjectId?: string;
    getPayload?: getPayloadType;
    fieldsToRemove?: string[];
};

export const dumper = async ({
    collectionName,
    collectionObjectId,
    getPayload,
    fieldsToRemove,
}: DumperInput) => {
    const principalModel = mongoose.model(collectionName);
    const principalCollectionName = principalModel.collection.collectionName;
    const collections = collectionsToDuplicate(collectionName);

    const dump = {};

    const conditions = getConditions({
        collectionName,
        model: principalModel,
        collectionObjectId,
        getPayload,
    });

    for await (const doc of principalModel.find(conditions).lean()) {
        if (!(principalCollectionName in dump)) {
            dump[principalCollectionName] = [];
        }
        dump[principalCollectionName] = getDumpByDoc({
            dump,
            collectionName: principalCollectionName,
            fieldsToRemove,
            doc,
        });
    }

    for (const model of collections) {
        const collectionName = model.collection.collectionName;

        const conditions = getConditions({
            collectionName,
            model,
            collectionObjectId,
            getPayload,
            principalModel,
        });

        console.log('conditions: ', conditions);
        for await (const doc of model.find(conditions).lean()) {
            if (!(collectionName in dump)) {
                dump[collectionName] = [];
            }
            dump[collectionName] = getDumpByDoc({
                dump,
                collectionName,
                fieldsToRemove,
                doc,
            });
        }
    }

    //eslint-disable-next-line
    console.log('dump: ', dump);

    return dump;
};

type getConditionsInput = {
    collectionName: string;
    model: mongoose.Model<any>;
    collectionObjectId?: string;
    getPayload?: getPayloadType;
    principalModel?: mongoose.Model<any>;
};
const getConditions = ({
    collectionName,
    model,
    collectionObjectId,
    getPayload,
    principalModel,
}: getConditionsInput) => {
    let conditions = {};

    if (getPayload) {
        conditions = {
            ...conditions,
            ...getPayload(collectionName),
        };
    }

    if (collectionObjectId) {
        if (!principalModel) {
            conditions = {
                ...conditions,
                _id: collectionObjectId,
            };
        } else {
            conditions = {
                ...conditions,
                ...getIdConditions({
                    collectionObjectId,
                    model,
                    principalModel,
                }),
            };
        }
    }

    return conditions;
};

type getIdConditionInput = {
    collectionObjectId: string | Types.ObjectId;
    model: mongoose.Model<any>;
    principalModel?: mongoose.Model<any>;
};
const getIdConditions = ({
    collectionObjectId,
    model,
    principalModel,
}: getIdConditionInput) => {
    if (!principalModel) {
        return { _id: collectionObjectId };
    }

    let conditions = {};

    const refPaths = getRefPaths(model, principalModel);
    for (const path of refPaths) {
        conditions = {
            ...conditions,
            [path]: collectionObjectId,
        };
    }
    return conditions;
};

type getDumpByDocInput = {
    dump: any;
    collectionName: string;
    fieldsToRemove: string[];
    doc: any;
};
const getDumpByDoc = ({
    dump,
    collectionName,
    fieldsToRemove,
    doc,
}: getDumpByDocInput) => {
    if (fieldsToRemove) {
        for (const field of fieldsToRemove) {
            doc[field] = null;
        }
    }
    return [...dump[collectionName], doc];
};
