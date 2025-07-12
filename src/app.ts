import express, { Application, Request, Response } from "express";
const app:Application =  express();
import bookRoute from "./app/controllers/book-controller"
import bookBorrow from "./app/controllers/book-borrowController"




// ** middleware
app.use(express.json());

// **All api end point

// api endpoint
app.use('/api', bookRoute)
app.use('/api', bookBorrow)
// 




// base url
app.get('/', (req:Request, res:Response)=>{
    res.send("Library Management API Running")
})


export default app;