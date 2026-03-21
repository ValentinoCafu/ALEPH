"""
AI Arbitration — FastAPI Backend
Bridges the frontend with GenLayer's Bradbury Testnet.

Start:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Docs:  http://localhost:8000/docs
"""

import os
import time
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# ─── Try to import GenLayer SDK ───────────────────────────────────────────────
try:
    from genlayer import GenLayerClient

    GENLAYER_AVAILABLE = True
except ImportError:
    GENLAYER_AVAILABLE = False
    print("⚠️  genlayer SDK not installed. Running in MOCK MODE.")
    print("   Install with: pip install genlayer")

# ─── App setup ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="AI Arbitration API",
    description="Blockchain-based dispute resolution powered by GenLayer + AI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Config ──────────────────────────────────────────────────────────────────

RPC_URL = os.getenv("GENLAYER_RPC_URL", "https://studio.genlayer.com/api")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")

# Initialize client
client = None
if GENLAYER_AVAILABLE and PRIVATE_KEY and CONTRACT_ADDRESS:
    try:
        client = GenLayerClient(rpc_url=RPC_URL, private_key=PRIVATE_KEY)
        print(f"✅  Connected to GenLayer: {RPC_URL}")
        print(f"📍  Contract: {CONTRACT_ADDRESS}")
    except Exception as e:
        print(f"⚠️  Failed to connect to GenLayer: {e}")

# ─── Mock store (fallback when no contract) ──────────────────────────────────

_mock_disputes: dict = {}
_mock_counter: int = 0


def _mock_create_dispute(claimant, respondent, title, description) -> int:
    global _mock_counter
    did = _mock_counter
    _mock_disputes[str(did)] = {
        "id": did,
        "claimant": claimant,
        "respondent": respondent,
        "title": title,
        "description": description,
        "evidence": [],
        "status": "open",
        "verdict": None,
        "reason": None,
        "confidence": None,
        "timestamp_created": int(time.time()),
        "timestamp_resolved": None,
    }
    _mock_counter += 1
    return did


def _mock_resolve(dispute_id: int) -> dict:
    """Simulate AI resolution with a mock verdict."""
    import random

    d = _mock_disputes[str(dispute_id)]
    choices = ["FAVOR_CLAIMANT", "FAVOR_RESPONDENT", "INCONCLUSIVE"]
    verdict = random.choice(choices[:2])
    evidence = d.get("evidence", [])
    reason = (
        f"[MOCK MODE] Based on {len(evidence)} piece(s) of evidence, "
        f"the {verdict.split('_')[1].lower()} presented a stronger case. "
        "This is simulated — connect to GenLayer for real AI consensus."
    )
    d.update(
        {
            "status": "resolved",
            "verdict": verdict,
            "reason": reason,
            "confidence": round(random.uniform(0.6, 0.95), 2),
            "timestamp_resolved": int(time.time()),
        }
    )
    return d


# ─── Pydantic models ─────────────────────────────────────────────────────────


class CreateDisputeRequest(BaseModel):
    claimant: str
    respondent: str
    title: str
    description: str

    class Config:
        json_schema_extra = {
            "example": {
                "claimant": "Alice (Client)",
                "respondent": "Bob (Developer)",
                "title": "Incomplete Smart Contract Delivery",
                "description": "Bob agreed to deliver a staking contract by March 1st but delivered an incomplete version missing the reward calculation logic.",
            }
        }


class SubmitEvidenceRequest(BaseModel):
    party: str  # "claimant" or "respondent"
    content: str

    class Config:
        json_schema_extra = {
            "example": {
                "party": "claimant",
                "content": "Here is the original Telegram conversation where Bob confirmed the full scope including reward logic.",
            }
        }


# ─── Endpoints ───────────────────────────────────────────────────────────────


@app.get("/health")
async def health_check():
    """Check API status and contract connection."""
    return {
        "status": "ok",
        "genlayer_sdk": GENLAYER_AVAILABLE,
        "contract_address": CONTRACT_ADDRESS or "not configured",
        "mode": "live" if (client and CONTRACT_ADDRESS) else "mock",
        "rpc_url": RPC_URL,
    }


@app.post("/disputes", status_code=201)
async def create_dispute(req: CreateDisputeRequest):
    """Create a new dispute on GenLayer (or mock)."""
    if client and CONTRACT_ADDRESS:
        try:
            tx = client.contract(CONTRACT_ADDRESS).write(
                "create_dispute",
                req.claimant,
                req.respondent,
                req.title,
                req.description,
            )
            return {
                "success": True,
                "tx_hash": tx.hash,
                "message": "Dispute created on-chain",
                "mode": "live",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Mock mode
        dispute_id = _mock_create_dispute(
            req.claimant, req.respondent, req.title, req.description
        )
        return {
            "success": True,
            "dispute_id": dispute_id,
            "message": "Dispute created (MOCK MODE — no contract configured)",
            "mode": "mock",
        }


@app.post("/disputes/{dispute_id}/evidence")
async def submit_evidence(dispute_id: int, req: SubmitEvidenceRequest):
    """Submit evidence for a dispute."""
    if req.party not in ("claimant", "respondent"):
        raise HTTPException(
            status_code=400, detail="party must be 'claimant' or 'respondent'"
        )

    if client and CONTRACT_ADDRESS:
        try:
            tx = client.contract(CONTRACT_ADDRESS).write(
                "submit_evidence", dispute_id, req.party, req.content
            )
            return {
                "success": True,
                "tx_hash": tx.hash,
                "message": "Evidence submitted on-chain",
                "mode": "live",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        key = str(dispute_id)
        if key not in _mock_disputes:
            raise HTTPException(
                status_code=404, detail=f"Dispute {dispute_id} not found"
            )
        _mock_disputes[key]["evidence"].append(
            {"party": req.party, "content": req.content}
        )
        return {
            "success": True,
            "message": "Evidence submitted (MOCK MODE)",
            "mode": "mock",
        }


@app.post("/disputes/{dispute_id}/resolve")
async def resolve_dispute(dispute_id: int):
    """
    Trigger AI resolution.
    GenLayer validators call their LLMs → consensus verdict stored on-chain.
    This may take 30–60 seconds on the testnet.
    """
    if client and CONTRACT_ADDRESS:
        try:
            tx = client.contract(CONTRACT_ADDRESS).write("resolve_dispute", dispute_id)
            # Wait for the transaction to be finalized
            result = client.wait_for_transaction(tx.hash, timeout=120)
            return {
                "success": True,
                "tx_hash": tx.hash,
                "result": result,
                "message": "Dispute resolved via AI consensus",
                "mode": "live",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        key = str(dispute_id)
        if key not in _mock_disputes:
            raise HTTPException(
                status_code=404, detail=f"Dispute {dispute_id} not found"
            )
        if _mock_disputes[key]["status"] == "resolved":
            raise HTTPException(status_code=400, detail="Dispute already resolved")
        resolved = _mock_resolve(dispute_id)
        return {
            "success": True,
            "dispute": resolved,
            "message": "Dispute resolved (MOCK MODE — simulated AI verdict)",
            "mode": "mock",
        }


@app.get("/disputes/{dispute_id}")
async def get_dispute(dispute_id: int):
    """Get dispute details including verdict if resolved."""
    if client and CONTRACT_ADDRESS:
        try:
            data = client.contract(CONTRACT_ADDRESS).read("get_dispute", dispute_id)
            return data
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        key = str(dispute_id)
        if key not in _mock_disputes:
            raise HTTPException(
                status_code=404, detail=f"Dispute {dispute_id} not found"
            )
        return _mock_disputes[key]


@app.get("/disputes")
async def get_all_disputes():
    """List all disputes."""
    if client and CONTRACT_ADDRESS:
        try:
            data = client.contract(CONTRACT_ADDRESS).read("get_all_disputes")
            return {"disputes": data, "mode": "live"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        return {"disputes": list(_mock_disputes.values()), "mode": "mock"}
