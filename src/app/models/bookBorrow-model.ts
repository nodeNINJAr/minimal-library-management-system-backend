import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow-interface";



const bookBorrowSchema = new Schema<IBorrow>(

    {
      book:{
        type:Schema.Types.ObjectId,
        ref:"Book",
        required:true,
      },
      quantity:{
        type:Number,
        required: [true, 'Copies is required'],
        min:[1, "Copies must be a positive number"],
        validate:{
            validator:Number.isInteger,
            message:'Copies must be an integer',
        }
      },
      dueDate:{
          type:Date,
          required:true,
          validate:{
           validator: function (v) {
               return v instanceof Date && v > new Date();
           },
           message: "Due date must be a future date"
      },
    }
  },
  {
    versionKey:false,
    timestamps:true,
        
    }

)



export const BorrowBook = model('BorrowBook',bookBorrowSchema)