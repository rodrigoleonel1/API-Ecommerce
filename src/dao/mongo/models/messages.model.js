import mongoose from 'mongoose';
const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        requiered: true,
    },
    email: {
        type: String,
        requiered: true,
    },
    message: {
        type: String,
        requiered: true
    }
})

const messagesModel = mongoose.model(messagesCollection, messagesSchema);
export default messagesModel;