import express, { Application, Request, Response } from "express";
const app:Application =  express();
import bookRoute from "./app/controllers/book-controller"
import bookBorrow from "./app/controllers/book-borrowController"
import cors from "cors";




// ** middleware
app.use(express.json());
//
app.use(cors({
   origin:"http://localhost:5173"
})) 

// **All api end point

// api endpoint
app.use('/api', bookRoute)
app.use('/api', bookBorrow)
// 


// base url
app.get('/', (req:Request, res:Response)=>{
    res.send("Library Management API Running")
})


// If no route matches, this runs
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});



export default app;