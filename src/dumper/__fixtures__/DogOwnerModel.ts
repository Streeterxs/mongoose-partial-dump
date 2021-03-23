import mongoose, { Document, Types } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;
interface IDogOwner extends Document {
    person: Types.ObjectId;
    dog: Types.ObjectId;
}
const dogOwnerSchema = new mongoose.Schema(
    {
        person: {
            type: ObjectId,
            ref: 'Person',
        },
        dog: {
            type: ObjectId,
            ref: 'Dog',
        },
    },
    { collection: 'DogOwner' }
);

export default mongoose.model<IDogOwner>('DogOwner', dogOwnerSchema);
