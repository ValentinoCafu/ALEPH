import { useState, useCallback } from 'react';
import { Header, ParticlesBackground, TabsNavigation, CreateDisputeCard, SubmitEvidenceCard, AIResolutionCard, AllDisputesView, DemoScenarios } from './new_design_components';
import { useDisputes, useScenarios } from './hooks/useDisputes';
import type { Scenario, CreateDisputeRequest } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('New Dispute');
  const [selectedDisputeId, setSelectedDisputeId] = useState<number | null>(null);
  const [pendingScenario, setPendingScenario] = useState<CreateDisputeRequest | null>(null);
  const { disputes, loadDisputes, submitEvidence, clearCache } = useDisputes();
  const { scenarios } = useScenarios();

  const handleScenarioSelect = useCallback((scenario: Scenario) => {
    setPendingScenario({
      claimant: scenario.claimant,
      respondent: scenario.respondent,
      title: scenario.title,
      description: scenario.description,
    });
    setActiveTab('New Dispute');
  }, []);

  const handleDisputeCreated = useCallback(async (id: number) => {
    setSelectedDisputeId(id);
    
    const matchedScenario = scenarios.find(s => s.title === pendingScenario?.title);
    if (matchedScenario && matchedScenario.evidence.length > 0) {
      for (const evidence of matchedScenario.evidence) {
        await submitEvidence(id, evidence);
      }
    }
    
    setPendingScenario(null);
    await loadDisputes(true);
  }, [pendingScenario, scenarios, submitEvidence, loadDisputes]);

  const handleDisputeSelected = useCallback((id: number | null) => {
    setSelectedDisputeId(id);
  }, []);

  const clearScenario = useCallback(() => {
    setPendingScenario(null);
  }, []);

  const handleEvidenceSubmitted = useCallback(async () => {
    await loadDisputes(true);
  }, [loadDisputes]);

  const handleResolved = useCallback(async () => {
    setSelectedDisputeId(null);
    await loadDisputes(true);
  }, [loadDisputes]);

  const handleRefresh = useCallback(() => {
    clearCache();
    loadDisputes(true);
  }, [clearCache, loadDisputes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 relative overflow-hidden">
      <ParticlesBackground />

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[120px] animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Header />

        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'New Dispute' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <CreateDisputeCard 
                onCreated={handleDisputeCreated}
                pendingScenario={pendingScenario}
                clearScenario={clearScenario}
              />
              <SubmitEvidenceCard 
                disputeId={selectedDisputeId}
                disputes={disputes}
                onSelected={handleDisputeSelected}
                onSubmitted={handleEvidenceSubmitted}
              />
              <AIResolutionCard 
                disputeId={selectedDisputeId}
                disputes={disputes}
                onSelected={handleDisputeSelected}
                onResolved={handleResolved}
              />
            </div>

            <DemoScenarios onSelect={handleScenarioSelect} />
          </>
        ) : (
          <AllDisputesView onRefresh={handleRefresh} />
        )}
      </div>
    </div>
  );
}

export default App;
