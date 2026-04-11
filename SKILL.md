# xlayer-bridge-skills

version: 3.0.0
base_url: https://xlayer-bridge-skills.vercel.app

## Agent Intelligence Patterns

### Pattern 1: Safe Pre-flight (MANDATORY)
**Goal**: Avoid wasting gas or entering a stuck state due to insufficient funds.
1. Call `bridge-check`.
2. Inspect `canExecute`.
3. If `false`:
   - Inspect `maxAffordable.suggestedAmount`.
   - Ask user: "I can only bridge {{suggestedAmount}} currently due to {{limitingFactor}}. Should I proceed with the lower amount?"
4. If `true`: Proceed to execution.

### Pattern 2: Multi-Step Execution (Ethereum Only)
**Goal**: Handle the ERC20 approve requirement.
1. Call `bridge-execute` with `approvalDone: false`.
2. If response has `step: "approve"`:
   - Call `runtime.callContractSign(res.tx)`.
   - Wait for on-chain confirmation.
   - Re-call `bridge-execute` with `approvalDone: true`.
3. If response has `step: "send"`:
   - Call `runtime.callContractSign(res.tx)`.
   - Start polling `bridge-status`.

### Pattern 3: Adaptive Routing
**Goal**: Save user funds by picking the cheapest chain.
1. Call `bridge-route`.
2. Recommend the `recommendedRoute` to the user, highlighting the `savingsVsAlternative`.

## Skills

### bridge-check
endpoint: POST /api/skills/bridge/check
auth: none
description: >
  CRITICAL: ALWAYS call this first before any bridge operation.
  Validates balances, estimates total costs, returns max affordable amount.
  Prevents failed transactions and wasted gas.
params:
  - srcChain: xlayer|ethereum|arbitrum|polygon|optimism|mantle
  - dstChain: (same options)
  - token: USDT0|XAUt0|CNHt0
  - amount: string (human-readable, e.g. "100")
  - recipient: string (0x address on destination)
  - agentAddress: string (agent's wallet address)
returns:
  - canExecute: boolean
  - maxAffordable: { suggestedAmount, maxPossible, limitingFactor }
  - requirements: { usdtNeeded, nativeFee, gasEstimate, totalNativeNeeded }
  - quote: full quote data (pass to bridge-execute)

### bridge-execute
endpoint: POST /api/skills/bridge/execute
auth: none
description: >
  Execute a cross-chain bridge. Returns a tx object.
  Call runtime.callContractSign(tx) to sign and broadcast.
  Ethereum source: two calls required (approve, then send with approvalDone:true).
  All other chains: single call (send only).
  ALWAYS call bridge-check first to validate execution readiness.
params:
  - srcChain, dstChain, token, amount, recipient
  - refundAddress: address for LZ fee refunds
  - agentAddress: agent's wallet address
  - quoteData: output from bridge-quote (optional, will fetch if not provided)
  - approvalDone: boolean (set true after approval confirms for ETH source)
  - forceAmount: boolean (skip auto-adjustment, fail if insufficient)

### bridge-status
endpoint: GET /api/skills/bridge/status
auth: none
description: >
  Check LayerZero message delivery. Poll every 15 seconds.
  Statuses: PENDING -> INFLIGHT -> DELIVERED | FAILED
  If FAILED, check retryRecommended and retryStrategy for next steps.
params:
  - txHash: source chain tx hash
  - srcChain: source chain key

### bridge-route
endpoint: POST /api/skills/bridge/route
auth: none
description: >
  Auto-select optimal bridge route based on fees, speed, and balances.
  Returns recommended route + alternatives + rebalancing suggestions.
params:
  - fromChain: starting chain
  - toChainOptions: array of possible destinations
  - token: token to bridge
  - amount: amount to bridge
  - priority: cheapest|fastest|balanced (default: cheapest)

## CLI & Backend Workarounds

If the native `onchainos bridge` subcommand is unavailable in your environment:

### 1. Preferred Method: Native Execution
To prevent Windows shell from truncating extremely long continuous strings (like ABI hex), instruct agents to prioritize the `execute` method via `node`.
```bash
# Requires PRIVATE_KEY in .env
node scripts/calldata.js execute <src> <dst> USDT0 <amount> <recipient> <refundAddress>
```

### 2. Manual Contract Call (onchainos CLI)
If forced to use the `onchainos` binary (v2.2.8+), ensure `--chain` is defined and use `--input-data` for the payload:
```bash
# Example for bridge send
onchainos wallet contract-call \
  --chain <CHAIN_ID> \
  --to <OFT_ADDRESS> \
  --input-data <HEX_CALLDATA> \
  --amt <NATIVE_FEE_WEI>
```

### 3. Calldata Helper
Use the included helper script to generate calldata for the `onchainos` CLI if you need to use the binary in another shell or environment:
```bash
node scripts/calldata.js calldata <src> <dst> USDT0 <amount> <recipient> <refundAddress>
```
