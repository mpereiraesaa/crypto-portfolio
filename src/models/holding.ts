import BaseModel from "./base";

interface Holding extends BaseModel {
    userId: string;
    asset: string;
    quantity: number;
}

export default Holding;
