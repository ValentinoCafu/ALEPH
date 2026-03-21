import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { disputesApi } from '../services/api';
import { VERDICT_CONFIG } from '../constants';
import type { Dispute } from '../types';

interface AIResolutionCardProps {
  disputeId: number | null;
  onResolved: () => void;
}

export function AIResolutionCard({ disputeId, onResolved }: AIResolutionCardProps) {
  const [isResolving, setIsResolving] = useState(false);
  const [result, setResult] = useState<Dispute | null>(null);

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!disputeId) return;
    
    setIsResolving(true);
    setResult(null);

    try {
      const response = await disputesApi.resolve(disputeId);
      
      if (response.success) {
        const dispute = response.dispute || response.result;
        setResult(dispute || null);
        onResolved();
      }
    } catch {
      console.error('Connection failed');
    } finally {
      setIsResolving(false);
    }
  };

  const verdict = result?.verdict as keyof typeof VERDICT_CONFIG | null;
  const config = verdict ? VERDICT_CONFIG[verdict] : null;
  const confidence = result?.confidence;
  const confPct = confidence != null ? Math.round(confidence * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-3xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: isResolving ? 360 : 0,
            }}
            transition={{
              duration: 2,
              repeat: isResolving ? Infinity : 0,
              ease: "linear",
            }}
          >
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold text-white">AI Resolution</h3>
      </div>

      <form onSubmit={handleResolve} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Dispute ID</label>
          <input
            type="text"
            value={disputeId ?? ''}
            readOnly
            placeholder="Create a dispute first"
            disabled={isResolving}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all disabled:opacity-50 cursor-not-allowed"
          />
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-sm text-gray-300 leading-relaxed">
            AI validators analyze evidence from all parties and reach consensus through decentralized arbitration algorithms.
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={isResolving || !disputeId}
          whileHover={!isResolving && disputeId ? { scale: 1.02, boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' } : {}}
          whileTap={!isResolving && disputeId ? { scale: 0.98 } : {}}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          {isResolving ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Resolving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Request Resolution
            </span>
          )}
        </motion.button>
      </form>

      {result && !isResolving && verdict && config && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-4 p-4 rounded-2xl border ${config.colors}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base">
              {config.icon} {verdict.replace('_', ' ')}
            </span>
            {confPct != null && (
              <span className="text-xs opacity-70">Confidence: {confPct}%</span>
            )}
          </div>
          <p className="text-sm opacity-90">{result.reason}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
