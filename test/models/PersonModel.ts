import mongoose, { Document } from 'mongoose';

export interface IPerson {
    name: string;
}

export type IPersonDocument = IPerson & Document;

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
    },
    { collection: 'Person' }
);

export default mongoose.model<IPersonDocument>('Person', personSchema);
