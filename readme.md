# 📚Minimal Library Management System (Backend)

A robust and scalable backend service for managing library resources, members, and transactions. Built using **Node.js**, **TypeScript**, **Express**, **MongoDB**, and **Mongoose** ODM, this backend provides RESTful APIs to support frontend clients in managing books, users, borrowing/returning operations, and more.

---

## 📖 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Overview](#-api-overview)
- [Configuration](#-configuration)
- [Scripts](#-scripts)
- [Dependencies](#-dependencies)
- [Troubleshooting](#-troubleshooting)
- [Contributors](#-contributors)
- [License](#-license)

---

## ✨ Features

- RESTful API architecture
- User and Book management
- Borrowing and returning system
- MongoDB for data persistence
- Mongoose ODM for schema validation
- Environment-based configuration using `.env`
- Modular and clean project structure
- TypeScript support with live reload via `ts-node-dev`

---

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone 
   cd library-management

🚀 Usage
To run the server in development mode with hot reloading:

bash

npm run dev

The server will start on the port specified in your .env (default: 5000).

📡 API Overview
The backend exposes endpoints under /api, for example:

 - GET /api/books – List all books

 - POST /api/books – Add a new book

 - PUT /api/books/:id – Update book details

 - DELETE /api/books/:id – Remove a book

 - POST /api/borrow – Borrow a book


⚙️ Configuration
Environment variables are used for configuration. Example .env:

env

PORT=5000
MONGODB_URI=mongodb://localhost:27017/library
📜 Scripts
npm run dev – Start development server with ts-node-dev

npm test – Placeholder for test scripts

📦 Dependencies

** Runtime
express

mongoose

dotenv

cors

** Dev
typescript

ts-node

ts-node-dev

@types/node

@types/express

🐞 Troubleshooting
MongoDB not connecting?
Make sure MongoDB is running and your MONGODB_URI in .env is correct.

TypeScript errors?
Check your tsconfig.json settings and ensure all type definitions are installed.

Port already in use?
Change the PORT in .env or stop the process using it.

👥 Contributors
Mehedi Hasan [GitHub](https://github.com/nodeNINJAr)

