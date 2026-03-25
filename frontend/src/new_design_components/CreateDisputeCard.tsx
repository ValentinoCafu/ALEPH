import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Loader2 } from 'lucide-react';
import { disputesApi } from '../services/api';
import type { CreateDisputeRequest } from '../types';

interface CreateDisputeCardProps {
  onCreated: (disputeId: number) => void;
  pendingScenario: CreateDisputeRequest | null;
  clearScenario: () => void;
}

export function CreateDisputeCard({ onCreated, pendingScenario, clearScenario }: CreateDisputeCardProps) {
  const [formData, setFormData] = useState<CreateDisputeRequest>({
    claimant: '',
    respondent: '',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (pendingScenario) {
      setFormData(pendingScenario);
    }
  }, [pendingScenario]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const steps = [
        'Connecting to blockchain...',
        'Signing transaction...',
        'Waiting for confirmation...',
        'Finalizing on-chain...',
      ];
      let i = 0;
      setProgress(steps[0]);
      interval = setInterval(() => {
        i = (i + 1) % steps.length;
        setProgress(steps[i]);
      }, 3000);
    } else {
      setProgress('');
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.claimant || !formData.respondent || !formData.title || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'success', text: 'Submitting to blockchain...' });

    try {
      const response = await disputesApi.create(formData);
      
      if (response.success) {
        const id = response.dispute_id ?? 0;
        setMessage({ type: 'success', text: `Dispute created! ID: ${id}` });
        setFormData({ claimant: '', respondent: '', title: '', description: '' });
        clearScenario();
        onCreated(id);
      } else {
        setMessage({ type: 'error', text: response.message || 'Error creating dispute' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection failed. Is backend running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-3xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Create Dispute</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Claimant</label>
          <input
            type="text"
            value={formData.claimant}
            onChange={(e) => setFormData({ ...formData, claimant: e.target.value })}
            placeholder="e.g. Alice (Client)"
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Respondent</label>
          <input
            type="text"
            value={formData.respondent}
            onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
            placeholder="e.g. Bob (Developer)"
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief description of the dispute"
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the dispute..."
            rows={4}
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none disabled:opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating on Blockchain...</span>
            </>
          ) : (
            'Submit Dispute'
          )}
        </motion.button>

        {loading && progress && (
          <div className="mt-2 text-center">
            <p className="text-sm text-cyan-400 animate-pulse">{progress}</p>
            <p className="text-xs text-gray-500 mt-1">This may take 10-30 seconds</p>
          </div>
        )}
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
