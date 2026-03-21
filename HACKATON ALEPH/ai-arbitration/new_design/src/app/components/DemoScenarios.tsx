import { motion } from 'motion/react';
import { Code2, Image, Coins } from 'lucide-react';

const scenarios = [
  {
    icon: Code2,
    title: 'Smart Contract Issue',
    description: 'Automated resolution for contract execution disputes with transparent on-chain verification.',
    gradient: 'from-purple-500/20 to-violet-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Image,
    title: 'NFT Plagiarism',
    description: 'AI-powered verification of intellectual property rights and originality claims.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: Coins,
    title: 'DAO Treasury Misuse',
    description: 'Decentralized governance dispute resolution with multi-validator consensus.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
];

export function DemoScenarios() {
  return (
    <div className="mt-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-semibold text-white mb-6 text-center"
      >
        Quick Demo Scenarios
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          return (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card p-6 rounded-3xl cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${scenario.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${scenario.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{scenario.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
