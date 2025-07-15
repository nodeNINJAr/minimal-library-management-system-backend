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
    try {
        // catch the query
        const { filter, sortBy, sort, limit } = req.query;
        // 
        const query = {};
        // filter by genre
        if (filter) {
            query.genre = filter;
        }
        // sorting
        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sort === "dsc" ? -1 : 1;
        }
        // limit
        const limitNum = parseInt(limit !== null && limit !== void 0 ? limit : '5');
        const finalLimit = isNaN(limitNum) ? 5 : limitNum;
        // fetch book
        const data = yield book_model_1.Book.find(query)
            .sort(sortOptions)
            .limit(finalLimit);
        // send response
        res.status(200).send({
            "success": true,
            "message": "Books retrieved successfully",
            data
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
