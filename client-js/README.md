# Food Delivery Client (JavaScript/JSX)

This is the **JavaScript version** of the Food Delivery React client, converted from TypeScript.

## ✅ What Was Converted

### From TypeScript to JavaScript
- ✅ All `.tsx` files → `.jsx` files
- ✅ All `.ts` files → `.js` files
- ✅ Removed type annotations and interfaces
- ✅ Converted to PropTypes for runtime validation
- ✅ Fixed all import paths (removed `@/` aliases, using relative paths)
- ✅ Removed TypeScript-specific syntax

### Project Structure

```
client-js/
├── package.json          # JavaScript dependencies (no TypeScript)
├── craco.config.js       # CRACO configuration for Webpack
├── tailwind.config.js    # Tailwind CSS config
├── postcss.config.js     # PostCSS config
├── public/               # Static assets
│   ├── index.html
│   └── manifest.json
└── src/
    ├── index.js          # Entry point
    ├── App.js            # Main App component
    ├── i18n.js           # Internationalization
    ├── index.css         # Global styles
    ├── components/       # Reusable UI components
    │   └── common/
    │       ├── Button.jsx
    │       ├── Footer.jsx
    │       ├── Header.jsx
    │       ├── Layout.jsx
    │       ├── LoadingSpinner.jsx
    │       └── Modal.jsx
    ├── context/          # React Context providers
    │   ├── AuthContext.js
    │   ├── CartContext.js
    │   └── ThemeContext.js
    ├── data/             # Mock/static data
    │   └── restaurants.ts (unchanged)
    ├── pages/            # Page components
    │   ├── CartPage.jsx
    │   ├── CheckoutPage.jsx
    │   ├── HomePage.jsx
    │   ├── LoginPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── OrderConfirmationPage.jsx
    │   ├── OrderDetailPage.jsx
    │   ├── OrderHistoryPage.jsx
    │   ├── ProfilePage.jsx
    │   ├── RegisterPage.jsx
    │   ├── RestaurantDetailPage.jsx
    │   └── RestaurantListPage.jsx
    ├── services/         # API services
    │   └── api.js
    └── utils/            # Helper functions
        └── helpers.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14
- npm
- The Node.js backend server running on `http://localhost:5000`

### Installation & Run

```powershell
# Navigate to client-js folder
cd c:/Users/suruk/OneDrive/Desktop/Food-Delivery/client-js

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at: **http://localhost:3000**

### Build for Production

```powershell
npm run build
```

## 📦 Dependencies

### Core Libraries
- **react** ^18.2.0 - UI library
- **react-dom** ^18.2.0 - React DOM rendering
- **react-router-dom** ^6.14.0 - Client-side routing
- **prop-types** ^15.8.1 - Runtime prop validation (replaces TypeScript)

### State & Data
- **axios** ^1.4.0 - HTTP client
- **react-hot-toast** ^2.4.1 - Toast notifications

### Styling
- **tailwindcss** ^3.3.2 - Utility-first CSS framework
- **postcss** ^8.4.24 - CSS processor
- **autoprefixer** ^10.4.14 - Auto-prefix CSS

### Build Tools
- **@craco/craco** ^7.1.0 - Override Create React App config
- **react-scripts** 5.0.1 - CRA build tooling

## 🔧 Configuration

### CRACO Config (`craco.config.js`)
Configures Webpack aliases for cleaner imports. Already set up - no changes needed.

### Tailwind Config (`tailwind.config.js`)
Custom Tailwind theme with food delivery branding colors. Already configured.

### PostCSS Config (`postcss.config.js`)
Processes Tailwind CSS. Already configured.

## 🔄 Key Differences from TypeScript Version

| TypeScript | JavaScript |
|------------|------------|
| `.tsx` / `.ts` files | `.jsx` / `.js` files |
| Type annotations | PropTypes validation |
| Interfaces & Types | JSDoc comments (optional) |
| `import type { }` | Removed |
| `const x: Type = ...` | `const x = ...` |
| Compile-time checks | Runtime PropTypes checks |

## 🌐 API Integration

The client connects to the Node.js backend server:

- **Base URL**: `http://localhost:5000`
- **Proxy**: Configured in `package.json`
- **Auth**: JWT tokens stored in `localStorage`

### Available Endpoints
- `/auth/register` - User registration
- `/auth/login` - User login
- `/restaurants` - List restaurants
- `/restaurants/:id` - Restaurant details
- `/orders` - User orders
- `/users/profile` - User profile

## 🎨 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Auto-redirect for auth/public routes

### Restaurant Browsing
- View restaurant list
- Filter by cuisine
- Search restaurants
- View menu and details

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart (localStorage)
- Restaurant validation

### Order Management
- Place orders
- View order history
- Track order status
- Order confirmation page

### User Profile
- Update profile information
- Manage delivery addresses
- View account settings

### Theme Support
- Light/Dark mode toggle
- Respects system preference
- Persists user choice

## 🧪 Testing Workflow

1. **Start the backend server** (from `server-js/`)
   ```powershell
   cd ../server-js
   npm start
   ```

2. **Start the client** (from `client-js/`)
   ```powershell
   npm start
   ```

3. **Test the flow**:
   - Register a new user
   - Browse restaurants
   - Add items to cart
   - Checkout and place order
   - View order history

## 🛠️ Development

### Adding New Components

1. Create `.jsx` file in appropriate folder
2. Add PropTypes for props validation
3. Export component

Example:
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const MyComponent = ({ title, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Click Me</button>
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default MyComponent;
```

### PropTypes Reference

Common prop types:
- `PropTypes.string`
- `PropTypes.number`
- `PropTypes.bool`
- `PropTypes.func`
- `PropTypes.object`
- `PropTypes.array`
- `PropTypes.node` (any renderable content)
- `PropTypes.element` (React element)
- `PropTypes.arrayOf(PropTypes.string)`
- `PropTypes.shape({ name: PropTypes.string })`

Add `.isRequired` for required props.

## 📝 Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from CRA (⚠️ irreversible)

## 🚨 Troubleshooting

### Port 3000 already in use
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or set different port
$env:PORT=3001
npm start
```

### Module not found errors
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Backend connection issues
- Ensure backend is running on port 5000
- Check proxy setting in `package.json`
- Verify API base URL in `src/services/api.js`

## ✅ Migration Complete!

Your React frontend has been successfully converted from TypeScript to JavaScript. All components, pages, contexts, and utilities are now in plain JavaScript with PropTypes for validation.

**Ready to run!** Just execute:
```powershell
npm install && npm start
```

Enjoy your JavaScript Food Delivery app! 🍕🚀
