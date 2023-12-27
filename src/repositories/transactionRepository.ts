import Transaction from '../models/transaction';
import BaseRepository from './baseRepository';

class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super('transactions');
  }
}

export default TransactionRepository;
