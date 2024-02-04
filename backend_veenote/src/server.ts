import express from 'express';
import userRoute from "./routes/user.js";
import mongoose from 'mongoose';
import User from './model/userModel';


const app = express();

const db = mongoose;

db.connect("mongodb://localhost:27017/veenote")
.then(() => console.log("connected succesfully"))
.catch((err) => console.log("failed to connect", err.message));


// const new_user = new User({email: "scamcho@gmail.com"});
// ( async () => {
//     try {
//         await new_user.save();
//     } catch (error){
//         if (error instanceof Error) {
//             console.log(error.message);
//         }
    
//     }
// })();



app.use("/user", userRoute);


app.listen("8000", () => {
    console.log("now listning on port 8000");
});