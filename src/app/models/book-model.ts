import { model, Schema} from "mongoose";
import { BookModel, IBooks} from "../interfaces/book-interfaces";
import { BorrowBook } from "./bookBorrow-model";


// book schema
const bookSchema = new Schema<IBooks, BookModel>(
    {
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
    message: '{VALUE} is not a valid genre',
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
 copies: {
      type: Number,
      required: true,
      min: [0, 'Copies must be a positive number'],
      validate: {
        validator: Number.isInteger,
        message: 'Copies must be an integer',
      },
    },
   available:{
      type:Boolean,
      default:true,
   }
   
}, {
  versionKey:false,
  timestamps: true,
})


// static methood
bookSchema.statics.updateCopies = async function (bookId: string, newCopies: number) {
  const available = newCopies > 0;
  return this.findByIdAndUpdate(
    bookId,
    {
      copies: newCopies,
      available: available,
    },
    { new: true, runValidators: true }
  );
};


// post middleware for when book deleted borrow book will be deleted
bookSchema.post("findOneAndDelete", async function(doc, next){
   if(doc){
    await BorrowBook.deleteMany({book:doc?._id})
   }
   next()
});

// pre middleware




export const Book = model<IBooks, BookModel>("Book",bookSchema)