import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;
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
        clients: {
            type: [ObjectId],
            ref: 'DogOwner',
        },
    },
    { collection: 'PetShop' }
);

export default mongoose.model('PetShop', petShopSchema);
