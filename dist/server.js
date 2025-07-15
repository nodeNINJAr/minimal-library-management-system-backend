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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 5000;
const dotenv_1 = __importDefault(require("dotenv"));
// 
dotenv_1.default.config();
let server;
// mongoUri 
const mongoUri = process.env.MONGO_URI;
// 
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //  
        if (!mongoUri) {
            throw new Error("MONGO_URI environment variable is not defined.");
        }
        //  Connect the mongoose
        yield mongoose_1.default.connect(mongoUri);
        //  
        try {
            server = app_1.default.listen(port, () => {
                console.log(`Library Management App server Running on the ${port}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
//Call the main function
main();
// ** global error handle
const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    let statusCode = 500;
    let message = "Something went wrong";
    // Custom validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }
    // Duplicate key error (like ISBN uniqueness)
    if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate key error: ${Object.keys(err.keyValue)} already exists`;
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: err.message,
    });
};
// at the end
app_1.default.use(globalErrorHandler);
