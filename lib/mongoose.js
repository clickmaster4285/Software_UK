import mongoose from 'mongoose';

/**
 * Cache the connection across hot reloads in development so API routes do not
 * open a new MongoDB connection on every request.
 */
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

if (!globalThis.__mongooseListenersAttached) {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB event: connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB event: error', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB event: disconnected');
  });

  globalThis.__mongooseListenersAttached = true;
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.error('MONGODB_URI not defined in .env');
      throw new Error('Please define the MONGODB_URI environment variable inside .env');
    }

    console.log(`Attempting MongoDB connection: ${MONGODB_URI}`);

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        console.log('Connected to MongoDB successfully');
        console.log(`MongoDB database: ${mongoose.connection.name}`);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Error during connection attempt:', error.message);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
