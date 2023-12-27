import path from 'path';
import fs from 'fs';
import HoldingRepository from '../repositories/holdingRepository';
import Holding from '../models/holding';

export interface Asset {
    assetName: string;
    baseAsset: string;
}

class HoldingsService {
    private holdingRepository: HoldingRepository;
    private supportedAssets: Asset[];

    constructor() {
        this.holdingRepository = new HoldingRepository();

        const filePath = path.join(__dirname, '../config/feeds.json');
        const data = fs.readFileSync(filePath, 'utf8');
        const assets = JSON.parse(data) as Asset[];
        this.supportedAssets = assets.map(({ assetName, baseAsset }) => ({ assetName, baseAsset }));
    }

    getSupportedAssets(): Asset[] {
        return this.supportedAssets;
    }

    async addHolding(userId: string, asset: string, quantity: number): Promise<void> {
        const newHolding: Holding = {
            userId,
            asset,
            quantity
        };
        await this.holdingRepository.create(newHolding);
    }

    async updateHolding(userId: string, asset: string, newQuantity: number): Promise<void> {
        await this.holdingRepository.updateHolding(userId, asset, newQuantity);
    }

    async removeHolding(userId: string, asset: string): Promise<void> {
        await this.holdingRepository.delete({ userId, asset });
    }

    async getHoldings(userId: string): Promise<Holding[]> {
        return this.holdingRepository.getUserHoldings(userId);
    }
}

export const holdingsService = new HoldingsService();
