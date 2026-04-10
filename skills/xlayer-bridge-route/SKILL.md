---
name: xlayer-bridge-route
description: Intelligent route selector for cross-chain transfers.
metadata:
  version: 3.0.0
---

# xlayer-bridge-route

Evaluates multiple bridge paths and selects the optimal one based on fees, speed, and reliability.

## Usage

### Parameters
| Name | Type | Description | Required |
|------|------|-------------|----------|
| `fromChain` | string | Starting chain | Yes |
| `toChainOptions` | string[] | Array of possible destination chains | Yes |
| `token` | string | Token symbol | Yes |
| `amount` | string | Human-readable amount | Yes |
| `priority` | string | Selection criteria: `cheapest`, `fastest`, `balanced` | No |

### Response
- `recommendedRoute`: Details of the best path found.
- `alternativeRoutes`: Other valid paths sorted by score.
- `savingsVsAlternative`: Competitive analysis for the agent to report to the user.
