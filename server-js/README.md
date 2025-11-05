# Server (Node.js / JavaScript)

This is a complete Node.js server (plain JavaScript) for the Food-Delivery project.
It provides a REST API with authentication, user management, restaurant listings, and order management.

## Features
- User authentication (register/login with JWT)
- User profile and address management
- Restaurant CRUD operations
- Order creation and tracking
- MongoDB integration with Mongoose
- Password hashing with bcryptjs
- JWT-based authentication

## Prerequisites
- Node.js >= 14
- npm
- MongoDB (local or remote URI)

## Quick start

1. Open a terminal and change into the server-js folder:

```powershell
cd c:/Users/suruk/OneDrive/Desktop/Food-Delivery/server-js
npm install
```

2. Create a `.env` file (or set env vars). You can copy `.env.example`:

```powershell
copy .env.example .env
# Edit .env if needed - change JWT_SECRET for production!
```

3. Start the server:

```powershell
npm run start
# or for development with auto-reload (requires nodemon)
npm run dev
```

The server listens by default on http://localhost:5000

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Users (`/users`) - Protected routes
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `POST /users/addresses` - Add new address
- `PUT /users/addresses/:addressId` - Update address
- `DELETE /users/addresses/:addressId` - Delete address

### Restaurants (`/restaurants`)
- `GET /restaurants` - List all restaurants
- `POST /restaurants` - Create restaurant
- `PUT /restaurants/:id` - Update restaurant

### Orders (`/orders`) - Protected routes
- `POST /orders` - Create new order
- `GET /orders` - List user's orders
- `GET /orders/:id` - Get single order
- `PUT /orders/:id/status` - Update order status

## Test Cases (curl commands for PowerShell)

### 1. Health Check

```powershell
curl http://localhost:5000/health
```

Expected: `{"status":"OK","timestamp":"..."}`

---

### 2. Register a new user (POST)

```powershell
curl -H "Content-Type: application/json" -X POST http://localhost:5000/auth/register -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"phone\":\"555-1234\"}"
```

Expected: 201 status with token and user object
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "role": "customer"
  }
}
```

**Save the token** - you'll need it for protected routes!

---

### 3. Login (POST)

```powershell
curl -H "Content-Type: application/json" -X POST http://localhost:5000/auth/login -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Expected: 200 status with token and user object

---

### 4. Get user profile (GET - Protected)

Replace `YOUR_TOKEN` with the token from register/login:

```powershell
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/users/profile
```

Expected: User object with addresses array

---

### 5. Update user profile (PUT - Protected)

```powershell
curl -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -X PUT http://localhost:5000/users/profile -d "{\"name\":\"John Smith\",\"phone\":\"555-9999\"}"
```

Expected: Updated user object

---

### 6. Add user address (POST - Protected)

```powershell
curl -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -X POST http://localhost:5000/users/addresses -d "{\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\"}"
```

Expected: Created address object with `_id`

---

### 7. Create a restaurant (POST)

```powershell
curl -H "Content-Type: application/json" -X POST http://localhost:5000/restaurants -d "{\"name\":\"La Piazza\",\"address\":\"456 Italian Ave\",\"cuisine\":\"Italian\",\"rating\":4.5}"
```

Expected: 201 status with created restaurant (save the `_id` for next steps)

---

### 8. List all restaurants (GET)

```powershell
curl http://localhost:5000/restaurants
```

Expected: Array of restaurant objects

---

### 9. Update restaurant (PUT)

Replace `RESTAURANT_ID` with the _id from step 7:

```powershell
curl -H "Content-Type: application/json" -X PUT http://localhost:5000/restaurants/RESTAURANT_ID -d "{\"rating\":4.8,\"cuisine\":\"Fine Italian\"}"
```

Expected: Updated restaurant object

---

### 10. Create an order (POST - Protected)

Replace `YOUR_TOKEN` and `RESTAURANT_ID`:

```powershell
curl -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -X POST http://localhost:5000/orders -d "{\"restaurantId\":\"RESTAURANT_ID\",\"items\":[{\"name\":\"Margherita Pizza\",\"quantity\":2,\"price\":12.99},{\"name\":\"Caesar Salad\",\"quantity\":1,\"price\":8.99}],\"deliveryAddress\":{\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\"},\"paymentMethod\":\"card\",\"notes\":\"Extra cheese please\"}"
```

Expected: 201 status with created order (save the `_id`)

---

### 11. List user's orders (GET - Protected)

```powershell
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/orders
```

Expected: Array of user's orders with populated restaurant info

---

### 12. Get single order (GET - Protected)

Replace `ORDER_ID` with the _id from step 10:

```powershell
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/orders/ORDER_ID
```

Expected: Order object with details

---

### 13. Update order status (PUT - Protected)

Replace `ORDER_ID`:

```powershell
curl -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -X PUT http://localhost:5000/orders/ORDER_ID/status -d "{\"status\":\"confirmed\"}"
```

Expected: Updated order with new status

Valid statuses: `pending`, `confirmed`, `preparing`, `out-for-delivery`, `delivered`, `cancelled`

---

## Testing workflow

1. **Register** a user → get token
2. **Create** a restaurant → get restaurant ID
3. **Create** an order using the token and restaurant ID
4. **List** orders to see your order
5. **Update** order status

## Notes
- All protected routes require `Authorization: Bearer YOUR_TOKEN` header
- Passwords are automatically hashed before saving
- JWT tokens expire in 7 days by default (configurable via JWT_EXPIRES_IN)
- Change JWT_SECRET in production to a strong random string
- MongoDB will auto-create the database and collections on first use
