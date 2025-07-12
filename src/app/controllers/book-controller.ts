import express, { Request, Response } from 'express';
import { Book } from './../models/book-model';
import { Error, FilterQuery, SortOrder } from 'mongoose';


// router
const bookRoute = express.Router();


// interface for book query
interface BookQuery {
    filter?:string;
    sortBy?:string;
    sort?:'asc' | 'dsc';
    limit?:string;
}


// ** post a book
bookRoute.post('/books', async(req:Request, res:Response)=>{
    const data = req.body;
    console.log(data);
    // add a new book
    const book = await Book.create(data);
    // send res
    res.status(201).send({
        success:true,
        message:"Book created successfully",
        data:book
    })
})


// ** get all books
bookRoute.get('/books', async(req:Request<{},{},{},BookQuery>, res:Response)=>{

try{
    // catch the query
const {filter,sortBy,sort,limit} = req.query;

// 
const query:FilterQuery<typeof Book> ={};
// filter by genre
if(filter){
   query.genre = filter;
}
// sorting
const sortOptions: {[key: string]: SortOrder} = {};
if (sortBy) {
    sortOptions[sortBy] = sort === "dsc" ? -1 : 1;
}
// limit
const limitNum = parseInt(limit ?? '5');
const finalLimit = isNaN(limitNum) ? 5 : limitNum;

// fetch book
    const data = await Book.find(query)
    .sort(sortOptions)
    .limit(finalLimit);
    // send response
    res.status(200).send({
        "success": true,
        "message":"Books retrieved successfully",
         data
    })
}catch(err){
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error:( err as Error).message,
    });
}


})







export default bookRoute;