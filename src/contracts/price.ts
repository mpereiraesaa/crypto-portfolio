import Web3 from "web3";
import { formatPrice } from "./utils";
import { feeds } from "../config/feeds.json";
import abi from "../config/oracle.abi.json";

class PriceOracleHandler {
  private web3: Web3;

  constructor(web3Instance: Web3) {
    this.web3 = web3Instance;
  }

  getPrice = async (asset: string): Promise<string> => {
    const feed: any = feeds.filter((feed: any) => feed.baseAsset.toLowerCase() === asset.toLowerCase())[0];
    const contract = new this.web3.eth.Contract(abi, feed.contractAddress);
    const decimals = parseInt(await contract.methods.decimals().call());
    const price = String(await contract.methods.latestAnswer().call());
    return formatPrice(price, decimals);
  }
}

export default PriceOracleHandler;
