import { motion } from 'motion/react';
import { Code2, Image, Coins } from 'lucide-react';
import { useScenarios } from '../hooks/useDisputes';
import type { Scenario } from '../types';

interface DemoScenariosProps {
  onSelect: (scenario: Scenario) => void;
}

export function DemoScenarios({ onSelect }: DemoScenariosProps) {
  const { scenarios } = useScenarios();

  const icons = [Code2, Image, Coins];
  const gradients = [
    'from-purple-500/20 to-violet-500/20',
    'from-blue-500/20 to-cyan-500/20',
    'from-emerald-500/20 to-teal-500/20',
  ];
  const iconColors = ['text-purple-400', 'text-blue-400', 'text-emerald-400'];

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
          const Icon = icons[index];
          const gradient = gradients[index];
          const iconColor = iconColors[index];
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => onSelect(scenario)}
              className="glass-card p-6 rounded-3xl cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{scenario.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{scenario.description.slice(0, 100)}...</p>
              <p className="text-xs text-gray-500 mt-3">Click to auto-fill form</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
