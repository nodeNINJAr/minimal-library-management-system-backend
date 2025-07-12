import express, { Application, Request, Response } from "express";
const app:Application =  express();
import bookRoute from "./app/controllers/book-controller"




// ** middleware
app.use(express.json());

// **All api end point

// post api
app.use('/api', bookRoute)

// 




// base url
app.get('/', (req:Request, res:Response)=>{
    res.send("Library Management API Running")
})


export default app;