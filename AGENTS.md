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
| `xlayer-bridge-swap` | Aquire USDT0 via DEX | Use when `bridge-check` suggests a swap remediation. |

## Agent Flow Guidelines

1. **Safety First**: Always call `xlayer-bridge-check` before `xlayer-bridge-execute`.
2. **Handle Remediations**: If `bridge-check` returns `canExecute: false` with a `remediation` of type `SWAP_REQUIRED`:
   - Call `xlayer-bridge-swap` using the provided `params`.
   - Sign and broadcast the swap transaction.
   - Once the swap is confirmed, re-run `xlayer-bridge-check` to confirm the new balance.
3. **Handle Approvals**: When bridging from Ethereum, expect a two-step process. First sign the `approve` tx, then the `send` tx.
4. **Adaptive UI**: If `canExecute` is false and no swap is possible, use the `suggestedAmount` from the check skill to inform the user of what *is* possible.
5. **TEE Signing**: All `tx` objects returned by the execution skill should be passed directly to the runtime's signing primitive (e.g., `callContractSign`).
