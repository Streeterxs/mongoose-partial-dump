import mongoose, { Types, Document } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

interface IPetShopClient extends Document {
    dogOwner: Types.ObjectId;
    petShop: Types.ObjectId;
}
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

export default mongoose.model<IPetShopClient>(
    'PetShopClient',
    petShopClientSchema
);
