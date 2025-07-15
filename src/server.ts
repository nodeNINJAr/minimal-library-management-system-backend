import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
const port = process.env.PORT || 5000;
import dotenv from "dotenv";
import { ErrorRequestHandler } from 'express';

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




// ** global error handle
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let message = "Something went wrong";

  // Custom validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // Duplicate key error (like ISBN uniqueness)
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate key error: ${Object.keys(err.keyValue)} already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: err.message,
  });

};


// at the end
app.use(globalErrorHandler)