import mongoose, { Types, Document } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export interface IPetShopClient {
    dogOwner: Types.ObjectId;
    petShop: Types.ObjectId;
}

export type IPetShopClientDocument = IPetShopClient & Document;

const petShopClientSchema = new mongoose.Schema(
    {
        dogOwner: {
            type: ObjectId,
            ref: 'DogOwner',
        },
        petShop: {
            type: ObjectId,
            ref: 'PetShop',
        },
    },
    { collection: 'PetShopClient' }
);

export default mongoose.model<IPetShopClientDocument>(
    'PetShopClient',
    petShopClientSchema
);
