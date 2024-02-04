import mongoose, {Schema, Document, Model} from "mongoose";

// Schema for folders
interface Vfolder extends Document {
    folderName: string;
    notes: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const folderSchema: Schema = new Schema<Vfolder>({
    folderName: {type: String, required: true},
    notes: [{type: Schema.Types.ObjectId, refs: "Notes"}],
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
});

const folder: Model<Vfolder> = mongoose.model<Vfolder>("Folders", folderSchema, "folder_collection");

export default folder;
