import { Schema, model } from 'mongoose'

const replySchema = new Schema({
    reply: { type: String },
    date: { type: Date },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number }
})

export default model('Reply', replySchema);