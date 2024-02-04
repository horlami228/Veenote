import mongoose, { Document, Schema, Model} from 'mongoose';

// user model schema

interface Vuser extends Document {
    username: string;
    email: string;
}

const userSchema: Schema = new Schema<Vuser> ({
    username: {type: String, required: [true, "username is required"]},
    email: {type: String, required: true}
});

const User: Model<Vuser> = mongoose.model<Vuser>("User", userSchema, "user_collection");

export default User;
