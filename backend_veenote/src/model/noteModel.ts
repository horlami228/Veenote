import mongoose, {Schema, Document, Model} from "mongoose";

// Note schema definitions

interface Vnote extends Document {
    title: string;
    content: string;
    folder: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema: Schema = new Schema<Vnote>({
    title: {type: String, default: "Untitled"},
    content: {type: String, required: true},
    folder: {type: Schema.Types.ObjectId, refs: "folders"},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

const note: Model<Vnote> = mongoose.model<Vnote>("Notes", noteSchema, "note_collection");

export default note;
