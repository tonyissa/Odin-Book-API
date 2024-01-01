import { Schema, model, Types } from 'mongoose'

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    googleId: { type: String }
})

export interface UserType {
    _id?: Types.ObjectId,
    username: string,
    email: string,
    password: string,
    googleId?: string
}

export default model('User', userSchema);