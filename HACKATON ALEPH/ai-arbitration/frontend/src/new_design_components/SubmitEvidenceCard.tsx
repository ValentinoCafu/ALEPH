import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, ChevronDown, X, FileText, Image } from 'lucide-react';
import { disputesApi } from '../services/api';
import type { Dispute } from '../types';

interface SubmitEvidenceCardProps {
  disputeId: number | null;
  disputes: Dispute[];
  onSelected: (id: number | null) => void;
  onSubmitted: () => void;
}

const API_URL = 'http://localhost:8000';

export function SubmitEvidenceCard({ disputeId, disputes, onSelected, onSubmitted }: SubmitEvidenceCardProps) {
  const [party, setParty] = useState<'claimant' | 'respondent'>('claimant');
  const [evidence, setEvidence] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Only images and PDFs allowed.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File too large. Max 5MB allowed.' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disputeId === null) {
      setMessage({ type: 'error', text: 'Select a dispute first.' });
      return;
    }

    if (!evidence.trim() && !selectedFile) {
      setMessage({ type: 'error', text: 'Please enter evidence or upload a file.' });
      return;
    }

    setLoading(true);
    setMessage({ type: 'success', text: 'Submitting evidence...' });

    try {
      let content = evidence;

      if (selectedFile) {
        setUploading(true);
        setMessage({ type: 'success', text: 'Uploading file...' });
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.detail || 'Upload failed');
        }
        
        const uploadResult = await uploadResponse.json();
        content = uploadResult.file_url;
        setUploading(false);
      }

      const response = await disputesApi.submitEvidence(disputeId, { party, content });
      
      if (response.success) {
        setMessage({ type: 'success', text: `Evidence submitted for ${party}!` });
        setEvidence('');
        clearFile();
        onSubmitted();
      } else {
        setMessage({ type: 'error', text: response.message || 'Error submitting evidence' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Connection failed. Is backend running?' });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const openDisputes = disputes.filter(d => d.status === 'open');
  const selectedDispute = disputes.find(d => d.id === disputeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 rounded-3xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center">
          <Upload className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Submit Evidence</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm text-gray-400 mb-2">Select Dispute</label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading || openDisputes.length === 0}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
          >
            <span className={selectedDispute ? 'text-white' : 'text-gray-500'}>
              {selectedDispute 
                ? `#${selectedDispute.id} - ${selectedDispute.title.slice(0, 25)}${selectedDispute.title.length > 25 ? '...' : ''}`
                : openDisputes.length > 0 
                  ? `Select Dispute (${openDisputes.length} open)`
                  : 'No open disputes'
              }
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && openDisputes.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl max-h-60 overflow-y-auto">
              {openDisputes.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    onSelected(d.id);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors text-white text-sm border-b border-white/5 last:border-b-0"
                >
                  <span className="text-blue-400">#{d.id}</span> - {d.title.slice(0, 35)}
                  {d.title.length > 35 && '...'}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Party</label>
          <select
            value={party}
            onChange={(e) => setParty(e.target.value as 'claimant' | 'respondent')}
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer disabled:opacity-50"
          >
            <option value="claimant" className="bg-gray-900">Claimant</option>
            <option value="respondent" className="bg-gray-900">Respondent</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Upload File (Image/PDF)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-500/50 transition-all"
          >
            {selectedFile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {previewUrl ? (
                    <Image className="w-5 h-5 text-blue-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-400" />
                  )}
                  <span className="text-white text-sm truncate max-w-[150px]">{selectedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-gray-400">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">Click to upload (max 5MB)</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {previewUrl && (
          <div className="rounded-xl overflow-hidden border border-white/10">
            <img src={previewUrl} alt="Preview" className="w-full max-h-40 object-contain" />
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-2">Or enter evidence text</label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Provide evidence, documents, or supporting information..."
            rows={4}
            disabled={loading}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none disabled:opacity-50"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || uploading || disputeId === null}
          whileHover={!loading && !uploading && disputeId !== null ? { scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' } : {}}
          whileTap={!loading && !uploading && disputeId !== null ? { scale: 0.98 } : {}}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : loading ? 'Submitting...' : 'Submit Evidence'}
        </motion.button>
      </form>

      {message && (
        <div
          className={`mt-4 px-4 py-3 rounded-2xl text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/20 border-red-500/30 text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </motion.div>
  );
}
