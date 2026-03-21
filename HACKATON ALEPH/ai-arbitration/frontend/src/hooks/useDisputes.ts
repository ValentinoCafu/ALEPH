import { useState, useEffect, useCallback } from 'react';
import { healthApi, disputesApi } from '../services/api';
import type { Dispute, CreateDisputeRequest, SubmitEvidenceRequest, HealthResponse, Scenario } from '../types';

export function useHealth() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    try {
      const data = await healthApi.check();
      setHealth(data);
      setError(null);
    } catch {
      setError('Backend offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [check]);

  return { health, loading, error };
}

export function useDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDisputes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await disputesApi.getAll();
      setDisputes(data.disputes);
      setError(null);
    } catch {
      setError('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDispute = async (data: CreateDisputeRequest): Promise<number | null> => {
    const response = await disputesApi.create(data);
    if (response.success) {
      await loadDisputes();
      return response.dispute_id ?? null;
    }
    return null;
  };

  const submitEvidence = async (id: number, data: SubmitEvidenceRequest): Promise<boolean> => {
    await disputesApi.submitEvidence(id, data);
    return true;
  };

  const resolveDispute = async (id: number) => {
    const response = await disputesApi.resolve(id);
    if (response.success) {
      await loadDisputes();
    }
    return response;
  };

  return {
    disputes,
    loading,
    error,
    loadDisputes,
    createDispute,
    submitEvidence,
    resolveDispute,
  };
}

export function useScenarios() {
  const scenarios: Scenario[] = [
    {
      claimant: 'Alice (Software Client)',
      respondent: 'Bob (Freelance Developer)',
      title: 'Incomplete Smart Contract Delivery',
      description: 'Alice hired Bob for $2,000 to build a staking contract with reward calculation logic. Bob delivered a contract on time, but the reward calculation function was missing, making the contract non-functional for its intended purpose.',
      evidence: [
        { party: 'claimant', content: 'I have a Telegram conversation from March 5th where Bob confirmed the scope: "I will implement the full staking logic including APY rewards." The delivered contract has no reward function — I can prove this with the contract address: 0x123...' },
        { party: 'respondent', content: 'I delivered a fully working ERC-20 staking contract before the deadline. The reward calculation was discussed verbally but was NOT in the written scope document we both signed. I only agreed to the staking deposit/withdrawal mechanism.' }
      ]
    },
    {
      claimant: 'CarlosBuyer.eth',
      respondent: 'ArtCreator.eth',
      title: 'NFT Artwork Plagiarism Claim',
      description: 'CarlosBuyer purchased an NFT for 2 ETH that was later identified as a copy of an existing artwork. The original artist has filed a DMCA takedown on the source platform.',
      evidence: [
        { party: 'claimant', content: 'I purchased the NFT "SunsetDream #47" for 2 ETH on March 1st. On March 10th, the original artist published proof that this artwork is a copy of their 2019 illustration "Golden Hour" with identical color gradients and composition. The DMCA was filed and accepted.' },
        { party: 'respondent', content: 'My artwork is an original piece created in 2023. I can provide my Photoshop file with layer timestamps. The similarities the claimant mentions are coincidental — this is a common artistic style. I have never seen the referenced 2019 illustration.' }
      ]
    },
    {
      claimant: 'CommunityDAO Member (0xabc...)',
      respondent: 'CoreTeam.eth',
      title: 'Unauthorized Treasury Expenditure',
      description: 'The DAO core team spent 50 ETH from the treasury on marketing without an approved governance proposal, violating the DAO constitution which requires proposals for expenditures over 10 ETH.',
      evidence: [
        { party: 'claimant', content: 'DAO constitution Article 4.2 requires governance approval for any treasury spend above 10 ETH. Transaction 0xdef... shows 50 ETH sent to MarketingCo on Feb 28th. No governance proposal exists for this expenditure in our on-chain records.' },
        { party: 'respondent', content: 'The DAO Discord had a unanimous informal agreement from the 12 core contributors on Feb 25th. We acted in good faith under time pressure — the marketing window was closing. We are filing a retroactive proposal this week to formalize the expenditure.' }
      ]
    }
  ];

  return { scenarios };
}
