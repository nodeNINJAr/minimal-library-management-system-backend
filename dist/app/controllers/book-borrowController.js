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
Object.defineProperty(exports, "__esModule", { value: true });
const bookBorrow_model_1 = require("./../models/bookBorrow-model");
const express_1 = require("express");
const book_model_1 = require("../models/book-model");
const bookBorrow = (0, express_1.Router)();
// ** Borrow a Book
bookBorrow.post('/borrow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //  
    try {
        //  
        const data = req.body;
        //available book
        const bookDoc = yield book_model_1.Book.findById(data.book);
        if (!bookDoc) {
            return res.status(404).send({ success: false, message: "Book not found" });
        }
        const { copies } = bookDoc;
        if (copies <= 0 || copies < (data === null || data === void 0 ? void 0 : data.quantity)) {
            return res.status(400).send({ success: false, message: `Available copies is ${copies} and requested copies ${data === null || data === void 0 ? void 0 : data.quantity}` });
        }
        // available quantity
        const availableCopies = copies - (data === null || data === void 0 ? void 0 : data.quantity);
        // update book quantity by statics mehtood
        yield book_model_1.Book.updateCopies(data.book, availableCopies);
        // save borrow data
        const bookBorrowd = yield bookBorrow_model_1.BorrowBook.create(data);
        // send res
        res.status(201).send({
            success: true,
            message: `${copies} copies Book borrowed successfully`,
            data: bookBorrowd
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to saved borrowed book data',
            error: err.message,
        });
    }
}));
// ** Borrowed Books Summary (Using Aggregation)
bookBorrow.get('/borrow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page } = req.query;
    try {
        const limitNum = parseInt(limit !== null && limit !== void 0 ? limit : '10');
        const pageNum = parseInt(page !== null && page !== void 0 ? page : '1');
        const skip = (pageNum - 1) * limitNum;
        const summary = yield bookBorrow_model_1.BorrowBook.aggregate([
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve borrowed book summary',
            error: error.message,
        });
    }
}));
exports.default = bookBorrow;
