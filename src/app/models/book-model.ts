import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/book-interfaces";



// book schema
const bookSchema = new Schema<IBooks>(
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
    min: 0,
  },
   available:{
      type:Boolean,
      default:true,
   }
   
}, {
  versionKey:false,
  timestamps: true,
})

export const Book = model("Book",bookSchema)