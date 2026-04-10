# xlayer-bridge-skills v3 (Intelligent Edition)

AI Agent Omnichain Bridge Skill Pack for USDT0 / LayerZero OFT v2 with TEE-Native Signing.

## 🤖 For AI Agents & Developers

This repository is designed to be "cloned and understood" by AI agents. It provides a set of HTTP endpoints (Skills) that allow an agent to perform cross-chain bridging autonomously and safely.

### Why this is "Agent-Safe":
1.  **Pre-Execution Guards**: The `bridge-check` skill validates all requirements (balances, fees, gas) before any on-chain action is taken.
2.  **Adaptive Amounts**: If the agent's wallet is short on funds, the check skill returns a `suggestedAmount` that *is* affordable, allowing the agent to self-correct.
3.  **TEE-Native Signing**: No private keys are stored here. The server returns full transaction objects designed for `runtime.callContractSign()`.
4.  **Dynamic Buffering**: Automatically applies higher fee buffers during network congestion to prevent stuck transactions.

---

## 🛠 Project Structure

-   `SKILL.md`: The agent manifest. **Read this first** to understand the API.
-   `src/skills/`: Core logic for each skill (Check, Quote, Execute, Status, Route).
-   `src/lib/`: Reusable libraries for OFT interactions, gas estimation, and approval caching.
-   `src/config/`: Chain metadata, EIDs, and token addresses.

---

## 🚀 Deployment

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in the RPC URLs. Note: Public and private RPCs are supported.

### 2. Run Locally
```bash
npm install
npm start
```

### 3. Deploy to Vercel
This project is configured for one-click deployment to Vercel.

---

## 🧠 Integration Example (ElizaOS / Antigravity)

When integrating this pack, follow this core loop:

```javascript
// Step 1: ALWAYS Validate first
const check = await fetchSkill('/api/skills/bridge/check', { ...params });

if (!check.canExecute) {
  if (check.maxAffordable.maxPossible > 0) {
    // Proactively suggest the lower amount
    return say(`I can't bridge the full amount, but I can bridge ${check.maxAffordable.suggestedAmount} USDT0. Shall I?`);
  }
  return say(`Bridge failed validation: ${check.reason}. ${check.recommendations[0]}`);
}

// Step 2: Execute
const exec = await fetchSkill('/api/skills/bridge/execute', { ...params, quoteData: check.quote });

// Step 3: Sign (TEE Runtime)
const txResult = await runtime.callContractSign(exec.tx);

// Step 4: Poll Status
let status = "PENDING";
while (status !== "DELIVERED") {
  await sleep(15000);
  const res = await fetchSkill(`/api/skills/bridge/status?txHash=${txResult.txHash}&srcChain=${src}`);
  status = res.status;
  if (status === "FAILED") throw new Error(res.instruction);
}
```

---

## 🛡 Security & Verification

-   **Zero Key Exposure**: All signing is delegated to the caller.
-   **Atomic Quotes**: Slippage protection is built-in using `minAmountOut`.
-   **Verified Chains**: Supports X Layer, Ethereum, Arbitrum, Optimism, Polygon, and Mantle.

---

*xlayer-bridge-skills v3 · Ready for Deployment*
