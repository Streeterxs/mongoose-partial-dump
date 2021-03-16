import mongoose from "mongoose";

const dogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    }
}, { collection: 'Dog' });

export default mongoose.model('Dog', dogSchema);
