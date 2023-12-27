import User from '../models/user';
import BaseRepository from './baseRepository';

class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }
}

export default UserRepository;
