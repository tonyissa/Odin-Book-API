import { Schema, model } from 'mongoose'

const postSchema = new Schema({
    body: { type: String },
    filename: { type: String },
    date: { type: Date },
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default model('Post', postSchema);