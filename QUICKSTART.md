# Food Delivery App - Quick Start Guide

## ✅ Current Status

**Backend Server:** Running successfully on http://localhost:5000  
**Frontend Client:** Ready to start

## 🚀 How to Run Your Application

### Option 1: Using the Startup Script (Recommended)
Simply double-click `start-app.bat` in the root folder. This will open two command windows:
- Server window (port 5000)
- Client window (port 3000)

### Option 2: Manual Start

#### Start Backend Server:
```powershell
cd server
npm start
```

#### Start Frontend Client (in a new terminal):
```powershell
cd client
npm start
```

Wait for "Compiled successfully!" message, then open http://localhost:3000

## 📝 Test Credentials

- **Email:** demo@fooddelivery.com
- **Password:** any password (mock auth enabled)

## 🔧 What Was Fixed

1. ✅ Fixed TypeScript compilation errors in server
2. ✅ Added proper MongoDB document type definitions
3. ✅ Fixed JWT token signing issues
4. ✅ Installed missing server dependencies (negotiator, mime-db, etc.)
5. ✅ Built server successfully
6. ✅ Server running with MongoDB connection
7. ⚠️ Client has npm workspace dependency conflicts (working on resolution)

## ⚠️ Known Issues

### Duplicate Schema Index Warning
```
Warning: Duplicate schema index on {"email":1} found
```
**Impact:** Non-critical warning, server works fine  
**Fix:** Remove duplicate index declaration in User model

### Client Dependency Issues
The client has Babel helper dependency resolution issues due to npm workspace hoisting.

**Temporary Workaround:** 
If client fails to start, try:
```powershell
cd client
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json  
npm install --legacy-peer-deps
npm start
```

## 📡 API Endpoints

- Health Check: http://localhost:5000/health
- Authentication: http://localhost:5000/api/auth
- Restaurants: http://localhost:5000/api/restaurants
- Orders: http://localhost:5000/api/orders
- Users: http://localhost:5000/api/users

## 🛠️ Troubleshooting

### Port Already in Use Error
If you see "EADDRINUSE" error:
```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force
```

### Client Won't Start
1. Make sure you're in the `client` folder
2. Try the dependency reinstall workaround above
3. Check that port 3000 is not in use

## 📦 Project Structure

```
Food-Delivery/
├── server/          # Backend (Node.js + Express + MongoDB)
│   ├── src/         # TypeScript source
│   └── dist/        # Compiled JavaScript
├── client/          # Frontend (React + TypeScript)
│   ├── src/         # React components
│   └── public/      # Static files
└── start-app.bat    # Quick start script
```

## 🎯 Next Steps

Once both services are running:
1. Open http://localhost:3000
2. Login with demo@fooddelivery.com
3. Browse restaurants
4. Add items to cart
5. Proceed to checkout

---
**Note:** The backend server is fully functional. The client installation needs dependency resolution due to npm workspace configuration conflicts.
