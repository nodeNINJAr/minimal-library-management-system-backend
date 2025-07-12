import express, { Application, Request, Response } from "express";
const app:Application =  express();




// ** middleware
app.use(express.json());

// **All api end point

// post api
app.use("/api",)






// base url
app.get('/', (req:Request, res:Response)=>{

    res.send("Library Management API Running")
})


export default app;