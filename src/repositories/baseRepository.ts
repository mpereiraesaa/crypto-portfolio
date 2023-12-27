import { Collection, Db, Document, ObjectId } from 'mongodb';
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

  async getAll(): Promise<Document[]> {
    const collection = this.db.collection(this.collectionName);
    const data = await collection.find().toArray();
    return data;
  }
}

export default BaseRepository;
