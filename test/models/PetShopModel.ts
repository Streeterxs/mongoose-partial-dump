import mongoose, { Document, Types } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;
export interface IPetShop {
    name: string;
    dogs: Types.ObjectId[];
}

export type IPetShopDocument = IPetShop & Document;

const petShopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
        dogs: {
            type: [ObjectId],
            ref: 'Dog',
        },
    },
    { collection: 'PetShop' }
);

export default mongoose.model<IPetShopDocument>('PetShop', petShopSchema);
