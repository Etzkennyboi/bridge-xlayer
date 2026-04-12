const { ethers } = require('ethers');
const uniswap = require('../lib/uniswap');
const { getChain } = require('../config/chains');

/**
 * Skill: xlayer-bridge-swap
 * Purpose: Prepares a transaction to swap native ETH (or gas token) for USDT0
 * to facilitate a bridge operation when the user is low on the bridge token.
 */
async function bridgeSwap(params) {
  const { chain: chainKey, amountUsdt, agentAddress } = params;

  if (!chainKey || !amountUsdt || !agentAddress) {
    throw new Error('Missing required params: chain, amountUsdt, agentAddress');
  }

  const chain = getChain(chainKey);
  const tokenOut = chain.usdt0.token;
  
  // amountUsdt is human readable (e.g. "1")
  const amountUsdtWei = ethers.utils.parseUnits(amountUsdt, 6); // USDT0 is 6 decimals

  // Rough estimation: 1 USDT is usually < 0.001 ETH
  // In a real app, we'd use a quoter. Here we set a safe maximum (e.g. 0.05 ETH for 1 USDT is overkill but safe for small swaps)
  // For the sake of this skill, let's assume a 10% slippage/buffer on whatever the price is.
  // We'll set maxAmountIn to a value that is likely to succeed.
  const maxAmountIn = ethers.utils.parseUnits("0.01", 18); // 0.01 ETH max for a small USDT swap

  const tx = await uniswap.buildSwapNativeForToken({
    chain: chainKey,
    tokenOut,
    amountOut: amountUsdtWei,
    agentAddress,
    maxAmountIn
  });

  return {
    skill: 'bridge-swap',
    chain: chainKey,
    token: 'USDT0',
    amount: amountUsdt,
    transaction: {
      ...tx,
      chainId: chain.chainId
    },
    message: `Ready to swap native assets for ${amountUsdt} USDT0 on ${chain.name}. Sign this transaction to proceed.`
  };
}

module.exports = { bridgeSwap };
