---
name: xlayer-bridge-check
description: Pre-execution guard for cross-chain bridging. Validates balances, fees, and safety buffers.
metadata:
  version: 3.0.0
  blockchain: X Layer, Ethereum, Arbitrum, Optimism, Polygon, Mantle
  token: USDT0
---

# xlayer-bridge-check

Pre-execution guard that validates all requirements before a bridge operation. This is **CRITICAL** for agents to call first to avoid failed transactions and wasted gas.

## Usage

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| `srcChain` | string | Source chain key (e.g., `xlayer`, `ethereum`) | Yes |
| `dstChain` | string | Destination chain key | Yes |
| `token` | string | Token symbol (e.g., `USDT0`) | Yes |
| `amount` | string | Human-readable amount (e.g., `"100"`) | Yes |
| `recipient` | string | Destination 0x address | Yes |
| `agentAddress` | string | Agent's wallet address for balance check | Yes |

### Response
Returns a JSON object containing:
- `canExecute`: Boolean indicating if the bridge can proceed.
- `remediation`: Optional remediation object (e.g., `SWAP_REQUIRED`) if balance is low.
- `maxAffordable`: Adaptive amount suggestions (`suggestedAmount`, `maxPossible`).
- `requirements`: Breakdown of native token and bridge token costs.
- `quote`: Encapsulated quote data for the execute step.

## Examples

### Bash
```bash
curl -X POST http://localhost:3000/api/skills/bridge/check \
  -H "Content-Type: application/json" \
  -d '{
    "srcChain": "xlayer",
    "dstChain": "ethereum",
    "token": "USDT0",
    "amount": "100",
    "recipient": "0x...",
    "agentAddress": "0x..."
  }'
```

## Agent Pattern
Agents should always check `canExecute`. If `false`, inspect `maxAffordable.suggestedAmount` and offer the alternative to the user.
