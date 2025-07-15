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
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookBorrow_model_1 = require("./bookBorrow-model");
// book schema
const bookSchema = new mongoose_1.Schema({
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
        min: [1, 'Copies must be a positive number'],
        validate: {
            validator: Number.isInteger,
            message: 'Copies must be an integer',
        },
    },
    available: {
        type: Boolean,
        default: true,
    }
}, {
    versionKey: false,
    timestamps: true,
});
// static methood
bookSchema.statics.updateCopies = function (bookId, newCopies) {
    return __awaiter(this, void 0, void 0, function* () {
        const available = newCopies > 0;
        return this.findByIdAndUpdate(bookId, {
            copies: newCopies,
            available: available,
        }, { new: true, runValidators: true });
    });
};
// post middleware for when book deleted borrow book will be deleted
bookSchema.post("findOneAndDelete", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield bookBorrow_model_1.BorrowBook.deleteMany({ book: doc === null || doc === void 0 ? void 0 : doc._id });
        }
        next();
    });
});
// pre middleware
bookSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // 
        const isExist = yield exports.Book.findOne({ isbn: this.isbn });
        //  
        if (this.copies <= 0 && isExist === null) {
            return next(new Error("You need at least 1 copy and ISBN must be unique"));
        }
        // Generate new ISBN until unique
        if (isExist) {
            let newIsbn;
            // 
            newIsbn = `RND-${Math.floor(100000000 + Math.random() * 900000000)}`;
            this.isbn = newIsbn;
        }
        // 
        next();
        // 
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
