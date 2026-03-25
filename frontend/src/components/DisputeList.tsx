import { useEffect } from 'react';
import { useDisputes } from '../hooks/useDisputes';
import { STATUS_COLORS, VERDICT_TAG_COLORS } from '../constants';
import type { Dispute } from '../types';

export function DisputeList() {
  const { disputes, loading, error, loadDisputes } = useDisputes();

  useEffect(() => {
    loadDisputes();
  }, [loadDisputes]);

  const getVerdictTag = (verdict: Dispute['verdict']) => {
    if (!verdict) return null;
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${VERDICT_TAG_COLORS[verdict]}`}>
        {verdict.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-300">All Disputes</h3>
        <button
          onClick={loadDisputes}
          className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-500 py-8 text-sm">Loading...</div>
      )}

      {error && (
        <div className="text-center text-red-400 py-8 text-sm">❌ {error}</div>
      )}

      {!loading && disputes.length === 0 && (
        <div className="text-center text-gray-500 py-8 text-sm">No disputes found. Create one!</div>
      )}

      <div className="space-y-3">
        {disputes.map((dispute) => (
          <div
            key={dispute.id}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">#{dispute.id}</span>
                  <span className="font-medium text-sm">{dispute.title}</span>
                  {getVerdictTag(dispute.verdict)}
                </div>
                <p className="text-xs text-gray-500 truncate">{dispute.description}</p>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span>👤 {dispute.claimant}</span>
                  <span>vs</span>
                  <span>👤 {dispute.respondent}</span>
                  <span>📋 {dispute.evidence?.length || 0} evidence</span>
                </div>
                {dispute.reason && (
                  <p className="text-xs text-gray-400 mt-2 italic">
                    "{dispute.reason.slice(0, 120)}
                    {dispute.reason.length > 120 ? '...' : ''}"
                  </p>
                )}
              </div>
              <span className={`text-xs ${STATUS_COLORS[dispute.status]} font-medium flex-shrink-0`}>
                {dispute.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
