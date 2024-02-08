import mongoose, { Document, Schema, Model} from 'mongoose';

// user model schema

interface Vuser extends Document {
    userName: string;
    email: string;
    folders: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema<Vuser> ({
    userName: {type: String, required: [true, "username is required"]},
    email: {type: String, required: true},
    folders: [{type: Schema.Types.ObjectId, ref: 'Folders'}],
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

const User: Model<Vuser> = mongoose.model<Vuser>("User", userSchema, "user_collection");

export default User;
