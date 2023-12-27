import Holding from '../models/holding';
import BaseRepository from './baseRepository';

class HoldingRepository extends BaseRepository<Holding> {
  constructor() {
    super('holdings');
  }
  async updateHolding(userId: string, asset: string, quantity: number) {
    const collection = this.getCollection();
    await collection.updateOne({ userId: userId, asset }, { $set: { quantity } });
  }
  async getUserHoldings(userId: string): Promise<Holding[]> {
    const collection = this.getCollection();
    const data = await collection.find<Holding>({ userId }).toArray();
    return data;
  }
}

export default HoldingRepository;
