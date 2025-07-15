"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowBook = void 0;
const mongoose_1 = require("mongoose");
const bookBorrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    quantity: {
        type: Number,
        required: [true, 'Copies is required'],
        min: [1, "Copies must be a positive number"],
        validate: {
            validator: Number.isInteger,
            message: 'Copies must be an integer',
        }
    },
    dueDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v instanceof Date && v > new Date();
            },
            message: "Due date must be a future date"
        },
    }
}, {
    versionKey: false,
    timestamps: true,
});
exports.BorrowBook = (0, mongoose_1.model)('BorrowBook', bookBorrowSchema);
