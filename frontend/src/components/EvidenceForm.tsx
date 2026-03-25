import { useState } from 'react';

interface Props {
  disputeId: number;
  onSubmitted: () => void;
}

export function EvidenceForm({ disputeId, onSubmitted }: Props) {
  const [party, setParty] = useState<'claimant' | 'respondent'>('claimant');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      setMessage({ type: 'error', text: 'Fill dispute ID and evidence.' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'success', text: 'Submitting evidence...' });

    try {
      const response = await fetch(`http://localhost:8000/disputes/${disputeId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ party, content }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Evidence submitted for ${party}!` });
        setContent('');
        onSubmitted();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.detail || 'Error submitting evidence' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">
        Step 2 — Submit Evidence
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Dispute ID</label>
          <input
            type="number"
            value={disputeId}
            readOnly
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm cursor-not-allowed opacity-70"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Party</label>
          <select
            value={party}
            onChange={(e) => setParty(e.target.value as 'claimant' | 'respondent')}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          >
            <option value="claimant">Claimant</option>
            <option value="respondent">Respondent</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Evidence</label>
          <textarea
            rows={2}
            placeholder="Describe your evidence..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Evidence'}
        </button>
      </form>
      {message && (
        <div
          className={`mt-3 px-3 py-2 rounded-lg text-xs border ${
            message.type === 'success'
              ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300'
              : 'bg-red-900/50 border-red-700 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
