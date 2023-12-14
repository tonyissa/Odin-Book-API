import { Schema, model, Types } from 'mongoose'

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    about: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    facebookId: { type: String, unique: true }
})

export interface User {
    _id?: Types.ObjectId,
    username: string,
    email: string,
    password: string,
    about: string,
    friends: [Types.ObjectId],
    requests: [Types.ObjectId],
    facebookId?: string
}

export default model('User', userSchema);