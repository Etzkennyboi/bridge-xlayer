# xlayer-bridge-skills — Agent Instructions

This is an **onchainos-compatible skill collection** for cross-chain USDT0 bridging using LayerZero OFT v2.

## Available Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `xlayer-bridge-check` | Pre-flight validation, balance check, fee estimation | **MANDATORY** before any bridge. Use when user wants to bridge tokens. |
| `xlayer-bridge-quote` | Real-time quote for bridging | Use to get fee estimates independently of the execution flow. |
| `xlayer-bridge-execute` | Transaction builder for transfers | Use to generate the transaction payload for TEE signing. |
| `xlayer-bridge-status` | Tracking delivery status | Use after broadcasting a bridge tx to monitor completion. |
| `xlayer-bridge-route` | Route selection intelligence | Use when user asks for the "best/cheapest" way to move funds. |

## Agent Flow Guidelines

1. **Safety First**: Always call `xlayer-bridge-check` before `xlayer-bridge-execute`.
2. **Handle Approvals**: When bridging from Ethereum, expect a two-step process. First sign the `approve` tx, then the `send` tx.
3. **Adaptive UI**: If `canExecute` is false, use the `suggestedAmount` from the check skill to inform the user of what *is* possible.
4. **TEE Signing**: All `tx` objects returned by the execution skill should be passed directly to the runtime's signing primitive (e.g., `callContractSign`).
