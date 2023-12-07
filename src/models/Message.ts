import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    message: { type: String }
})

export default model('Message', messageSchema);