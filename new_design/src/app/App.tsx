import { Header } from './components/Header';
import { CreateDisputeCard } from './components/CreateDisputeCard';
import { SubmitEvidenceCard } from './components/SubmitEvidenceCard';
import { AIResolutionCard } from './components/AIResolutionCard';
import { DemoScenarios } from './components/DemoScenarios';
import { ParticlesBackground } from './components/ParticlesBackground';
import { TabsNavigation } from './components/TabsNavigation';
import { AllDisputesView } from './components/AllDisputesView';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('New Dispute');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[120px] animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <Header />

        {/* Tabs Navigation */}
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'New Dispute' ? (
          <>
            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <CreateDisputeCard />
              <SubmitEvidenceCard />
              <AIResolutionCard />
            </div>

            {/* Demo Scenarios */}
            <DemoScenarios />
          </>
        ) : (
          <AllDisputesView />
        )}
      </div>
    </div>
  );
}