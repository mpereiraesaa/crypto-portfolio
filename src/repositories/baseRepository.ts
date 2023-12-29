import { Collection, Db, Document, Filter, ObjectId } from 'mongodb';
import BaseModel from "../models/base";

class BaseRepository<T extends BaseModel> {
  private db: Db;
  private collectionName: string;

  constructor(db: Db, collectionName: string) {
    this.db = db;
    this.collectionName = collectionName;
  }

  getCollection = (): Collection<Document> => {
    return this.db.collection(this.collectionName);
  }

  create = async (item: T): Promise<Document> => {
    const collection = this.db.collection(this.collectionName);
    item.updatedAt = new Date();
    return await collection.insertOne(item);
  }

  update = async (id: string, item: Partial<T>): Promise<void> => {
    const collection = this.db.collection(this.collectionName);
    item.updatedAt = new Date();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: item });
  }

  delete = async (filter: Filter<Document>): Promise<void> => {
    const collection = this.db.collection(this.collectionName);
    await collection.deleteOne(filter);
  }
}

export default BaseRepository;
