import HoldingRepository from '../repositories/holdingRepository';
import Holding from '../models/holding';
import PriceOracleHandler from '../contracts/price';

class HoldingsService {
    private holdingRepository: HoldingRepository;
    private priceOracle: PriceOracleHandler;

    constructor(holdingRepository: HoldingRepository, priceOracle: PriceOracleHandler) {
        this.holdingRepository = holdingRepository;
        this.priceOracle = priceOracle;
    }

    addHolding = async (userId: string, asset: string, quantity: number): Promise<void> => {
        const existingHolding = await this.holdingRepository.getUserHolding(userId, asset);

        if (existingHolding) {
            throw new Error('Holding already exists');
        } else {
            const newHolding: Holding = { userId, asset, quantity };
            await this.holdingRepository.create(newHolding);
        }
    }

    updateHolding = async (userId: string, asset: string, newQuantity: number): Promise<void> => {
        await this.holdingRepository.updateHolding(userId, asset, newQuantity);
    }

    removeHolding = async (userId: string, asset: string): Promise<void> => {
        const existingHolding = await this.holdingRepository.getUserHolding(userId, asset);

        if (!existingHolding) {
            throw new Error('Holding already removed');
        }
        await this.holdingRepository.delete({ userId, asset: asset.toUpperCase() });
    }

    getHoldings = async (userId: string): Promise<any[]> => {
        const holdings = await this.holdingRepository.getUserHoldings(userId);
        const lol = await this.priceOracle.getPrice("BTC");
        const holdingsWithPrice = await Promise.all(holdings.map(async (holding: Holding) => ({
            ...holding,
            price: await this.priceOracle.getPrice(holding.asset),
        })));
        return holdingsWithPrice;
    }
}

export default HoldingsService;
