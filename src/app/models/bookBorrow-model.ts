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
        required: [true, 'Quantity is required'],
        min:[1, "Quantity must be atleast 1"],
        validate:{
            validator:Number.isInteger,
            message:'Quantity must be an integer',
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