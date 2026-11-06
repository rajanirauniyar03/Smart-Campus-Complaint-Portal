const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const envUri = process.env.MONGO_URI;

  if (envUri) {
    try {
      console.log(`Attempting to connect to configured MONGO_URI...`);
      const conn = await mongoose.connect(envUri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(` MongoDB Connected (Custom URI): ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(` Failed to connect to MONGO_URI (${err.message}). Falling back to Embedded MongoDB...`);
    }
  }

  // Try standard local MongoDB on 27017 first
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/smart_campus_complaints', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(` MongoDB Connected (Local Daemon): ${conn.connection.host}`);
    return conn;
  } catch (err) {
    // If local daemon is not running, seamlessly start MongoMemoryServer with the cached 8.2.6 binary
    console.log(` Local MongoDB daemon not running. Initializing high-performance Embedded MongoDB server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'smart_campus_complaints',
        },
        binary: {
          version: '8.2.6',
        },
      });
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(` Embedded MongoDB Active & Connected: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(` Embedded MongoDB initialization failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
