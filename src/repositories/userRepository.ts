import { Db } from 'mongodb';
import User from '../models/user';
import BaseRepository from './baseRepository';

class UserRepository extends BaseRepository<User> {
  constructor(db: Db) {
    super(db, 'users');
  }
  findByEmail = (email: string): Promise<User | null> => {
    return this.getCollection().findOne<User>({email: email});
  }
}

export default UserRepository;
