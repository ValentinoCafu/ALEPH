import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload } from 'lucide-react';
import { disputesApi } from '../services/api';
import type { Dispute } from '../types';

interface SubmitEvidenceCardProps {
  disputeId: number | null;
  disputes: Dispute[];
  onSubmitted: () => void;
}

export function SubmitEvidenceCard({ disputeId, disputes, onSubmitted }: SubmitEvidenceCardProps) {
  const [party, setParty] = useState<'claimant' | 'respondent'>('claimant');
  const [evidence, setEvidence] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!disputeId) {
      setMessage({ type: 'error', text: 'Create a dispute first to submit evidence.' });
      return;
    }
    
    if (!evidence) {
      setMessage({ type: 'error', text: 'Please enter evidence content.' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'success', text: 'Submitting evidence...' });

    try {
      const response = await disputesApi.submitEvidence(disputeId, { party, content: evidence });
      
      if (response.success) {
        setMessage({ type: 'success', text: `Evidence submitted for ${party}!` });
        setEvidence('');
        onSubmitted();
      } else {
        setMessage({ type: 'error', text: response.message || 'Error submitting evidence' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection failed. Is backend running?' });
    } finally {
      setLoading(false);
    }
  };

  const openDisputes = disputes.filter(d => d.status === 'open');

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
            value={disputeId ?? ''}
            disabled
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="" className="bg-gray-900">
              {openDisputes.length > 0 ? `Select Dispute (${openDisputes.length} open)` : 'No open disputes'}
            </option>
            {openDisputes.map(d => (
              <option key={d.id} value={d.id} className="bg-gray-900">
                #{d.id} - {d.title.slice(0, 30)}...
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Party</label>
          <select
            value={party}
            onChange={(e) => setParty(e.target.value as 'claimant' | 'respondent')}
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50"
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
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none disabled:opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || !disputeId}
          whileHover={!loading && disputeId ? { scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' } : {}}
          whileTap={!loading && disputeId ? { scale: 0.98 } : {}}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Evidence'}
        </motion.button>
      </form>

      {message && (
        <div
          className={`mt-4 px-4 py-3 rounded-2xl text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </motion.div>
  );
}
