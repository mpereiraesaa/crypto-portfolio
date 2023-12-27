import Holding from '../models/holding';
import BaseRepository from './baseRepository';

class HoldingRepository extends BaseRepository<Holding> {
  constructor() {
    super('holdings');
  }
}

export default HoldingRepository;
