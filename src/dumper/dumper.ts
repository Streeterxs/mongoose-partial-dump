import mongoose, { Types } from 'mongoose';
import {
    collectionsToDuplicate,
    getRefPaths,
    getSchemaPathsAndKeys,
} from './collectionsToDuplicate';

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
    dump?: any;
};

export const dumper = async ({
    collectionName,
    collectionObjectId,
    getPayload,
    fieldsToRemove,
    dump = {},
}: DumperInput) => {
    const principalModel = mongoose.model(collectionName);
    const principalCollectionName = principalModel.collection.collectionName;
    const collections = collectionsToDuplicate(collectionName);

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
        const docAlreadyDumped = dump[principalCollectionName].filter(
            ({ _id }) => _id.toString() === doc._id.toString()
        );
        if (docAlreadyDumped.length > 0) {
            continue;
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
        const recursiveCollectionsToDuplicate = collectionsToDuplicate(
            collectionName
        );

        const conditions = getConditions({
            collectionName,
            model,
            collectionObjectId,
            getPayload,
            principalModel,
        });

        for await (const doc of model.find(conditions).lean()) {
            if (!(collectionName in dump)) {
                dump[collectionName] = [];
            }

            const docAlreadyDumped = dump[principalCollectionName].filter(
                ({ _id }) => _id.toString() === doc._id.toString()
            );
            if (docAlreadyDumped.length > 0) {
                continue;
            }
            dump[collectionName] = getDumpByDoc({
                dump,
                collectionName,
                fieldsToRemove,
                doc,
            });

            if (recursiveCollectionsToDuplicate.length > 0) {
                dump = await dumper({
                    collectionName,
                    collectionObjectId: doc._id.toString(),
                    getPayload,
                    fieldsToRemove,
                    dump,
                });
            }
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
