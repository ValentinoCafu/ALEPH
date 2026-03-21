# ⚖️ AI Arbitration — GenLayer Hackathon

> Decentralized AI-powered dispute resolution on GenLayer Bradbury Testnet.
> Multiple LLM validators reach consensus via Optimistic Democracy.

![GenLayer](https://img.shields.io/badge/GenLayer-Bradbury_Testnet-violet)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)

---

## 🏗️ Architecture

```
Frontend (HTML/JS)
      ↓ REST
Backend (FastAPI)
      ↓ JSON-RPC
GenLayer Bradbury Testnet
      ↓ Intelligent Contract
Validator Network → each calls own LLM → Optimistic Democracy → On-chain Verdict
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- GenLayer Studio account: https://studio.genlayer.com
- Test tokens from the Bradbury faucet

---

### Step 1 — Deploy the Contract

```bash
cd contracts
pip install genlayer python-dotenv
cp ../backend/.env.example ../backend/.env
# Edit .env and add your PRIVATE_KEY
python deploy.py
# Copy the contract address to your .env file
```

Or deploy manually in GenLayer Studio:
1. Go to https://studio.genlayer.com
2. Upload `contracts/ai_arbitration.py`
3. Click Deploy
4. Copy the address to `backend/.env`

---

### Step 2 — Start the Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in PRIVATE_KEY and CONTRACT_ADDRESS
uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

> **Note:** If you don't configure a contract, the backend runs in **Mock Mode** — great for UI testing.

---

### Step 3 — Open the Frontend

```bash
open frontend/index.html
# or just double-click the file
```

The UI connects to `http://localhost:8000` by default.

---

## 📁 Project Structure

```
ai-arbitration/
├── contracts/
│   ├── ai_arbitration.py   ← GenLayer Intelligent Contract
│   └── deploy.py           ← Deployment script
├── backend/
│   ├── main.py             ← FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── index.html          ← Single-file UI (no build step)
└── demo/
    └── demo_scenario.md    ← Pre-written demo for judges
```

---

## 🔄 Dispute Flow

```
1. createDispute(claimant, respondent, title, description)
2. submitEvidence(dispute_id, "claimant",  evidence_text)
3. submitEvidence(dispute_id, "respondent", evidence_text)
4. resolveDispute(dispute_id)
   └── GenLayer validators → call_llm_with_principle(prompt)
       Each validator uses their own LLM
       Optimistic Democracy → consensus verdict
       Result stored on-chain: verdict + reason + confidence
5. getDispute(dispute_id) → read final verdict
```

---

## 🤖 How AI Consensus Works

GenLayer's validators each run the `resolveDispute` function independently.
Each validator calls `call_llm_with_principle(prompt, principle)` with their own AI model.
If the majority of validators return the same verdict → it's finalized on-chain.
This is **Optimistic Democracy** — no single AI controls the outcome.

Verdicts: `FAVOR_CLAIMANT` | `FAVOR_RESPONDENT` | `INCONCLUSIVE`

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/health` | Backend + contract status |
| POST   | `/disputes` | Create a new dispute |
| POST   | `/disputes/{id}/evidence` | Submit evidence |
| POST   | `/disputes/{id}/resolve` | Trigger AI resolution |
| GET    | `/disputes/{id}` | Get dispute + verdict |
| GET    | `/disputes` | List all disputes |

---

## 🎯 Demo

See [`demo/demo_scenario.md`](demo/demo_scenario.md) for the full demo script and pre-written scenarios.

---

## 👥 Team

Built at GenLayer Hackathon | Bradbury Testnet

---

## 📄 License

MIT
