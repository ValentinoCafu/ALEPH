# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *


class AIArbitrationContract(gl.Contract):
    dispute_counter: u256
    disputes: TreeMap[str, dict]

    def __init__(self):
        self.dispute_counter = u256(0)
        self.disputes = TreeMap()
        self.storage.set("dispute_counter", u256(0))
        self.storage.set("disputes", TreeMap())

    @gl.public.write
    def create_dispute(
        self, claimant: str, respondent: str, title: str, description: str
    ) -> u256:
        dispute_id = self.storage.get_int("dispute_counter")

        dispute = {
            "id": dispute_id,
            "claimant": claimant,
            "respondent": respondent,
            "title": title,
            "description": description,
            "evidence": [],
            "status": "open",
            "verdict": "",
            "reason": "",
            "confidence": 0.0,
            "timestamp_created": self.block.timestamp,
            "timestamp_resolved": 0,
        }

        self.disputes[str(dispute_id)] = dispute
        self.storage.set("dispute_counter", dispute_id + 1)

        return dispute_id

    @gl.public.write
    def submit_evidence(self, dispute_id: int, party: str, content: str):
        dispute_key = str(dispute_id)

        if dispute_key not in self.disputes:
            revert("Dispute not found")

        dispute = self.disputes[dispute_key]

        if dispute["status"] != "open":
            revert("Dispute is not open for evidence submission")

        evidence_list = dispute.get("evidence", [])
        evidence_list.append(
            {"party": party, "content": content, "timestamp": self.block.timestamp}
        )

        dispute["evidence"] = evidence_list
        self.disputes[dispute_key] = dispute

    @gl.public.write
    def resolve_dispute(self, dispute_id: int) -> dict:
        dispute_key = str(dispute_id)

        if dispute_key not in self.disputes:
            revert("Dispute not found")

        dispute = self.disputes[dispute_key]

        if dispute["status"] != "open":
            revert("Dispute already resolved")

        evidence = dispute.get("evidence", [])
        verdict_result = self._ai_analyze(dispute, evidence)

        dispute["status"] = "resolved"
        dispute["verdict"] = verdict_result["verdict"]
        dispute["reason"] = verdict_result["reason"]
        dispute["confidence"] = verdict_result["confidence"]
        dispute["timestamp_resolved"] = self.block.timestamp

        self.disputes[dispute_key] = dispute

        return dispute

    @gl.public.view
    def get_dispute(self, dispute_id: int) -> dict:
        dispute_key = str(dispute_id)

        if dispute_key not in self.disputes:
            revert("Dispute not found")

        return self.disputes[dispute_key]

    @gl.public.view
    def get_all_disputes(self) -> DynArray[dict]:
        result = DynArray()
        for dispute in self.disputes.values():
            result.append(dispute)
        return result

    def _ai_analyze(self, dispute: dict, evidence: list) -> dict:
        evidence_text = "\n".join(
            [f"[{e.get('party', 'unknown')}]: {e.get('content', '')}" for e in evidence]
        )

        prompt = f"""Analyze the dispute and determine verdict:

Title: {dispute.get("title", "")}
Description: {dispute.get("description", "")}
Evidence: {evidence_text}

Return format:
VERDICT: [FAVOR_CLAIMANT/FAVOR_RESPONDENT/INCONCLUSIVE]
REASON: [brief reason]
CONFIDENCE: [0-1]
"""

        try:
            result = self.vm.run_ai_query(
                prompt=prompt,
                model="llama-3.3-70b",
            )

            verdict = self._parse_verdict(result)
            reason = self._parse_reason(result)
            confidence = self._parse_confidence(result)

            return {"verdict": verdict, "reason": reason, "confidence": confidence}
        except Exception:
            claimant_count = sum(1 for e in evidence if e.get("party") == "claimant")
            respondent_count = sum(
                1 for e in evidence if e.get("party") == "respondent"
            )

            if claimant_count > respondent_count:
                return {
                    "verdict": "FAVOR_CLAIMANT",
                    "reason": f"Claimant: {claimant_count} vs Respondent: {respondent_count}",
                    "confidence": 0.65,
                }
            elif respondent_count > claimant_count:
                return {
                    "verdict": "FAVOR_RESPONDENT",
                    "reason": f"Respondent: {respondent_count} vs Claimant: {claimant_count}",
                    "confidence": 0.65,
                }
            else:
                return {
                    "verdict": "INCONCLUSIVE",
                    "reason": "Evidence equally balanced",
                    "confidence": 0.50,
                }

    def _parse_verdict(self, result: str) -> str:
        for line in result.split("\n"):
            if "VERDICT:" in line.upper():
                t = line.upper()
                if "CLAIMANT" in t:
                    return "FAVOR_CLAIMANT"
                if "RESPONDENT" in t:
                    return "FAVOR_RESPONDENT"
        return "INCONCLUSIVE"

    def _parse_reason(self, result: str) -> str:
        for line in result.split("\n"):
            if "REASON:" in line.upper():
                parts = line.split(":", 1)
                if len(parts) > 1:
                    return parts[1].strip()
        return result[:200]

    def _parse_confidence(self, result: str) -> float:
        for line in result.split("\n"):
            if "CONFIDENCE:" in line.upper():
                try:
                    parts = line.split(":", 1)
                    return float(parts[1].strip())
                except:
                    pass
        return 0.75
