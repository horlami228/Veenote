import mongoose from './engine/dataBase.js';
import { Document, Schema, Model} from 'mongoose';

// user model schema

interface Vuser extends Document {
    userName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema<Vuser> ({
    userName: {type: String, required: [true, "userName is required"]},
    email: {type: String, required: [true, "email is required"]},
    password: {type: String, required: [true, "password is required"]},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

const User: Model<Vuser> = mongoose.model<Vuser>("User", userSchema, "users_collection");

export default User;
