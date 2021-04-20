import mongoose, { Document } from 'mongoose';

export interface IDogToy extends Document {
    name: string;
}
const dogToySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
    },
    { collection: 'DogToy' }
);

export default mongoose.model<IDogToy>('DogToy', dogToySchema);
