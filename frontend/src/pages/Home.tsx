import { useState, useCallback } from 'react';
import { CreateDisputeForm } from '../components/CreateDisputeForm';
import { EvidenceForm } from '../components/EvidenceForm';
import { ResolveDispute } from '../components/ResolveDispute';
import { ScenarioSelector } from '../components/ScenarioSelector';
import { DisputeList } from '../components/DisputeList';
import { useScenarios, useDisputes } from '../hooks/useDisputes';
import type { Scenario, CreateDisputeRequest } from '../types';

type Tab = 'create' | 'list';

export function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('create');
  const [selectedDisputeId, setSelectedDisputeId] = useState(0);
  const [pendingScenario, setPendingScenario] = useState<CreateDisputeRequest | null>(null);
  const [scenarioEvidence, setScenarioEvidence] = useState<Scenario['evidence'] | null>(null);

  const { scenarios } = useScenarios();
  const { submitEvidence } = useDisputes();

  const handleScenarioSelect = (scenario: Scenario) => {
    setPendingScenario({
      claimant: scenario.claimant,
      respondent: scenario.respondent,
      title: scenario.title,
      description: scenario.description,
    });
    setScenarioEvidence(scenario.evidence);
  };

  const handleDisputeCreated = useCallback((id: number) => {
    setSelectedDisputeId(id);
    if (scenarioEvidence && scenarioEvidence.length > 0) {
      scenarioEvidence.forEach((evidence) => {
        submitEvidence(id, evidence);
      });
      setScenarioEvidence(null);
    }
  }, [scenarioEvidence, submitEvidence]);

  const handleEvidenceSubmitted = () => {
    // Refrescar lista si estamos en esa pestaña
  };

  const handleResolved = () => {
    // La lista se refresca automáticamente en useDisputes
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Decentralized AI Dispute Resolution</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm">
          Multiple AI validators independently evaluate evidence and reach consensus
          via GenLayer's Optimistic Democracy — permanently recorded on-chain.
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'create'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          + New Dispute
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 'list'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          All Disputes
        </button>
      </div>

      {activeTab === 'create' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <CreateDisputeForm
                onCreated={handleDisputeCreated}
                pendingScenario={pendingScenario}
                clearScenario={() => setPendingScenario(null)}
              />
            </div>
            <div className="space-y-4">
              <EvidenceForm
                disputeId={selectedDisputeId}
                onSubmitted={handleEvidenceSubmitted}
              />
              <ResolveDispute
                disputeId={selectedDisputeId}
                onResolved={handleResolved}
              />
            </div>
          </div>

          <div className="mt-6">
            <ScenarioSelector scenarios={scenarios} onSelect={handleScenarioSelect} />
          </div>
        </div>
      )}

      {activeTab === 'list' && <DisputeList />}
    </main>
  );
}
