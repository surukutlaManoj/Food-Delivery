const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'demo-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const restaurants = [
  {
    _id: '1',
    name: "Bella Italia",
    description: "Authentic Italian cuisine with a modern twist",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    minOrder: 15,
    isActive: true
  },
  {
    _id: '2',
    name: "Dragon Palace",
    description: "Traditional Chinese cuisine",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    cuisine: "Chinese",
    rating: 4.3,
    deliveryTime: "25-40 min",
    deliveryFee: 1.99,
    minOrder: 20,
    isActive: true
  },
  {
    _id: '3',
    name: "Taco Fiesta",
    description: "Authentic Mexican street food",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    cuisine: "Mexican",
    rating: 4.6,
    deliveryTime: "20-35 min",
    deliveryFee: 2.49,
    minOrder: 12,
    isActive: true
  }
];

let users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@fooddelivery.com',
    phone: '+1234567890',
    addresses: []
  }
];

// JWT middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find(u => u.id === decoded.userId);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Demo mode - accept any password for demo user
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    success: true,
    message: 'Login successful',
    data: { token, user }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone } = req.body;

  // Check if user exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, error: 'Email already exists' });
  }

  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    phone,
    addresses: []
  };

  users.push(newUser);
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { token, user: newUser }
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// Restaurant routes
app.get('/api/restaurants', (req, res) => {
  const { search, cuisine, page = 1, limit = 10 } = req.query;

  let filtered = restaurants.filter(r => r.isActive);

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(searchLower) ||
      r.cuisine.toLowerCase().includes(searchLower)
    );
  }

  if (cuisine) {
    filtered = filtered.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  res.json({
    success: true,
    data: {
      restaurants: paginated,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limitNum)
      }
    }
  });
});

app.get('/api/restaurants/featured', (req, res) => {
  const { limit = 6 } = req.query;

  const featured = restaurants
    .filter(r => r.isActive && r.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, parseInt(limit));

  res.json({
    success: true,
    data: { restaurants: featured }
  });
});

app.get('/api/restaurants/cuisines', (req, res) => {
  const cuisines = [...new Set(restaurants.map(r => r.cuisine))].sort();

  res.json({
    success: true,
    data: { cuisines }
  });
});

app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  const restaurant = restaurants.find(r => r._id === id && r.isActive);

  if (!restaurant) {
    return res.status(404).json({ success: false, error: 'Restaurant not found' });
  }

  res.json({
    success: true,
    data: { restaurant }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Demo server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`👤 Demo user: demo@fooddelivery.com (any password)`);
});

module.exports = app;