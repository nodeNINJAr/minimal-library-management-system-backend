import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
const port = process.env.PORT || 5000;
import dotenv from "dotenv";

// 
dotenv.config();


let server:Server ;

// mongoUri 
const mongoUri = process.env.MONGO_URI;
// 
async function main() {
    //  
    if(!mongoUri){
        throw new Error("MONGO_URI environment variable is not defined.")
    }
    //  Connect the mongoose
    await mongoose.connect(mongoUri);

    //  
    try{
       server = app.listen(port,()=>{
         console.log(`Library Management App server Running on the ${port}`);
       })
    }catch(err){
        console.log(err);
     }

}
//Call the main function
main();