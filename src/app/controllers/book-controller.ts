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


// Get Book by ID api
bookRoute.get('/books/:bookId', async(req:Request, res:Response)=>{
   //   
   try{
    //  
   const {bookId} = req.params;
   //  
   const data = await Book.findById(bookId);
   res.status(200).json({
     success:true,
     message: "Book retrieved successfully",
     data
   })
    // 
   }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve single book data',
      error: (error as Error).message,
    });
  }

});


// Update Book api
bookRoute.put('/books/:bookId', async(req:Request, res:Response)=>{
   //   
   try{
    const updatedData = req.body;
    //  
   const {bookId} = req.params;
   //  
    if(updatedData?.copies < 0){
    return res.status(400).json({
     success:false,
     message: "copies cant be negetive",
     enteredCopies:updatedData?.copies
   })
    }
   //    
   const data = await Book.findByIdAndUpdate(bookId, updatedData, {new:true});
  // update book quantity by statics mehtood
    await Book.updateCopies(bookId, updatedData?.copies);

   //    
   res.status(200).json({
     success:true,
     message: "Book updated successfully",
     data
   })
    // 
   }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to updated book data',
      error: (error as Error).message,
    });
  }

});


// book delete api
bookRoute.delete('/books/:bookId', async(req:Request, res:Response)=>{
   //   
   try{
    //  
   const {bookId} = req.params;
   //  
    if(!bookId){
    return res.status(400).json({
     success:false,
     message: "book id not found",
     })
    }
   //    
   const data = await Book.findByIdAndDelete(bookId);
   //    
   res.status(200).json({
     success:true,
     message: "Book deleted successfully",
     data
   })
    // 
   }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to deleted book',
      error: (error as Error).message,
    });
  }

});



export default bookRoute;