import Web3 from "web3";
import {
  AlphaRouter,
  SwapOptionsSwapRouter02,
  SwapType,
} from '@uniswap/smart-order-router';
import { JsonRpcProvider } from '@ethersproject/providers';
import { TradeType, CurrencyAmount, Percent, ChainId, Token } from '@uniswap/sdk-core';
import { DEFAULT_QUOTE_CRYPTOCURRENCY, MAX_SLIPPAGE } from "../config/constants";
import { tokens } from "../config/tokens.json";

class UniswapHandler {
  private web3: Web3;

  constructor(web3Instance: Web3) {
    this.web3 = web3Instance;
  }

  getToken = (tokenInput: string) => {
    let asset = tokenInput;
    if (["BTC", "ETH"].includes(tokenInput.toUpperCase())) {
      asset = "W" + tokenInput;
    }
    return tokens.filter(
      (token: any) => token.symbol.toLowerCase() === asset.toLowerCase()
    )[0];
  }

  getQuoteConfiguration = () => {
    return this.getToken(DEFAULT_QUOTE_CRYPTOCURRENCY);
  }

  getRouter = () => {
    return new AlphaRouter({
      chainId: ChainId.MAINNET,
      provider: new JsonRpcProvider((this.web3.provider as any).clientUrl),
    });
  }

  getDefaultOptions(): SwapOptionsSwapRouter02 {
    return {
      recipient: "0x0000000000000000000000000000000000000000",
      slippageTolerance: new Percent(MAX_SLIPPAGE * 100, 10_000),
      deadline: Math.floor(Date.now() / 1000 + 1800),
      type: SwapType.SWAP_ROUTER_02,
    };
  }

  calculateAmountOut = async (tokenIn: string, quantity: number) => {
    const token0Config = this.getToken(tokenIn);
    const token1Config = this.getQuoteConfiguration();
    const router = this.getRouter();
    const options = this.getDefaultOptions();

    const token0 = new Token(ChainId.MAINNET, token0Config.address, token0Config.decimals);
    const token1 = new Token(ChainId.MAINNET, token1Config.address, token1Config.decimals);

    const route = await router.route(
      CurrencyAmount.fromRawAmount(
        token0,
        quantity * (10 ** token0.decimals)
      ),
      token1,
      TradeType.EXACT_INPUT,
      options
    );

    return route?.quote.toFixed();
  }

  calculateAmountIn = async (tokenOut: string, quantity: number) => {
    const token0Config = this.getQuoteConfiguration();
    const token1Config = this.getToken(tokenOut);
    const router = this.getRouter();
    const options = this.getDefaultOptions();

    const token0 = new Token(ChainId.MAINNET, token0Config.address, token0Config.decimals);
    const token1 = new Token(ChainId.MAINNET, token1Config.address, token1Config.decimals);

    const route = await router.route(
      CurrencyAmount.fromRawAmount(
        token1,
        quantity * (10 ** token1.decimals)
      ),
      token0,
      TradeType.EXACT_OUTPUT,
      options
    );

    return route?.quote.toFixed();
  }
}

export default UniswapHandler;
