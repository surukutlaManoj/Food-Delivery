@echo off
echo Testing Food-Delivery API Endpoints
echo =====================================
echo.
echo Make sure server is running on http://localhost:5000
echo.
pause
echo.

echo 1. Testing Health Check...
curl http://localhost:5000/health
echo.
echo.

echo 2. Registering a new user...
curl -H "Content-Type: application/json" -X POST http://localhost:5000/auth/register -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"phone\":\"555-1234\"}"
echo.
echo.
echo IMPORTANT: Copy the token from above response!
echo.
pause
echo.

set /p TOKEN="Enter the token from registration: "
echo.

echo 3. Getting user profile...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:5000/users/profile
echo.
echo.

echo 4. Creating a restaurant...
curl -H "Content-Type: application/json" -X POST http://localhost:5000/restaurants -d "{\"name\":\"La Piazza\",\"address\":\"456 Italian Ave\",\"cuisine\":\"Italian\",\"rating\":4.5}"
echo.
echo.
echo IMPORTANT: Copy the restaurant _id from above response!
echo.
pause
echo.

set /p RESTAURANT_ID="Enter the restaurant ID: "
echo.

echo 5. Listing all restaurants...
curl http://localhost:5000/restaurants
echo.
echo.

echo 6. Creating an order...
curl -H "Content-Type: application/json" -H "Authorization: Bearer %TOKEN%" -X POST http://localhost:5000/orders -d "{\"restaurantId\":\"%RESTAURANT_ID%\",\"items\":[{\"name\":\"Margherita Pizza\",\"quantity\":2,\"price\":12.99}],\"deliveryAddress\":{\"street\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"zipCode\":\"10001\"}}"
echo.
echo.

echo 7. Listing user orders...
curl -H "Authorization: Bearer %TOKEN%" http://localhost:5000/orders
echo.
echo.

echo Testing complete!
pause
