import mongoose, { Document } from 'mongoose';

interface IPerson extends Document {
    name: string;
}
const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
    },
    { collection: 'Person' }
);

export default mongoose.model<IPerson>('Person', personSchema);
