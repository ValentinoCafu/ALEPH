# Demo Scenario — AI Arbitration Hackathon

Use this pre-written scenario to guarantee a smooth live demo.

---

## Scenario: Freelance Dev Dispute

### Dispute Details
- **Claimant:** Alice (Software Client)
- **Respondent:** Bob (Freelance Developer)
- **Title:** Incomplete Smart Contract Delivery
- **Description:** Alice hired Bob for $2,000 to build a staking contract with full reward calculation logic. Bob delivered a contract on time, but the reward calculation function was completely missing, making the contract non-functional for its intended purpose.

### Evidence — Claimant (Alice)
> "I have a Telegram conversation from March 5th where Bob confirmed the full scope: 'I will implement the full staking logic including APY rewards.' The delivered contract has no reward function — I can prove this by reading the contract source code at 0x123abc. I also have the original invoice Bob sent me listing 'reward calculation module' as a deliverable."

### Evidence — Respondent (Bob)
> "I delivered a fully working ERC-20 staking contract before the agreed deadline. The reward calculation was discussed verbally but was NOT in the written scope document we both signed on February 15th. I only agreed to implement the staking deposit and withdrawal mechanism. The invoice the claimant references was a preliminary quote, not the final signed agreement."

---

## Demo Script (8 minutes)

1. **Intro (1 min):** "Imagine you hired a developer for $2,000 and they delivered incomplete work. Traditionally: lawyers, months of waiting, high costs. With AI Arbitration on GenLayer: resolution in under 60 seconds, permanently on-chain."

2. **Show contract in GenLayer Studio (1 min):** Open the deployed contract. Point to the `call_llm_with_principle()` call. "This is what makes GenLayer special — the AI call happens inside the contract."

3. **Create dispute (1.5 min):** Fill the form and submit. Show the transaction hash.

4. **Submit evidence (2 min):** Submit Alice's evidence, then Bob's. Show both added.

5. **Trigger resolution (2 min):** Click "Resolve with AI". Show loading state. "Right now, multiple validators are each querying a different LLM with this exact evidence."

6. **Show verdict (0.5 min):** Verdict appears. Point out: verdict, reason, confidence score.

7. **Verify on-chain (1 min):** Open GenLayer explorer, paste the tx hash. "Permanently immutable. No single entity decided this."

---

## Fallback Plan

If the testnet is slow or down:
1. Use the frontend in MOCK MODE (backend works without contract)
2. Show the architecture diagram and explain how it works
3. Have a pre-recorded 2-minute video as last resort

---

## Key Talking Points for Judges

- "We didn't build the consensus mechanism — GenLayer's Optimistic Democracy gives it to us"
- "Each validator uses a different AI model — no single point of failure"
- "The verdict is on-chain: auditable, immutable, trustless"
- "Use cases: freelance disputes, DAO governance, NFT marketplace conflicts, DeFi protocol disagreements"
- "This is the foundation — imagine DAOs adopting this as their default governance tool"
