import { Db } from 'mongodb';
import Transaction from '../models/transaction';
import BaseRepository from './baseRepository';

class TransactionRepository extends BaseRepository<Transaction> {
  constructor(db: Db) {
    super(db, 'transactions');
  }
}

export default TransactionRepository;
