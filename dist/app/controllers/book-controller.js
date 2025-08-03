"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_model_1 = require("./../models/book-model");
const bookBorrow_model_1 = require("../models/bookBorrow-model");
// router
const bookRoute = express_1.default.Router();
// ** post a book
bookRoute.post('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    // add a new book
    const book = yield book_model_1.Book.create(data);
    // send res
    res.status(201).send({
        success: true,
        message: "Book created successfully",
        data: book
    });
}));
// ** get all books
bookRoute.get('/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // catch the query
        const { genre, search, limit, page } = req.query;
        // 
        let query = {};
        // filter by genre
        if (genre) {
            query.genre = genre;
        }
        // serach query
        if (search) {
            query.$or = [
                { title: {
                        $regex: search, $options: "i"
                    } },
                { author: {
                        $regex: search, $options: "i"
                    } },
                { isbn: {
                        $regex: search, $options: "i"
                    } },
                {
                    genre: {
                        $regex: search, $options: "i"
                    }
                }
            ];
        }
        // total book count
        const totalBooks = yield book_model_1.Book.estimatedDocumentCount();
        // total copies
        const totalCopies = yield book_model_1.Book.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$copies"
                    },
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                }
            }
        ]);
        // total borrwed copies
        const totalBorrwed = yield bookBorrow_model_1.BorrowBook.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$quantity"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    total: 1,
                }
            }
        ]);
        // 
        const totalBookCopies = ((_a = totalCopies[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        // 
        const totalBorrwedCopies = ((_b = totalBorrwed[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
        const totalAvailCopies = totalBookCopies - totalBorrwedCopies;
        // limit
        const limitNum = parseInt(limit !== null && limit !== void 0 ? limit : '10');
        const pageNum = parseInt(page !== null && page !== void 0 ? page : '1');
        const skip = (pageNum - 1) * limitNum;
        // fetch book
        const data = yield book_model_1.Book.find(query)
            .sort({ copies: -1 })
            .skip(skip)
            .limit(limitNum);
        // send response
        res.status(200).send({
            "success": true,
            "message": "Books retrieved successfully",
            data,
            totalBooks,
            totalBookCopies,
            totalAvailCopies,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message,
        });
    }
}));
// Get Book by ID api
bookRoute.get('/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   
    try {
        //  
        const { bookId } = req.params;
        //  
        const data = yield book_model_1.Book.findById(bookId);
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data
        });
        // 
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve single book data',
            error: error.message,
        });
    }
}));
// Update Book api
bookRoute.put('/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   
    try {
        const updatedData = req.body;
        //  
        const { bookId } = req.params;
        //  
        if ((updatedData === null || updatedData === void 0 ? void 0 : updatedData.copies) < 0) {
            return res.status(400).json({
                success: false,
                message: "copies cant be negetive",
                enteredCopies: updatedData === null || updatedData === void 0 ? void 0 : updatedData.copies
            });
        }
        //    
        const data = yield book_model_1.Book.findByIdAndUpdate(bookId, updatedData, { new: true });
        // update book quantity by statics mehtood
        yield book_model_1.Book.updateCopies(bookId, updatedData === null || updatedData === void 0 ? void 0 : updatedData.copies);
        //    
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data
        });
        // 
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to updated book data',
            error: error.message,
        });
    }
}));
// book delete api
bookRoute.delete('/books/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   
    try {
        //  
        const { bookId } = req.params;
        //  
        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "book id not found",
            });
        }
        //    
        const data = yield book_model_1.Book.findByIdAndDelete(bookId);
        //    
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data
        });
        // 
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to deleted book',
            error: error.message,
        });
    }
}));
exports.default = bookRoute;
