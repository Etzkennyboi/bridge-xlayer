const { ethers } = require('ethers');
const { getProvider } = require('./oft');

// USD price feeds (simplified — use Chainlink in production)
const NATIVE_PRICES_USD = {
  1: 3500,      // ETH
  196: 50,      // OKB
  42161: 3500,  // ETH
  10: 3500,     // ETH
  137: 0.65,    // MATIC
  5000: 0.80,   // MNT
};

class GasEstimator {
  /**
   * Estimate gas cost in native token and USD
   */
  async estimateGasCost(chainKey, txType = 'send') {
    const { getChain } = require('../config/chains');
    const chain = getChain(chainKey);
    const provider = getProvider(chain.rpc);
    
    // Get current gas price
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;
    
    // Get gas units from config
    const gasUnits = txType === 'approve' 
      ? chain.gasConfig.approvalGas 
      : chain.gasConfig.sendGas;
    
    // Calculate cost safely
    const gasCostWei = gasPrice.mul(gasUnits.toString());
    const gasCostEth = ethers.utils.formatEther(gasCostWei);
    const gasCostUsd = parseFloat(gasCostEth) * NATIVE_PRICES_USD[chain.chainId];
    
    // Determine congestion level
    const congestionLevel = this.calculateCongestion(feeData, chain.chainId);
    const recommendedBuffer = congestionLevel > chain.gasConfig.congestionThreshold
      ? chain.gasConfig.highBuffer
      : chain.gasConfig.lowBuffer;
    
    return {
      gasPrice: gasPrice.toString(),
      gasUnits,
      gasCostWei: gasCostWei.toString(),
      gasCostFormatted: `${gasCostEth} ${chain.nativeSymbol}`,
      gasCostUsd: `$${gasCostUsd.toFixed(4)}`,
      congestionLevel,
      recommendedBuffer,
      bufferType: congestionLevel > chain.gasConfig.congestionThreshold ? 'high' : 'low',
    };
  }
  
  calculateCongestion(feeData, chainId) {
    // Simplified congestion calculation
    // In production, use historical gas price data
    const gasPriceGwei = parseFloat(ethers.utils.formatUnits(
      feeData.maxFeePerGas || feeData.gasPrice, 
      'gwei'
    ));
    
    // Normalize to 0-1 scale based on chain-specific thresholds
    const thresholds = {
      1: 50,      // ETH mainnet
      196: 0.1,   // X Layer
      42161: 0.5, // Arbitrum
      10: 0.1,    // Optimism
      137: 100,   // Polygon
      5000: 0.05, // Mantle
    };
    
    const threshold = thresholds[chainId] || 1;
    return Math.min(gasPriceGwei / threshold, 1);
  }
  
  /**
   * Apply dynamic buffer to native fee
   */
  applyFeeBuffer(nativeFee, bufferMultiplier) {
    return ethers.BigNumber.from(nativeFee)
      .mul(Math.floor(bufferMultiplier * 100))
      .div(100);
  }
  
  /**
   * Calculate total native needed for bridge
   */
  async calculateTotalNativeNeeded(chainKey, nativeFee, includeGas = true) {
    const { getChain } = require('../config/chains');
    const chain = getChain(chainKey);
    
    const feeWithBuffer = this.applyFeeBuffer(nativeFee, chain.gasConfig.lowBuffer);
    
    if (!includeGas) return feeWithBuffer;
    
    const gasEstimate = await this.estimateGasCost(chainKey, 'send');
    return ethers.BigNumber.from(feeWithBuffer).add(gasEstimate.gasCostWei);
  }
}

module.exports = new GasEstimator();
