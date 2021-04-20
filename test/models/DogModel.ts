import mongoose, { Document, Types } from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;
export interface IDog {
    name: string;
    toys: Types.ObjectId[];
}

export type IDogDocument = IDog & Document;
const dogSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
        toys: {
            type: [ObjectId],
            ref: 'DogToy',
            required: false,
            default: [],
        },
    },
    { collection: 'Dog' }
);

export default mongoose.model<IDogDocument>('Dog', dogSchema);
