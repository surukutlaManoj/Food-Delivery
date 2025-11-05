const mongoose = require('mongoose');
require('dotenv').config();

const Restaurant = require('./models/Restaurant');

const sampleRestaurants = [
  {
    name: "Pizza Palace",
    address: "123 Main St, New York, NY 10001",
    cuisine: "Italian",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    deliveryTime: "30-40 min",
    deliveryFee: 2.99,
    minimumOrder: 15.00,
    isOpen: true,
  },
  {
    name: "Burger Heaven",
    address: "456 Oak Ave, New York, NY 10002",
    cuisine: "American",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    deliveryTime: "25-35 min",
    deliveryFee: 1.99,
    minimumOrder: 10.00,
    isOpen: true,
  },
  {
    name: "Sushi Express",
    address: "789 Park Blvd, New York, NY 10003",
    cuisine: "Japanese",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    deliveryTime: "35-45 min",
    deliveryFee: 3.99,
    minimumOrder: 20.00,
    isOpen: true,
  },
  {
    name: "Taco Fiesta",
    address: "321 Elm St, New York, NY 10004",
    cuisine: "Mexican",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    deliveryTime: "20-30 min",
    deliveryFee: 1.49,
    minimumOrder: 12.00,
    isOpen: true,
  },
  {
    name: "Thai Spice",
    address: "654 Broadway, New York, NY 10005",
    cuisine: "Thai",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400",
    deliveryTime: "30-40 min",
    deliveryFee: 2.49,
    minimumOrder: 15.00,
    isOpen: true,
  },
  {
    name: "Mediterranean Grill",
    address: "987 5th Ave, New York, NY 10006",
    cuisine: "Mediterranean",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    deliveryTime: "35-45 min",
    deliveryFee: 3.49,
    minimumOrder: 18.00,
    isOpen: true,
  },
  {
    name: "Chinese Dragon",
    address: "147 West St, New York, NY 10007",
    cuisine: "Chinese",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
    deliveryTime: "25-35 min",
    deliveryFee: 2.00,
    minimumOrder: 15.00,
    isOpen: true,
  },
  {
    name: "Indian Curry House",
    address: "258 East Ave, New York, NY 10008",
    cuisine: "Indian",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    deliveryTime: "30-40 min",
    deliveryFee: 2.99,
    minimumOrder: 16.00,
    isOpen: true,
  }
];

async function seedRestaurants() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fooddelivery';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('🗑️  Cleared existing restaurants');

    // Insert sample restaurants
    const inserted = await Restaurant.insertMany(sampleRestaurants);
    console.log(`✅ Added ${inserted.length} sample restaurants`);

    console.log('\n📋 Sample Restaurants:');
    inserted.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} - ${r.cuisine} (${r.rating}⭐)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding restaurants:', error);
    process.exit(1);
  }
}

seedRestaurants();
