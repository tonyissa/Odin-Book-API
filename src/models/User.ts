import { Schema, model, Types } from 'mongoose'

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    bio: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    requests: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export interface User {
    username: string,
    email: string,
    password: string,
    bio: string,
    friends: Types.ObjectId,
    requests: Types.ObjectId
}

export default model('User', userSchema);