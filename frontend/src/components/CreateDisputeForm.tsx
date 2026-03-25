import { useState, useEffect } from 'react';
import type { CreateDisputeRequest } from '../types';

interface Props {
  onCreated: (disputeId: number) => void;
  pendingScenario: CreateDisputeRequest | null;
  clearScenario: () => void;
}

export function CreateDisputeForm({ onCreated, pendingScenario, clearScenario }: Props) {
  const [form, setForm] = useState<CreateDisputeRequest>({
    claimant: '',
    respondent: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (pendingScenario) {
      setForm(pendingScenario);
    }
  }, [pendingScenario]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.claimant || !form.respondent || !form.title || !form.description) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'success', text: 'Submitting to blockchain...' });

    try {
      const response = await fetch('http://localhost:8000/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (response.ok) {
        const id = data.dispute_id ?? 0;
        setMessage({ type: 'success', text: `Dispute created! ID: ${id}` });
        setForm({ claimant: '', respondent: '', title: '', description: '' });
        clearScenario();
        onCreated(id);
      } else {
        setMessage({ type: 'error', text: data.detail || 'Error creating dispute' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Connection failed. Is backend running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider mb-4">
        Step 1 — Create Dispute
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Claimant (who filed)</label>
          <input
            type="text"
            placeholder="e.g. Alice (Client)"
            value={form.claimant}
            onChange={(e) => setForm({ ...form, claimant: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Respondent (accused party)</label>
          <input
            type="text"
            placeholder="e.g. Bob (Developer)"
            value={form.respondent}
            onChange={(e) => setForm({ ...form, respondent: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Title</label>
          <input
            type="text"
            placeholder="e.g. Incomplete Contract Delivery"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Description</label>
          <textarea
            rows={3}
            placeholder="Describe the dispute in detail..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Submitting...' : 'Create Dispute On-Chain →'}
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
