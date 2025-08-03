import { BorrowBook } from './../models/bookBorrow-model';
import { Request, Response, Router } from "express"
import { Book } from "../models/book-model";




const bookBorrow = Router();



// interface for book query
interface BookQuery {
  page?: string;
  limit?: string;
}




// ** Borrow a Book
bookBorrow.post('/borrow', async(req:Request, res:Response)=>{
    //  
    try{
        //  
        const data = req.body;
        //available book
        const bookDoc = await Book.findById(data.book);
        if (!bookDoc) {
            return res.status(404).send({ success: false, message: "Book not found" });
        }
        const { copies } = bookDoc as any;
  
        if(copies <= 0 || copies < data?.quantity){
            return res.status(400).send({ success: false, message: `Available copies is ${copies} and requested copies ${data?.quantity}` });
        }
        // available quantity
        const availableCopies = copies - data?.quantity;

        // update book quantity by statics mehtood
        await Book.updateCopies(data.book, availableCopies);

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

bookBorrow.get('/borrow', async (req: Request<{},{},{},BookQuery>, res: Response) => {
  const { limit, page } = req.query;

  try {
    const limitNum = parseInt(limit ?? '10');
    const pageNum = parseInt(page ?? '1');
    const skip = (pageNum - 1) * limitNum;

    const summary = await BorrowBook.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails"
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $skip: skip },
      { $limit: limitNum },
    ]);

    res.status(200).send({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
      page: pageNum,
      limit: limitNum,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve borrowed book summary',
      error: (error as Error).message,
    });
  }
});




export default bookBorrow;