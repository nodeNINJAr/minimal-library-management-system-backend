import { Model } from "mongoose";

export interface IBooks{
     title:string;
     author:string;
     genre:string;
     isbn:string;
     description:string;
     copies:number;
     available:boolean;
}

// 
export interface BookModel extends Model<IBooks> {
  updateCopies(bookId: string, newCopies: number): Promise<IBooks | null>;
}