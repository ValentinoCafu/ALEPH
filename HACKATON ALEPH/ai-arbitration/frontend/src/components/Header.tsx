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
        text: `Live · ${health.contract_address.slice(0, 8)}...`,
      };
    }
    return { dot: 'bg-gray-500', text: 'Mock Mode · No contract' };
  };

  const statusInfo = getStatusInfo();

  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-sm font-bold">
            ⚖️
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">AI Arbitration</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">
              Powered by GenLayer · Bradbury Testnet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-gray-800 px-3 py-1.5 rounded-full">
          <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
          <span>{statusInfo.text}</span>
        </div>
      </div>
    </header>
  );
}
