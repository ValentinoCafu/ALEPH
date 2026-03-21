import { useState } from 'react';
import { VERDICT_CONFIG } from '../constants';
import type { ResolveDisputeResponse } from '../types';

interface Props {
  disputeId: number;
  onResolved: () => void;
}

export function ResolveDispute({ disputeId, onResolved }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolveDisputeResponse | null>(null);

  const handleResolve = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:8000/disputes/${disputeId}/resolve`, {
        method: 'POST',
      });
      const data = await response.json();
      setResult(data);
      if (response.ok) {
        onResolved();
      }
    } catch {
      setResult({
        success: false,
        message: 'Connection failed.',
        mode: 'mock',
      });
    } finally {
      setLoading(false);
    }
  };

  const dispute = result?.dispute || result?.result;
  const verdict = dispute?.verdict as keyof typeof VERDICT_CONFIG | null;
  const config = verdict ? VERDICT_CONFIG[verdict] : null;
  const confidence = dispute?.confidence;
  const confPct = confidence != null ? Math.round(confidence * 100) : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">
        Step 3 — AI Resolution
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        Triggers GenLayer validators. Each calls their own LLM.
        Consensus = final verdict. Takes ~30–60 seconds.
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          value={disputeId}
          readOnly
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm cursor-not-allowed opacity-70"
        />
        <button
          onClick={handleResolve}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
        >
          {loading ? 'AI thinking...' : 'Resolve with AI ✨'}
        </button>
      </div>

      {loading && (
        <div className="mt-3 flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
          <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div>
            <div className="text-sm font-medium">GenLayer validators calling LLMs...</div>
            <div className="text-xs text-gray-400">Each validator queries their own AI model. Consensus in progress.</div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="mt-3">
          {verdict && config ? (
            <div className={`border rounded-lg p-4 ${config.colors}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-base">
                  {config.icon} {verdict.replace('_', ' ')}
                </span>
                {confPct != null && (
                  <span className="text-xs opacity-70">Confidence: {confPct}%</span>
                )}
              </div>
              <p className="text-sm opacity-90">{dispute?.reason}</p>
              {result.tx_hash && (
                <p className="text-xs opacity-50 mt-2">TX: {result.tx_hash.slice(0, 20)}...</p>
              )}
              <p className="text-xs opacity-50 mt-1">
                {result.mode === 'mock' ? '⚠️ Mock mode' : '✅ Stored on-chain'}
              </p>
            </div>
          ) : (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-xs">
              {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
