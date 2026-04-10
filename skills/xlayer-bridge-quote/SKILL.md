---
name: xlayer-bridge-quote
description: Get a real-time bridge quote including fees and expected arrival amounts.
metadata:
  version: 3.0.0
  blockchain: X Layer, Ethereum, Arbitrum, Optimism, Polygon, Mantle
---

# xlayer-bridge-quote

Fetches an on-chain quote from the LayerZero OFT contract. Returns the estimated native fee and the minimum amount expected on the destination chain.

## Usage

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| `srcChain` | string | Source chain key | Yes |
| `dstChain` | string | Destination chain key | Yes |
| `token` | string | Token symbol | Yes |
| `amount` | string | Human-readable amount | Yes |
| `recipient` | string | Destination 0x address | Yes |

### Response
- `nativeFee`: Cost in source native token wei.
- `amountOut`: Expected amount after bridge fees.
- `minAmountOut`: Guaranteed arrival amount (slippage protection).
- `sendParam`: Pre-built parameter object for the LayerZero `send()` call.

## Examples

### Bash
```bash
curl "http://localhost:3000/api/skills/bridge/quote?srcChain=xlayer&dstChain=arbitrum&token=USDT0&amount=10&recipient=0x..."
```
