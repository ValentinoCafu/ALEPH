# ============================================================
# AI Arbitration — GenLayer Intelligent Contract
# Bradbury Testnet | Hackathon MVP
# ============================================================
# Deploy via GenLayer Studio: https://studio.genlayer.com
# ============================================================

from typing import Any
import gl
import json


class AIArbitration:
    """
    AI-powered dispute resolution using GenLayer's Optimistic Democracy.

    How it works:
    - Each GenLayer validator runs this contract independently
    - Each validator calls their own LLM (GPT-4, Claude, Llama, etc.)
    - If the majority of validators agree on the verdict → it's final
    - No single AI controls the result = true decentralized consensus
    """

    disputes: dict      # str(dispute_id) -> dispute object
    dispute_count: int

    def __init__(self):
        self.disputes = {}
        self.dispute_count = 0

    # ─────────────────────────────────────────────────────────
    # WRITE FUNCTIONS
    # ─────────────────────────────────────────────────────────

    @gl.public.write
    def create_dispute(
        self,
        claimant: str,
        respondent: str,
        title: str,
        description: str
    ) -> int:
        """
        Creates a new dispute on-chain.
        Returns the dispute ID.
        """
        dispute_id = self.dispute_count
        self.disputes[str(dispute_id)] = {
            "id": dispute_id,
            "claimant": claimant,
            "respondent": respondent,
            "title": title,
            "description": description,
            "evidence": [],
            "status": "open",
            "verdict": None,
            "reason": None,
            "confidence": None,
            "timestamp_created": gl.get_block_timestamp(),
            "timestamp_resolved": None,
        }
        self.dispute_count += 1
        return dispute_id

    @gl.public.write
    def submit_evidence(
        self,
        dispute_id: int,
        party: str,
        content: str
    ) -> None:
        """
        Submits evidence for an open dispute.
        party must be "claimant" or "respondent".
        """
        key = str(dispute_id)
        assert key in self.disputes, f"Dispute {dispute_id} not found"

        d = self.disputes[key]
        assert d["status"] == "open", "Dispute is already resolved"
        assert party in ("claimant", "respondent"), \
            "party must be 'claimant' or 'respondent'"
        assert len(content.strip()) > 0, "Evidence content cannot be empty"
        assert len(d["evidence"]) < 10, "Maximum 10 evidence items per dispute"

        d["evidence"].append({
            "party": party,
            "content": content.strip()
        })

    @gl.public.write
    def resolve_dispute(self, dispute_id: int) -> str:
        """
        Triggers AI resolution via GenLayer's validator network.

        Each validator runs this function with their own LLM.
        Optimistic Democracy reaches consensus on the verdict.
        The result is stored permanently on-chain.
        """
        key = str(dispute_id)
        assert key in self.disputes, f"Dispute {dispute_id} not found"

        d = self.disputes[key]
        assert d["status"] == "open", "Dispute is already resolved"
        assert len(d["evidence"]) >= 1, \
            "At least 1 piece of evidence is required to resolve"

        # Build evidence block for the prompt
        evidence_block = "\n".join([
            f"[{e['party'].upper()}] {e['content']}"
            for e in d["evidence"]
        ])

        # ─── AI Arbitration Prompt ────────────────────────────
        # This prompt is executed by EACH validator with their own LLM.
        # The principle ensures consistent reasoning across models.
        prompt = f"""
You are an impartial AI arbitrator in a blockchain-based dispute resolution system.
Your verdict will be permanently recorded on the blockchain and cannot be changed.
Be objective, fair, and base your analysis solely on the evidence provided.

═══════════════════════════════════════════════
DISPUTE #{dispute_id}: {d['title']}
═══════════════════════════════════════════════

DESCRIPTION:
{d['description']}

PARTIES:
- Claimant: {d['claimant']}
- Respondent: {d['respondent']}

EVIDENCE SUBMITTED:
{evidence_block}

═══════════════════════════════════════════════
INSTRUCTIONS:
1. Read all evidence carefully.
2. Identify which party has the stronger case based on the evidence.
3. Consider: specificity of claims, consistency of evidence, logical coherence.
4. If evidence is genuinely equal or insufficient, choose INCONCLUSIVE.
5. Provide a clear, brief reasoning (2-3 sentences max).

IMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation outside JSON.
{{
  "verdict": "FAVOR_CLAIMANT" or "FAVOR_RESPONDENT" or "INCONCLUSIVE",
  "reason": "Your 2-3 sentence reasoning here",
  "confidence": 0.0 to 1.0
}}
"""

        principle = (
            "Be strictly impartial. Judge only the evidence provided. "
            "Do not favor any party based on their name or position. "
            "Apply principles of fairness, proportionality, and logical reasoning."
        )

        # This is the GenLayer magic — each validator calls their own LLM
        raw = gl.get_contract_runner().call_llm_with_principle(prompt, principle)

        # Parse and store the result
        try:
            result = json.loads(raw.strip())
            verdict    = result.get("verdict", "INCONCLUSIVE")
            reason     = result.get("reason", "No reason provided.")
            confidence = float(result.get("confidence", 0.5))

            # Validate verdict value
            if verdict not in ("FAVOR_CLAIMANT", "FAVOR_RESPONDENT", "INCONCLUSIVE"):
                verdict = "INCONCLUSIVE"
                reason  = f"AI returned invalid verdict. Raw: {raw[:100]}"
                confidence = 0.0

        except (json.JSONDecodeError, ValueError, TypeError):
            verdict    = "INCONCLUSIVE"
            reason     = f"AI response could not be parsed. Raw response: {raw[:200]}"
            confidence = 0.0

        # Update dispute state — this is what validators must agree on
        d["status"]             = "resolved"
        d["verdict"]            = verdict
        d["reason"]             = reason
        d["confidence"]         = round(confidence, 2)
        d["timestamp_resolved"] = gl.get_block_timestamp()

        return verdict

    # ─────────────────────────────────────────────────────────
    # READ FUNCTIONS (free, no gas)
    # ─────────────────────────────────────────────────────────

    @gl.public.read
    def get_dispute(self, dispute_id: int) -> dict:
        """Returns the full dispute object including verdict."""
        key = str(dispute_id)
        assert key in self.disputes, f"Dispute {dispute_id} not found"
        return self.disputes[key]

    @gl.public.read
    def get_all_disputes(self) -> list:
        """Returns all disputes (for UI listing)."""
        return list(self.disputes.values())

    @gl.public.read
    def get_dispute_count(self) -> int:
        """Returns total number of disputes created."""
        return self.dispute_count

    @gl.public.read
    def get_open_disputes(self) -> list:
        """Returns only unresolved disputes."""
        return [d for d in self.disputes.values() if d["status"] == "open"]

    @gl.public.read
    def get_resolved_disputes(self) -> list:
        """Returns only resolved disputes."""
        return [d for d in self.disputes.values() if d["status"] == "resolved"]
