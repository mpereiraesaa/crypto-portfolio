import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);
let dbInstance: MongoClient;

export const connectToDatabase = async (): Promise<MongoClient> => {
  try {
    if (!dbInstance) {
      await client.connect();
      dbInstance = client;
      console.log('Successfully connected to MongoDB.');
    }
    return dbInstance;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const getDbInstance = (): MongoClient => {
  if (!dbInstance) {
    throw new Error('No database instance found. Please connect to MongoDB first.');
  }
  return dbInstance;
};

export const getDb = () => {
  if (!dbInstance) {
    throw new Error('No database instance found. Please connect to MongoDB first.');
  }
  return dbInstance.db(dbName);
};
