# xlayer-bridge-skills v3

OnChain OS-compatible skills for AI agents to perform intelligent, cross-chain USDT0 bridging using LayerZero OFT v2.

## Available Skills

| Skill | Description |
|-------|-------------|
| `xlayer-bridge-check` | Pre-execution guard: validates balances, fees, and safety buffers. |
| `xlayer-bridge-quote` | Real-time on-chain quotes for bridging fees and arrival amounts. |
| `xlayer-bridge-execute` | Transaction builder for TEE-native signing. |
| `xlayer-bridge-status` | Polling and tracking of cross-chain message delivery. |
| `xlayer-bridge-route` | Intelligent route selection based on cost, speed, and reliability. |
| `xlayer-bridge-swap` | **NEW**: Acquires USDT0 via Uniswap V3 when balance is low. |

## Intelligent Remediation
This skill pack features **Intelligent Remediation**. If `xlayer-bridge-check` detects that your USDT0 balance is insufficient but your Native balance (ETH/MATIC) is healthy, it will provide a structured `remediation` object. This tells the agent to use `xlayer-bridge-swap` to acquire the necessary funds before bridging.

## Supported Chains
X Layer, Ethereum, Arbitrum, Optimism, Polygon, and Mantle.

## Prerequisites
- Node.js 16+
- RPC URLs for the chains you intend to use.

Recommended: Create a `.env` file in your project root:

```bash
ETH_RPC="your-rpc-url"
XLAYER_RPC="your-rpc-url"
# ... and so on
```

**Security warning**: Never commit `.env` to git and never expose RPC URLs with embedded keys.

## Recommended Install
```bash
git clone https://github.com/Etzkennyboi/fast-bridge-xlayer
cd fast-bridge-xlayer
npm install
npm start
```

## Agent Examples

The skills work together in a robust bridging loop:

**Intelligent Pre-flight**: `xlayer-bridge-check` (validate) -> `xlayer-bridge-execute` (get tx) -> `SignTx` (user/TEE) -> `xlayer-bridge-status` (monitor)

**Routing Intelligence**: `xlayer-bridge-route` (compare) -> `xlayer-bridge-check` (verify) -> `xlayer-bridge-execute` (transfer)

## License
MIT
