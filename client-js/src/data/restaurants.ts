import { Restaurant } from '@/types';

export const sampleRestaurants: Restaurant[] = [
  {
    _id: '1',
    name: "Bella Italia",
    description: "Authentic Italian cuisine with a modern twist. Family recipes passed down through generations.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: "30-45 min",
    deliveryFee: 2.99,
    minOrder: 15,
    address: {
      street: "123 Main Street",
      city: "New York",
      coordinates: [-74.0060, 40.7128]
    },
    menu: [
      {
        category: "Appetizers",
        items: [
          {
            name: "Bruschetta",
            description: "Toasted bread with tomatoes, garlic, and fresh basil",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300&h=200&fit=crop",
            dietary: ["vegetarian"],
            customizations: [
              {
                name: "Extra Toppings",
                options: [
                  { name: "Extra Mozzarella", price: 2.00 },
                  { name: "Prosciutto", price: 3.50 }
                ]
              }
            ],
            isAvailable: true
          },
          {
            name: "Caprese Salad",
            description: "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
            price: 10.99,
            image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300&h=200&fit=crop",
            dietary: ["vegetarian", "gluten-free"],
            isAvailable: true
          }
        ]
      },
      {
        category: "Main Course",
        items: [
          {
            name: "Margherita Pizza",
            description: "Fresh mozzarella, tomatoes, and basil on our homemade dough",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: ["vegetarian"],
            customizations: [
              {
                name: "Size",
                options: [
                  { name: "Small (10\")", price: 0 },
                  { name: "Medium (12\")", price: 3.00 },
                  { name: "Large (14\")", price: 5.00 }
                ]
              },
              {
                name: "Extra Toppings",
                options: [
                  { name: "Extra Cheese", price: 2.00 },
                  { name: "Pepperoni", price: 2.50 },
                  { name: "Mushrooms", price: 1.50 }
                ]
              }
            ],
            isAvailable: true
          },
          {
            name: "Fettuccine Alfredo",
            description: "Creamy parmesan sauce with fettuccine pasta and grilled chicken",
            price: 16.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: [],
            customizations: [
              {
                name: "Protein",
                options: [
                  { name: "Chicken", price: 0 },
                  { name: "Shrimp", price: 4.00 },
                  { name: "No Protein (Vegetarian)", price: -2.00 }
                ]
              }
            ],
            isAvailable: true
          }
        ]
      }
    ],
    isActive: true
  },
  {
    _id: '2',
    name: "Dragon Palace",
    description: "Traditional Chinese cuisine specializing in Szechuan and Cantonese dishes.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    cuisine: "Chinese",
    rating: 4.3,
    deliveryTime: "25-40 min",
    deliveryFee: 1.99,
    minOrder: 20,
    address: {
      street: "456 Oak Avenue",
      city: "New York",
      coordinates: [-73.935242, 40.730610]
    },
    menu: [
      {
        category: "Appetizers",
        items: [
          {
            name: "Spring Rolls",
            description: "Crispy vegetable spring rolls with sweet chili sauce",
            price: 6.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: ["vegetarian"],
            isAvailable: true
          },
          {
            name: "Wonton Soup",
            description: "Traditional wonton soup with pork and vegetable dumplings",
            price: 8.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: [],
            isAvailable: true
          }
        ]
      },
      {
        category: "Main Course",
        items: [
          {
            name: "Kung Pao Chicken",
            description: "Spicy chicken with peanuts, vegetables, and chili peppers",
            price: 13.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: [],
            customizations: [
              {
                name: "Spice Level",
                options: [
                  { name: "Mild", price: 0 },
                  { name: "Medium", price: 0 },
                  { name: "Hot", price: 0 },
                  { name: "Extra Hot", price: 0 }
                ]
              }
            ],
            isAvailable: true
          },
          {
            name: "Beef with Broccoli",
            description: "Tender beef stir-fried with fresh broccoli in ginger sauce",
            price: 14.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: ["gluten-free"],
            isAvailable: true
          }
        ]
      }
    ],
    isActive: true
  },
  {
    _id: '3',
    name: "Taco Fiesta",
    description: "Authentic Mexican street food with fresh ingredients and bold flavors.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    cuisine: "Mexican",
    rating: 4.6,
    deliveryTime: "20-35 min",
    deliveryFee: 2.49,
    minOrder: 12,
    address: {
      street: "789 Elm Street",
      city: "New York",
      coordinates: [-73.989284, 40.750423]
    },
    menu: [
      {
        category: "Tacos",
        items: [
          {
            name: "Carne Asada Tacos",
            description: "Grilled steak tacos with cilantro, onions, and lime",
            price: 3.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: ["gluten-free"],
            customizations: [
              {
                name: "Quantity",
                options: [
                  { name: "2 Tacos", price: 0 },
                  { name: "3 Tacos", price: 4.00 },
                  { name: "4 Tacos", price: 8.00 }
                ]
              },
              {
                name: "Salsa",
                options: [
                  { name: "Mild Salsa", price: 0 },
                  { name: "Hot Salsa", price: 0 },
                  { name: "Extra Hot Salsa", price: 0.50 }
                ]
              }
            ],
            isAvailable: true
          },
          {
            name: "Fish Tacos",
            description: "Crispy fish tacos with cabbage slaw and chipotle mayo",
            price: 4.49,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: ["gluten-free"],
            isAvailable: true
          }
        ]
      },
      {
        category: "Burritos",
        items: [
          {
            name: "Chicken Burrito",
            description: "Grilled chicken, rice, beans, cheese, and guacamole",
            price: 9.99,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop",
            dietary: [],
            customizations: [
              {
                name: "Size",
                options: [
                  { name: "Regular", price: 0 },
                  { name: "Large (+$2)", price: 2.00 }
                ]
              }
            ],
            isAvailable: true
          }
        ]
      }
    ],
    isActive: true
  }
];

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return sampleRestaurants.find(restaurant => restaurant._id === id);
};

export const getRestaurantsByCuisine = (cuisine: string): Restaurant[] => {
  return sampleRestaurants.filter(restaurant => restaurant.cuisine === cuisine);
};

export const searchRestaurants = (query: string): Restaurant[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(lowercaseQuery) ||
    restaurant.cuisine.toLowerCase().includes(lowercaseQuery) ||
    restaurant.description.toLowerCase().includes(lowercaseQuery)
  );
};

export default sampleRestaurants;