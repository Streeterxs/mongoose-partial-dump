import mongoose, { Document } from 'mongoose';

export interface IDogToy {
    name: string;
}

export type IDogToyDocument = IDogToy & Document;
const dogToySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
    },
    { collection: 'DogToy' }
);

export default mongoose.model<IDogToyDocument>('DogToy', dogToySchema);
