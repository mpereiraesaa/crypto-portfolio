import TransactionRepository from "../repositories/transactionRepository";
import HoldingRepository from "../repositories/holdingRepository";
import { DEFAULT_QUOTE_CRYPTOCURRENCY, MAX_SLIPPAGE } from "../config/constants";
import { TRANSACTION_TYPE } from "../config/types";
import PriceOracleHandler from "../contracts/price";
import UniswapHandler from "../contracts/uniswap";

class TransactionsService {
  private transactionRepository: TransactionRepository;
  private holdingRepository: HoldingRepository;
  private priceOracle: PriceOracleHandler;
  private uniswapHandler: UniswapHandler;

  constructor(
    transactionRepository: TransactionRepository,
    holdingRepository: HoldingRepository,
    priceOracle: PriceOracleHandler,
    uniswapHandler: UniswapHandler
  ) {
    this.transactionRepository = transactionRepository;
    this.holdingRepository = holdingRepository;
    this.priceOracle = priceOracle;
    this.uniswapHandler = uniswapHandler;
  }

  placeBuy = async (userId: string, asset: string, quantity: number): Promise<void> => {
    await this.placeTransaction(TRANSACTION_TYPE.BUY, userId, asset, quantity);
  }

  placeSell = async (userId: string, asset: string, quantity: number): Promise<void> => {
    await this.placeTransaction(TRANSACTION_TYPE.SELL, userId, asset, quantity);
  }

  placeTransaction = async (type: TRANSACTION_TYPE, userId: string, asset: string, quantity: number): Promise<void> => {
    const userAssetBalance = await this.holdingRepository.getUserHolding(userId, asset);
    const userQuoteBalance = await this.holdingRepository.getUserHolding(userId, DEFAULT_QUOTE_CRYPTOCURRENCY);
    const oraclePrice = Number(await this.priceOracle.getPrice(asset));
    let amountInUSDC;
    let effectivePricePerUnit;

    if (type === TRANSACTION_TYPE.BUY) {
      amountInUSDC = Number(await this.uniswapHandler.calculateAmountIn(asset, quantity));
      effectivePricePerUnit = amountInUSDC / quantity;
      const limitTolerancePrice = oraclePrice * (1 + (MAX_SLIPPAGE / 100));

      if (effectivePricePerUnit > limitTolerancePrice) {
        throw new Error("Price exceeds the maximum slippage tolerance.");
      }

      if (!userQuoteBalance || Number(userQuoteBalance.quantity) < amountInUSDC) {
        throw new Error(`Insufficient ${DEFAULT_QUOTE_CRYPTOCURRENCY} balance to complete the purchase.`);
      }

      await this.holdingRepository.updateHolding(userId, asset, Number(userAssetBalance?.quantity || 0) + quantity);
      await this.holdingRepository.updateHolding(
        userId,
        DEFAULT_QUOTE_CRYPTOCURRENCY,
        userQuoteBalance.quantity - amountInUSDC
      );
    } else if (type === TRANSACTION_TYPE.SELL) {
      amountInUSDC = Number(await this.uniswapHandler.calculateAmountOut(asset, quantity));
      effectivePricePerUnit = amountInUSDC / quantity;
      const limitTolerancePrice = oraclePrice * (1 - MAX_SLIPPAGE / 100);

      if (effectivePricePerUnit < limitTolerancePrice) {
        throw new Error("Price is below the minimum slippage tolerance.");
      }

      if (!userAssetBalance || userAssetBalance.quantity < quantity) {
        throw new Error("Insufficient asset balance to complete the sale.");
      }

      await this.holdingRepository.updateHolding(userId, asset, userAssetBalance.quantity - quantity);
      await this.holdingRepository.updateHolding(
        userId,
        DEFAULT_QUOTE_CRYPTOCURRENCY,
        Number(userQuoteBalance?.quantity || 0) + amountInUSDC
      );
    }

    const transactionData = {
      userId,
      type,
      asset,
      quantity,
      price: Number(effectivePricePerUnit),
      timestamp: new Date()
    };
    await this.transactionRepository.create(transactionData);
  }
}

export default TransactionsService;
