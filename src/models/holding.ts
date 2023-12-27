import BaseModel from "./base";

interface Holding extends BaseModel {
    userId: string;
    assetId: string;
    quantity: number;
}

export default Holding;
