import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export function CreateDisputeCard() {
  const [formData, setFormData] = useState({
    claimant: '',
    respondent: '',
    title: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating dispute:', formData);
    // Reset form
    setFormData({ claimant: '', respondent: '', title: '', description: '' });
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
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Respondent</label>
          <input
            type="text"
            value={formData.respondent}
            onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Brief description of the dispute"
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the dispute..."
            rows={4}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/20"
        >
          Submit Dispute
        </motion.button>
      </form>
    </motion.div>
  );
}
