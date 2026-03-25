import { motion } from 'motion/react';
import { useHealth } from '../hooks/useDisputes';

export function Header() {
  const { health, error } = useHealth();

  const getStatusInfo = () => {
    if (error) {
      return { dot: 'bg-red-400', text: 'Backend offline' };
    }
    if (health?.mode === 'live') {
      return {
        dot: 'bg-emerald-400',
        text: 'Live Mode',
      };
    }
    return { dot: 'bg-yellow-400', text: 'Mock Mode' };
  };

  const statusInfo = getStatusInfo();

  return (
    <header className="w-full mb-12">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">AI Arbitration</h1>
            <p className="text-sm text-gray-400">Decentralized Dispute Resolution</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`w-2 h-2 rounded-full ${statusInfo.dot} shadow-[0_0_10px_rgba(52,211,153,0.8)]`}
          />
          <span className="text-sm text-gray-300">{statusInfo.text}</span>
        </motion.div>
      </div>
    </header>
  );
}
