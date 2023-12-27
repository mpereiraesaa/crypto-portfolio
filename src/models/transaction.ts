import BaseModel from "./base";

type TxType = "buy" | "sell";

interface Transaction extends BaseModel {
    userId: string;
    type: TxType;
    assetId: string;
    quantity: number;
    price: number;
    timestamp: Date;
}

export default Transaction;
