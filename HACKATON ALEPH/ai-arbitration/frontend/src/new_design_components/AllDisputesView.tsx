import { useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDisputes } from '../hooks/useDisputes';
import { VERDICT_TAG_COLORS } from '../constants';

export function AllDisputesView() {
  const { disputes, loading, error, loadDisputes } = useDisputes();

  useEffect(() => {
    loadDisputes();
  }, [loadDisputes]);

  const getStatusDisplay = (dispute: typeof disputes[0]) => {
    if (dispute.status === 'resolved') {
      return {
        label: 'Resolved',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        icon: CheckCircle2,
      };
    }
    
    if (dispute.evidence && dispute.evidence.length > 0) {
      return {
        label: 'Evidence Phase',
        color: 'text-purple-400',
        bg: 'bg-purple-500/20',
        icon: AlertCircle,
      };
    }
    
    return {
      label: 'Open',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      icon: AlertCircle,
    };
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateAddress = (address: string, chars = 6) => {
    if (address.length <= chars * 2 + 3) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-white"
        >
          All Disputes
        </motion.h2>
        <button
          onClick={loadDisputes}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-white/10 transition-all"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-8">Loading disputes...</div>
      )}

      {error && (
        <div className="text-center text-red-400 py-8">Error: {error}</div>
      )}

      {!loading && disputes.length === 0 && (
        <div className="text-center text-gray-500 py-12 glass-card rounded-3xl">
          <p>No disputes found.</p>
          <p className="text-sm mt-2">Create your first dispute to get started!</p>
        </div>
      )}

      <div className="grid gap-4">
        {disputes.map((dispute, index) => {
          const statusDisplay = getStatusDisplay(dispute);
          const StatusIcon = statusDisplay.icon;
          
          return (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className="glass-card p-6 rounded-3xl cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500">#{dispute.id}</span>
                      <h3 className="text-lg font-semibold text-white">{dispute.title}</h3>
                      {dispute.verdict && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${VERDICT_TAG_COLORS[dispute.verdict]}`}>
                          {dispute.verdict.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Claimant: {truncateAddress(dispute.claimant)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Respondent: {truncateAddress(dispute.respondent)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(dispute.timestamp_created)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{dispute.evidence?.length || 0} evidence</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full ${statusDisplay.bg} border border-white/10 flex items-center gap-2`}>
                  <StatusIcon className={`w-4 h-4 ${statusDisplay.color}`} />
                  <span className={`text-sm font-semibold ${statusDisplay.color}`}>
                    {statusDisplay.label}
                  </span>
                </div>
              </div>
              
              {dispute.reason && (
                <div className="mt-2 text-sm text-gray-400 italic border-t border-white/5 pt-3">
                  "{dispute.reason.slice(0, 150)}
                  {dispute.reason.length > 150 ? '...' : ''}"
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
