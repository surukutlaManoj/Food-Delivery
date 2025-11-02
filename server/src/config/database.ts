import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

    // Try to connect to MongoDB, but don't fail if it's not available
    try {
      await mongoose.connect(mongoURI);
      console.log('✅ MongoDB connected successfully');
    } catch (mongoError) {
      console.warn('⚠️ MongoDB not available, running in mock mode');
      console.warn('MongoDB Error:', (mongoError as Error).message);
      // Don't exit, continue with mock data
    }

    // Handle connection errors after initial connection
    mongoose.connection.on('error', (error) => {
      console.warn('⚠️ MongoDB connection error:', error.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
      } catch (error) {
        console.warn('Error closing MongoDB connection:', error);
      }
      process.exit(0);
    });

  } catch (error) {
    console.warn('⚠️ Database setup warning:', (error as Error).message);
    console.log('🚀 Server will continue in mock mode');
  }
};