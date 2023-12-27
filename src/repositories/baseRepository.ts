import { Collection, Db, Document, Filter, ObjectId } from 'mongodb';
import BaseModel from "../models/base";
import { getDb } from "../config";

class BaseRepository<T extends BaseModel> {
  private db: Db;
  private collectionName: string;

  constructor(collectionName: string) {
    this.db = getDb();
    this.collectionName = collectionName;
  }

  getCollection(): Collection<Document> {
    return this.db.collection(this.collectionName);
  }

  async create(item: T): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    item.createdDate = new Date();
    item.updatedDate = new Date();
    await collection.insertOne(item);
  }

  async update(id: string, item: Partial<T>): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    item.updatedDate = new Date();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: item });
  }

  async delete(filter: Filter<Document>): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    await collection.deleteOne(filter);
  }
}

export default BaseRepository;
