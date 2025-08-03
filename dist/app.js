"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const book_controller_1 = __importDefault(require("./app/controllers/book-controller"));
const book_borrowController_1 = __importDefault(require("./app/controllers/book-borrowController"));
// ** middleware
//
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://library-management-front-end-dusky.vercel.app"]
}));
// **All api end point
// api endpoint
app.use('/api', book_controller_1.default);
app.use('/api', book_borrowController_1.default);
// 
// base url
app.get('/', (req, res) => {
    res.send("Library Management API Running");
});
// If no route matches, this runs
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});
exports.default = app;
