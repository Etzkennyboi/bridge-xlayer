---
name: xlayer-bridge-swap
description: Source-chain swap utility. Converts native gas tokens (ETH/MATIC) to USDT0 to fund a bridge.
metadata:
  version: 3.1.0
  blockchain: X Layer, Ethereum, Arbitrum, Optimism, Polygon
  token: USDT0
---

# xlayer-bridge-swap

This skill helps agents acquire USDT0 on the source chain when their balance is insufficient for a bridge request. It uses Uniswap V3 to perform a "Native-to-USDT0" swap.

## Usage

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| `chain` | string | The chain to swap on (e.g., `ethereum`, `arbitrum`) | Yes |
| `amountUsdt` | string | How much USDT0 you need (human-readable, e.g., `"1.0"`) | Yes |
| `agentAddress` | string | The wallet address performing the swap | Yes |

### Response
Returns a transaction object that the agent must sign:
- `transaction`: Standard EVM transaction (`to`, `data`, `value`, `chainId`).
- `message`: Contextual message for the agent's user.

## Agent Flow
1. Call `xlayer-bridge-check`.
2. If USDT balance is low, call `xlayer-bridge-swap` with the requested amount.
3. Sign and broadcast the returned transaction.
4. After confirmation, re-check and execute the bridge.
