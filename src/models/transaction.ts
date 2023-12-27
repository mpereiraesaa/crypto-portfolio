import BaseModel from "./base";

interface Transaction extends BaseModel {
    userId: string;
    buyAsset: string;
    sellAsset: string;
    buyAssetAmount: number;
    sellAssetAmount: number;
    price: number;
    timestamp: Date;
}

export default Transaction;
