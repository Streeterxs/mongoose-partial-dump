import { Types } from 'mongoose'
import { collectionsToDuplicate } from './collectionsToDuplicate'

type DumperInput = {
    collectionName: string
    getPayload: (
        collectionName: string
    ) => {
        [arg: string]:
            | string
            | Types.ObjectId
            | { $in: string[] | Types.ObjectId[] }
            | undefined
    }
    fieldsToRemove?: string[]
}

export const dumper = async ({
    collectionName,
    getPayload,
    fieldsToRemove,
}: DumperInput) => {
    const collections = collectionsToDuplicate(collectionName)

    const dump = {}

    for (const model of collections) {
        const collectionName = model.collection.collectionName

        const payload = getPayload(collectionName)

        for await (const doc of model.find(payload).lean()) {
            if (!(collectionName in dump)) {
                dump[collectionName] = []
            }

            if (fieldsToRemove) {
                for (const field of fieldsToRemove) {
                    doc[field] = null
                }
            }
            dump[collectionName] = [...dump[collectionName], doc]
        }
    }

    //eslint-disable-next-line
    console.log(dump)

    return dump
}
