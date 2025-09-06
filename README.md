# E-Commerce Web Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Backend
- JWT Authentication (signup, login, logout)
- CRUD APIs for items with filters (price, categories)
- Add to cart APIs
- MongoDB database integration

### Frontend
- React.js single-page application
- Signup and login pages
- Items listing page with filters
- Shopping cart with add/remove functionality
- Cart persistence after logout

## Project Structure

```
├── backend/          # Node.js + Express.js API server
├── frontend/         # React.js client application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 
- MongoDB connection string in backend/.env

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start MongoDB service
2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.