export interface Asset {
  assetName: string;
  baseAsset: string;
}
  
export enum TRANSACTION_TYPE {
  BUY = "buy",
  SELL = "sell"  
};