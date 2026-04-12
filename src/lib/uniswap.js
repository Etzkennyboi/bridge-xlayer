const { ethers } = require('ethers');

// Uniswap V3 SwapRouter02 Address (Generic for many chains)
const SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

// Simplified ABI for SwapRouter02
const SWAP_ROUTER_ABI = [
  'function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)'
];

// Token addresses (Mainnet examples, should be configurable)
const WETH = {
  ethereum: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  arbitrum: '0x82aF49447D8a07e3bd95BD0d56f3524152e1eFb0',
  optimism: '0x4200000000000000000000000000000000000006',
  polygon:  '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
};

class UniswapService {
  async buildSwapNativeForToken(params) {
    const { chain, tokenOut, amountOut, agentAddress, maxAmountIn } = params;

    const tokenIn = WETH[chain.toLowerCase()];
    if (!tokenIn) throw new Error(`Native token wrapping not supported for chain ${chain}`);

    const iface = new ethers.utils.Interface(SWAP_ROUTER_ABI);
    
    // fee: 3000 (0.3%) for common pairs
    const fee = 3000;
    
    const swapParams = {
      tokenIn,
      tokenOut,
      fee,
      recipient: agentAddress,
      amountOut: amountOut,
      amountInMaximum: maxAmountIn,
      sqrtPriceLimitX96: 0
    };

    const data = iface.encodeFunctionData('exactOutputSingle', [swapParams]);

    return {
      to: SWAP_ROUTER_ADDRESS,
      data,
      value: maxAmountIn.toString(),
      description: `Swap Native for ${amountOut} units of token via Uniswap V3`
    };
  }
}

module.exports = new UniswapService();
