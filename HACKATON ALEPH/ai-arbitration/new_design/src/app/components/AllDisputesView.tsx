import { motion } from 'motion/react';
import { FileText, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const mockDisputes = [
  {
    id: '1',
    title: 'Smart Contract Execution Failure',
    claimant: '0x742d...5f3a',
    respondent: '0x8d3f...2b1c',
    status: 'In Review',
    statusColor: 'text-blue-400',
    statusBg: 'bg-blue-500/20',
    date: '2026-03-20',
  },
  {
    id: '2',
    title: 'NFT Copyright Infringement',
    claimant: '0x5c2a...8d4e',
    respondent: '0x9f1b...3c7a',
    status: 'Evidence Phase',
    statusColor: 'text-purple-400',
    statusBg: 'bg-purple-500/20',
    date: '2026-03-19',
  },
  {
    id: '3',
    title: 'DAO Treasury Fund Allocation',
    claimant: '0x1a8e...6f2d',
    respondent: '0x4b9c...1e5a',
    status: 'Resolved',
    statusColor: 'text-emerald-400',
    statusBg: 'bg-emerald-500/20',
    date: '2026-03-18',
  },
  {
    id: '4',
    title: 'Token Swap Discrepancy',
    claimant: '0x7e3d...9a2f',
    respondent: '0x2c5b...4d8e',
    status: 'Pending',
    statusColor: 'text-yellow-400',
    statusBg: 'bg-yellow-500/20',
    date: '2026-03-21',
  },
];

export function AllDisputesView() {
  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-white mb-6"
      >
        All Disputes
      </motion.h2>

      <div className="grid gap-4">
        {mockDisputes.map((dispute, index) => (
          <motion.div
            key={dispute.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, x: 5 }}
            className="glass-card p-6 rounded-3xl cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{dispute.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Claimant: {dispute.claimant}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Respondent: {dispute.respondent}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{dispute.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full ${dispute.statusBg} border border-white/10 flex items-center gap-2`}>
                {dispute.status === 'Resolved' ? (
                  <CheckCircle2 className={`w-4 h-4 ${dispute.statusColor}`} />
                ) : (
                  <AlertCircle className={`w-4 h-4 ${dispute.statusColor}`} />
                )}
                <span className={`text-sm font-semibold ${dispute.statusColor}`}>
                  {dispute.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
