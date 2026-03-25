import { motion } from 'motion/react';

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabsNavigation({ activeTab, onTabChange }: TabsNavigationProps) {
  const tabs = ['New Dispute', 'All Disputes'];

  return (
    <div className="flex gap-4 mb-8">
      {tabs.map((tab) => (
        <motion.button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`relative px-6 py-3 rounded-2xl font-semibold transition-all ${
            activeTab === tab
              ? 'text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </motion.button>
      ))}
    </div>
  );
}
