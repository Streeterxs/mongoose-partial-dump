import mongoose, { Document, Types } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;
export interface IDogOwner {
    person: Types.ObjectId;
    dog: Types.ObjectId;
}

export type IDogOwnerDocument = IDogOwner & Document;
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

export default mongoose.model<IDogOwnerDocument>('DogOwner', dogOwnerSchema);
