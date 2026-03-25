export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const VERDICT_CONFIG = {
  FAVOR_CLAIMANT: {
    colors: 'border-green-500 bg-green-950 text-green-300',
    icon: '🟢',
  },
  FAVOR_RESPONDENT: {
    colors: 'border-blue-500 bg-blue-950 text-blue-300',
    icon: '🔵',
  },
  INCONCLUSIVE: {
    colors: 'border-yellow-500 bg-yellow-950 text-yellow-300',
    icon: '🟡',
  },
} as const;

export const STATUS_COLORS = {
  open: 'text-yellow-400',
  resolved: 'text-emerald-400',
} as const;

export const VERDICT_TAG_COLORS = {
  FAVOR_CLAIMANT: 'bg-green-900 text-green-300',
  FAVOR_RESPONDENT: 'bg-blue-900 text-blue-300',
  INCONCLUSIVE: 'bg-yellow-900 text-yellow-300',
} as const;
