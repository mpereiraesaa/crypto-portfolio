import BaseModel from "./base";

interface Transaction extends BaseModel {
    userId: string;
    type: "buy" | "sell";
    asset: string;
    quantity: number;
    price: number;
    timestamp: Date;
}

export default Transaction;
