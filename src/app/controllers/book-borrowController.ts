import { BorrowBook } from './../models/bookBorrow-model';
import { Request, Response, Router } from "express"
import { Book } from "../models/book-model";




const bookBorrow = Router();

// ** Borrow a Book
bookBorrow.post('/borrow', async(req:Request, res:Response)=>{
    //  
    try{
        //  
        const data = req.body;
        console.log(data);
        //available book
        const bookDoc = await Book.findById(data.book);
        if (!bookDoc) {
            return res.status(404).send({ success: false, message: "Book not found" });
        }
        const { copies } = bookDoc as any;
        console.log(copies); 
        if(copies <= 0 || copies < data?.quantity){
            return res.status(400).send({ success: false, message: `Available copies is ${copies} and requested copies ${data?.quantity}` });
        }
        // available quantity
        const availableCopies = copies - data?.quantity;
        console.log(availableCopies);
        // update book quantity
        if(availableCopies >= 0){
            await Book.findByIdAndUpdate(data.book,{copies:availableCopies}, {new: true});
         
        }else{
            return
        }
        // save borrow data
        const bookBorrowd = await BorrowBook.create(data);
        // send res
        res.status(201).send({
            success: true,
            message:"Book borrowed successfully",
            data:bookBorrowd
        })

    }catch(err){
    res.status(500).json({
      success: false,
      message: 'Failed to saved borrowed book data',
      error: (err as Error).message,
    });
 }

});

// ** Borrowed Books Summary (Using Aggregation)

bookBorrow.get('/borrow', async(req:Request, res:Response)=>{
   // 
  try{
         // 
   const summary = await BorrowBook.aggregate([
        //  
        {
            $group:{
                _id:"$book",
                totalQuantity:{$sum:"$quantity"},
            },
        },
        {
         $lookup:{
            from:"books",
            localField:"_id",
            foreignField:"_id",
            as:"bookDetails"
         },   
        },
        {
           $unwind:"$bookDetails",
        },
        
        {
          $project:{
            _id:0,
            book:{
                title:"$bookDetails.title",
                isbn:"$bookDetails.isbn",
            },
            totalQuantity:1
          },  
        },
      ])

      res.status(200).send({
        success: true,
        message: 'Borrowed books summary retrieved successfully',
        data: summary,
      })

  }catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve borrowed book summary',
      error: (error as Error).message,
    });
  }


})




export default bookBorrow;