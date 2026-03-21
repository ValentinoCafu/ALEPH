import type { Scenario } from '../types';

interface Props {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
}

export function ScenarioSelector({ scenarios, onSelect }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">
        🎯 Quick Demo Scenarios (click to auto-fill)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((scenario, i) => (
          <button
            key={i}
            onClick={() => onSelect(scenario)}
            className="text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs transition-colors border border-gray-700"
          >
            <div className="font-medium text-gray-200 mb-1">
              {i === 0 && '💻 '}
              {i === 1 && '🏠 '}
              {i === 2 && '🤝 '}
              {scenario.title}
            </div>
            <div className="text-gray-500">{scenario.description.slice(0, 60)}...</div>
          </button>
        ))}
      </div>
    </div>
  );
}
