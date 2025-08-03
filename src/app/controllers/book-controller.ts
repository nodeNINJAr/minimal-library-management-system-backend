import express, { Request, Response } from 'express';
import { Book } from './../models/book-model';
import { Error, FilterQuery, SortOrder } from 'mongoose';
import { BorrowBook } from '../models/bookBorrow-model';


// router
const bookRoute = express.Router();


// interface for book query
interface BookQuery {
    genre?:string;
    search:string;
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
const {genre, search ,limit} = req.query;

// 
let query:FilterQuery<typeof Book> ={};
// filter by genre
if(genre){
   query.genre = genre;
}

// serach query
if(search){
   query.$or = [
      { title:{
        $regex:search, $options:"i"
      }},
     { author:{
           $regex:search, $options:"i"
      }},
       { isbn:{
           $regex:search, $options:"i"
      }},
      {
      genre:{
          $regex:search, $options:"i"
    }}

   ]
}
// total book count
const totalBooks = await Book.estimatedDocumentCount();
// total copies
const totalCopies = await Book.aggregate([
  {
  $group:{
    _id:null,
    total:{
      $sum:"$copies"
    },
  }
  },
  {
    $project:{
        _id:0,
        total:1,
    }
  }
])

// total borrwed copies
const totalBorrwed = await BorrowBook.aggregate([
    {
      $group:{
      _id:null,
      total:{
      $sum:"$quantity"
    }
  }
  },
   {
    $project:{
      _id:0,
      total:1,
    }
   }
])

// 
const totalBookCopies = totalCopies[0]?.total || 0;
// 
const totalBorrwedCopies = totalBorrwed[0]?.total || 0;
const totalAvailCopies = totalBookCopies - totalBorrwedCopies;

// limit
// const limitNum = parseInt(limit ?? '5');
// const finalLimit = isNaN(limitNum) ? 5 : limitNum;

// fetch book
    const data = await Book.find(query)
    // .limit(finalLimit);
    // send response
    res.status(200).send({
        "success": true,
        "message":"Books retrieved successfully",
         data,
         totalBooks,
         totalBookCopies,
         totalAvailCopies,
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