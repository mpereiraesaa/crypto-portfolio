import { Db } from 'mongodb';
import Holding from '../models/holding';
import BaseRepository from './baseRepository';

class HoldingRepository extends BaseRepository<Holding> {
  constructor(db: Db) {
    super(db, 'holdings');
  }
  updateHolding = async (userId: string, asset: string, quantity: number) => {
    const collection = this.getCollection();
    await collection.updateOne(
      { userId: userId, asset: asset.toUpperCase() },
      { $set: { quantity, updatedAt: new Date() } },
      { upsert: true }
    );
  }
  getUserHoldings = async (userId: string): Promise<Holding[]> => {
    const collection = this.getCollection();
    const data = await collection.find<Holding>({ userId }).toArray();
    return data;
  }
  getUserHolding = async (userId: string, asset: string): Promise<Holding | null> => {
    const collection = this.getCollection();
    const data = await collection.findOne<Holding>({ userId, asset: asset.toUpperCase() });
    return data;
  }
}

export default HoldingRepository;
