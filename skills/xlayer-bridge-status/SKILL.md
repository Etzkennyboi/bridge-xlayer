---
name: xlayer-bridge-status
description: Track cross-chain message delivery via LayerZero Scan.
metadata:
  version: 3.0.0
---

# xlayer-bridge-status

Polls the status of a bridge transaction. Use this to monitor the progress of a transfer after the source transaction has been broadcast.

## Usage

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| `txHash` | string | Source chain transaction hash | Yes |
| `srcChain` | string | Source chain key | Yes |

### Response
- `status`: `PENDING`, `INFLIGHT`, `DELIVERED`, or `FAILED`.
- `dstTxHash`: Transaction hash on the destination chain (if delivered).
- `instruction`: Human-readable next steps for the agent.
- `retryRecommended`: Boolean suggesting if the agent should retry with higher fees.
