import mongoose from 'mongoose';

const uri: string = process.env.DATABASE_URI!;

if (typeof uri === 'undefined') {
    throw new Error('DATABASE_URI is not defined');
}

mongoose.connect(uri)
.then(() => console.log("connected succesfully"))
.catch((err) => console.log("failed to connect", err.message));

export default mongoose ;
