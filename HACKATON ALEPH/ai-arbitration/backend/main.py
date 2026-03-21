"""
AI Arbitration — FastAPI Backend
Bridges the frontend with GenLayer Studio Online (Studionet).

Start:
    cd backend
    source venv/bin/activate
    pip install -r requirements.txt
    pip install genlayer-py
    uvicorn main:app --reload --port 8000

Docs:  http://localhost:8000/docs

Environment variables:
    PRIVATE_KEY: Your wallet private key (required for writing to blockchain)
    CONTRACT_ADDRESS: Deployed contract address (optional - uses mock if not set)
"""

import os
import time
import random
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# ─── GenLayer SDK Import ───────────────────────────────────────────────────────
try:
    from genlayer_py import create_client, create_account
    from genlayer_py.types import TransactionStatus

    GENLAYER_AVAILABLE = True
except ImportError:
    GENLAYER_AVAILABLE = False
    print("⚠️  genlayer-py SDK not installed. Running in MOCK MODE.")
    print("   Install with: pip install genlayer-py")

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

PRIVATE_KEY = os.getenv("PRIVATE_KEY", "")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "")
STUDIO_URL = "https://studio.genlayer.com/api"

# Initialize GenLayer client
client = None
account = None
if GENLAYER_AVAILABLE:
    try:
        if PRIVATE_KEY:
            account = create_account(PRIVATE_KEY)
            client = create_client(endpoint=STUDIO_URL, account=account)
            print(f"✅  Connected to GenLayer Studio Online")
            print(f"📍  RPC: {STUDIO_URL}")
            if CONTRACT_ADDRESS:
                print(f"📜  Contract: {CONTRACT_ADDRESS}")
        else:
            print("⚠️  No PRIVATE_KEY set. Running in read-only mode.")
            client = create_client(endpoint=STUDIO_URL)
    except Exception as e:
        print(f"⚠️  Failed to connect to GenLayer: {e}")

# ─── Mock store (fallback) ────────────────────────────────────────────────────

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
    party: str
    content: str

    class Config:
        json_schema_extra = {
            "example": {
                "party": "claimant",
                "content": "Here is the original Telegram conversation where Bob confirmed the full scope including reward logic.",
            }
        }


# ─── Helper functions ────────────────────────────────────────────────────────


def _is_live_mode() -> bool:
    return client is not None and bool(CONTRACT_ADDRESS)


def _get_dispute_from_contract(dispute_id: int) -> Optional[dict]:
    """Read a dispute from the blockchain contract."""
    if not client or not CONTRACT_ADDRESS:
        return None
    try:
        result = client.read_contract(
            address=CONTRACT_ADDRESS,
            function_name="get_dispute",
            args=[dispute_id],
        )
        return result
    except Exception as e:
        print(f"Error reading dispute {dispute_id}: {e}")
        return None


def _get_all_disputes_from_contract() -> list:
    """Read all disputes from the blockchain contract."""
    if not client or not CONTRACT_ADDRESS:
        return []
    try:
        count_result = client.read_contract(
            address=CONTRACT_ADDRESS,
            function_name="get_dispute_count",
            args=[],
        )
        count = int(count_result) if count_result else 0

        disputes = []
        for i in range(count):
            try:
                dispute = client.read_contract(
                    address=CONTRACT_ADDRESS,
                    function_name="get_dispute",
                    args=[i],
                )
                if dispute:
                    disputes.append(dispute)
            except:
                pass
        return disputes
    except Exception as e:
        print(f"Error reading all disputes: {e}")
        return []


# ─── Endpoints ───────────────────────────────────────────────────────────────


@app.get("/health")
async def health_check():
    """Check API status and contract connection."""
    live_mode = _is_live_mode()
    return {
        "status": "ok",
        "genlayer_sdk": GENLAYER_AVAILABLE,
        "chain": "bradbury" if GENLAYER_AVAILABLE else None,
        "contract_address": CONTRACT_ADDRESS or "not configured",
        "mode": "live" if live_mode else "mock",
        "rpc_url": STUDIO_URL,
        "has_private_key": bool(PRIVATE_KEY),
    }


@app.post("/disputes", status_code=201)
async def create_dispute(req: CreateDisputeRequest):
    """Create a new dispute on GenLayer (or mock)."""
    if _is_live_mode() and account:
        try:
            # Get current count before creating (this will be the new dispute ID)
            count_before = client.read_contract(
                address=CONTRACT_ADDRESS,
                function_name="get_dispute_count",
                args=[],
            )
            dispute_id = int(count_before) if count_before else 0

            tx_hash = client.write_contract(
                account=account,
                address=CONTRACT_ADDRESS,
                function_name="create_dispute",
                args=[req.claimant, req.respondent, req.title, req.description],
            )

            client.wait_for_transaction_receipt(
                transaction_hash=tx_hash,
                status=TransactionStatus.ACCEPTED,
                interval=5000,
                retries=60,
            )

            return {
                "success": True,
                "tx_hash": tx_hash,
                "dispute_id": dispute_id,
                "message": "Dispute created on-chain",
                "mode": "live",
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        dispute_id = _mock_create_dispute(
            req.claimant, req.respondent, req.title, req.description
        )
        return {
            "success": True,
            "dispute_id": dispute_id,
            "message": "Dispute created (MOCK MODE)",
            "mode": "mock",
        }


@app.post("/disputes/{dispute_id}/evidence")
async def submit_evidence(dispute_id: int, req: SubmitEvidenceRequest):
    """Submit evidence for a dispute."""
    if req.party not in ("claimant", "respondent"):
        raise HTTPException(
            status_code=400, detail="party must be 'claimant' or 'respondent'"
        )

    if _is_live_mode() and account:
        try:
            tx_hash = client.write_contract(
                account=account,
                address=CONTRACT_ADDRESS,
                function_name="submit_evidence",
                args=[dispute_id, req.party, req.content],
            )

            client.wait_for_transaction_receipt(
                transaction_hash=tx_hash,
                status=TransactionStatus.ACCEPTED,
                interval=5000,
                retries=60,
            )

            return {
                "success": True,
                "tx_hash": tx_hash,
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
            {"party": req.party, "content": req.content, "timestamp": int(time.time())}
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
    if _is_live_mode() and account:
        try:
            tx_hash = client.write_contract(
                account=account,
                address=CONTRACT_ADDRESS,
                function_name="resolve_dispute",
                args=[dispute_id],
            )

            receipt = client.wait_for_transaction_receipt(
                transaction_hash=tx_hash,
                status=TransactionStatus.ACCEPTED,
                interval=5000,
                retries=120,
            )

            dispute_data = _get_dispute_from_contract(dispute_id)

            return {
                "success": True,
                "tx_hash": tx_hash,
                "dispute": dispute_data,
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
            "message": "Dispute resolved (MOCK MODE)",
            "mode": "mock",
        }


@app.get("/disputes/{dispute_id}")
async def get_dispute(dispute_id: int):
    """Get dispute details including verdict if resolved."""
    if _is_live_mode():
        dispute = _get_dispute_from_contract(dispute_id)
        if dispute:
            return dispute
        raise HTTPException(status_code=404, detail=f"Dispute {dispute_id} not found")
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
    if _is_live_mode():
        disputes = _get_all_disputes_from_contract()
        return {"disputes": disputes, "mode": "live"}
    else:
        return {"disputes": list(_mock_disputes.values()), "mode": "mock"}


@app.get("/explorer/{tx_hash}")
async def get_transaction(tx_hash: str):
    """Get transaction details from the explorer."""
    return {
        "tx_hash": tx_hash,
        "explorer_url": f"https://explorer-bradbury.genlayer.com/tx/{tx_hash}",
    }
