import TransactionRepository from '../repositories/transactionRepository';
import HoldingRepository from "../repositories/holdingRepository";
import Transaction from '../models/transaction';

class TransactionsService {
    private transactionRepository: TransactionRepository;
    private holdingRepository: HoldingRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
    }

    async transactAsset(userId: string, buyAsset: string, sellAsset: string): Promise<void> {
        const transactionData: Transaction = {
            buyAsset,
            sellAsset,
            userId,
        };
        await this.transactionRepository.create(transactionData);
    }
}

export const transactionService = new TransactionsService();
