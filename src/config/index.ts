import Web3 from 'web3';
import { Db, MongoClient } from 'mongodb';
import { Asset } from "./types";
import { feeds } from "./feeds.json";

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri);
let dbInstance: MongoClient;
let web3Instance: Web3;

export const web3Connection = (): Web3 => {
  try {
    if (!web3Instance) {
      web3Instance = new Web3(process.env.WEB3_RPC_URL);
    }
    return web3Instance;
  } catch (error) {
    console.error('Failed to connect to web3 network', error);
    throw error;
  }
};

export const databaseConnection = async (): Promise<Db> => {
  try {
    if (!dbInstance) {
      await client.connect();
      dbInstance = client;
      console.log('Successfully connected to MongoDB.');
    }
    return dbInstance.db(dbName);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const supportedAssets = (): Asset[] => {
  return feeds.map(({ assetName, baseAsset }: any) => ({ assetName, baseAsset }));
}
