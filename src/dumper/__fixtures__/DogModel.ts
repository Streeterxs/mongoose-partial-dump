import mongoose, { Document } from 'mongoose'

interface IDog extends Document {
    name: string
}
const dogSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
    },
    { collection: 'Dog' }
)

export default mongoose.model<IDog>('Dog', dogSchema)
