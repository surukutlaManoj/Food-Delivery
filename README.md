# Food Delivery App

A modern food ordering web application built with the MERN stack (MongoDB, Express.js, React, Node.js), featuring user authentication, restaurant browsing, shopping cart functionality, and payment processing.

## Features

- **User Authentication**: Register, login, and profile management
- **Restaurant Browsing**: Search, filter, and browse restaurants with detailed menus
- **Shopping Cart**: Add items, manage quantities, and real-time price calculation
- **Order Management**: Place orders, track status, and view order history
- **Payment Integration**: Mock payment system for demonstration
- **Real-time Updates**: WebSocket integration for order tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **Real-time**: WebSockets
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install-deps
   ```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Configure your MongoDB connection string

4. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
Food-Delivery/
├── client/          # React frontend
├── server/          # Node.js/Express backend
├── shared/          # Shared types and utilities
├── package.json     # Root package.json with scripts
├── .gitignore
└── README.md
```

## Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run install-deps` - Install dependencies for all packages
