---
name: xlayer-bridge-execute
description: Builds the transaction object for bridge execution. Supports TEE contract signing.
metadata:
  version: 3.0.0
---

# xlayer-bridge-execute

Constructs the transaction payload for cross-chain transfers. 

**Note for Ethereum**: Bridging from Ethereum requires a two-step process:
1. `step: "approve"` -> Sign and broadcast.
2. `step: "send"` -> Once approved, call execute again with `approvalDone: true`.

## Usage

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| `srcChain` | string | Source chain key | Yes |
| `dstChain` | string | Destination chain key | Yes |
| `token` | string | Token symbol | Yes |
| `amount` | string | Human-readable amount | Yes |
| `recipient` | string | Destination 0x address | Yes |
| `refundAddress` | string | Address to receive LayerZero fee refunds | Yes |
| `agentAddress` | string | Agent's wallet address | No |
| `approvalDone` | boolean | Set to true after Ethereum approval is confirmed | No |

### Response
- `tx`: The transaction object ready for `callContractSign()`.
- `step`: Current flow step (`approve` or `send`).
- `meta`: Transaction metadata (expected arrival, dynamic buffer applied).

## Examples

### Bash
```bash
curl -X POST http://localhost:3000/api/skills/bridge/execute \
  -H "Content-Type: application/json" \
  -d '{
    "srcChain": "xlayer",
    "dstChain": "optimism",
    "token": "USDT0",
    "amount": "100",
    "recipient": "0x...",
    "refundAddress": "0x..."
  }'
```
