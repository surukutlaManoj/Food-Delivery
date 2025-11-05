# 🍕 Food Delivery Application - Full Stack JavaScript

Complete migration of the Food Delivery platform to **pure JavaScript** (Node.js backend + React JavaScript frontend).

## 📦 Project Structure

```
Food-Delivery/
├── server-js/              # Node.js Backend (JavaScript)
│   ├── index.js
│   ├── package.json
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── middleware/        # Auth & error handling
│   ├── README.md
│   ├── start-server.bat
│   └── test-api.bat
│
└── client-js/             # React Frontend (JavaScript/JSX)
    ├── package.json
    ├── src/
    │   ├── App.js
    │   ├── components/    # UI components (.jsx)
    │   ├── pages/         # Page components (.jsx)
    │   ├── context/       # React Context (.js)
    │   ├── services/      # API services (.js)
    │   └── utils/         # Helper functions (.js)
    ├── README.md
    └── start-client.bat
```

## 🚀 Quick Start (Full Stack)

### Prerequisites
- Node.js >= 14
- npm
- MongoDB (local or Atlas)

### Option 1: Quick Start Scripts

#### 1. Start Backend
```powershell
cd server-js
./start-server.bat
```
Server runs on: **http://localhost:5000**

#### 2. Start Frontend (in new terminal)
```powershell
cd client-js
./start-client.bat
```
Client runs on: **http://localhost:3000**

### Option 2: Manual Setup

#### Backend
```powershell
cd server-js
npm install
copy .env.example .env
# Edit .env if needed (MongoDB URI, JWT secret)
npm start
```

#### Frontend
```powershell
cd client-js
npm install
npm start
```

## 🎯 What's Included

### ✅ Backend (Node.js)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **API Routes**:
  - `/auth` - Register, Login
  - `/users` - Profile, Addresses
  - `/restaurants` - CRUD operations
  - `/orders` - Order management

### ✅ Frontend (React)
- **UI**: React 18 with JSX
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State**: Context API
- **Validation**: PropTypes
- **Features**:
  - User authentication
  - Restaurant browsing
  - Shopping cart
  - Order placement
  - Order tracking
  - Profile management
  - Light/Dark theme

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login

### Restaurants
- `GET /restaurants` - List all
- `POST /restaurants` - Create
- `PUT /restaurants/:id` - Update

### Orders (Protected)
- `POST /orders` - Create order
- `GET /orders` - List user orders
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update status

### Users (Protected)
- `GET /users/profile` - Get profile
- `PUT /users/profile` - Update profile
- `POST /users/addresses` - Add address

## 🧪 Testing the Application

### 1. Test Backend API (Terminal)

```powershell
cd server-js
./test-api.bat
```

Or use curl commands from `server-js/README.md`

### 2. Test Frontend (Browser)

1. Open http://localhost:3000
2. Click "Register" → Create account
3. Browse restaurants
4. Add items to cart
5. Checkout and place order
6. View order history

## 📁 Important Files

### Backend
- `server-js/index.js` - Server entry point
- `server-js/models/` - Database schemas
- `server-js/routes/` - API endpoints
- `server-js/middleware/auth.js` - JWT auth
- `server-js/.env.example` - Environment template
- `server-js/README.md` - Backend docs with curl tests

### Frontend
- `client-js/src/App.js` - Main app component
- `client-js/src/context/` - Global state
- `client-js/src/services/api.js` - HTTP client
- `client-js/src/pages/` - Page components
- `client-js/README.md` - Frontend docs

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/fooddelivery
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Frontend (Optional)
```
REACT_APP_API_URL=http://localhost:5000
PORT=3000
```

## 🌟 Key Features

### User Features
- ✅ Registration & Login
- ✅ JWT Authentication
- ✅ Profile Management
- ✅ Multiple Delivery Addresses
- ✅ Order History & Tracking

### Restaurant Features
- ✅ Browse Restaurants
- ✅ View Menu & Details
- ✅ Search & Filter
- ✅ Ratings & Reviews

### Shopping Features
- ✅ Add to Cart
- ✅ Cart Persistence
- ✅ Quantity Management
- ✅ Restaurant Validation
- ✅ Order Total Calculation

### Order Features
- ✅ Place Orders
- ✅ Order Confirmation
- ✅ Status Tracking
- ✅ Order History

## 📝 Development

### Add Backend Route
1. Create model in `server-js/models/`
2. Create route in `server-js/routes/`
3. Mount route in `server-js/index.js`

### Add Frontend Page
1. Create component in `client-js/src/pages/`
2. Add route in `client-js/src/App.js`
3. Add navigation in `client-js/src/components/common/Header.jsx`

## 🐛 Troubleshooting

### Backend Issues

**MongoDB connection failed**
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, check IP whitelist

**Port 5000 in use**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

### Frontend Issues

**Port 3000 in use**
```powershell
$env:PORT=3001
npm start
```

**Module not found**
```powershell
cd client-js
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

**Cannot connect to backend**
- Ensure backend is running on port 5000
- Check proxy in `client-js/package.json`
- Verify CORS is enabled on backend

## 📚 Documentation

- **Backend API**: See `server-js/README.md` for all endpoints and curl examples
- **Frontend**: See `client-js/README.md` for React component docs
- **Backend Migration**: See `server-js/MIGRATION_SUMMARY.md`
- **Frontend Migration**: See `client-js/MIGRATION_SUMMARY.md`

## 🎓 Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for passwords
- CORS enabled

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios for HTTP
- PropTypes validation
- Context API for state

## ✅ Migration Status

- [x] Backend converted to Node.js (JavaScript)
- [x] Frontend converted to React (JSX)
- [x] All TypeScript removed
- [x] PropTypes added
- [x] API tested and working
- [x] Documentation complete
- [x] Quick start scripts created

## 🚀 Deployment

### Backend
- Deploy to Heroku, AWS, or Azure
- Set environment variables
- Connect to MongoDB Atlas

### Frontend
- Build: `npm run build` in `client-js/`
- Deploy to Netlify, Vercel, or S3
- Set API URL environment variable

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is for educational purposes.

## 🎉 Success!

Your full-stack JavaScript Food Delivery application is ready to run!

**Start both servers:**
```powershell
# Terminal 1 - Backend
cd server-js
npm start

# Terminal 2 - Frontend
cd client-js
npm start
```

Then open http://localhost:3000 in your browser! 🍕🚀
