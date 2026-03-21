import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload } from 'lucide-react';

export function SubmitEvidenceCard() {
  const [disputeId, setDisputeId] = useState('');
  const [party, setParty] = useState('claimant');
  const [evidence, setEvidence] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting evidence:', { disputeId, party, evidence });
    // Reset form
    setDisputeId('');
    setParty('claimant');
    setEvidence('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-3xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
          <Upload className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Submit Evidence</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Dispute ID</label>
          <select
            value={disputeId}
            onChange={(e) => setDisputeId(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-gray-900">Select Dispute</option>
            <option value="1" className="bg-gray-900">Dispute #1 - Smart Contract</option>
            <option value="2" className="bg-gray-900">Dispute #2 - NFT Rights</option>
            <option value="3" className="bg-gray-900">Dispute #3 - DAO Treasury</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Party</label>
          <select
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            <option value="claimant" className="bg-gray-900">Claimant</option>
            <option value="respondent" className="bg-gray-900">Respondent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Evidence</label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Provide evidence, documents, or supporting information..."
            rows={5}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
        >
          Submit Evidence
        </motion.button>
      </form>
    </motion.div>
  );
}
