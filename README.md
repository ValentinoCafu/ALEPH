# ⚖️ AI Arbitration — GenLayer Hackathon

> Decentralized AI-powered dispute resolution on GenLayer Bradbury Testnet.
> Multiple LLM validators reach consensus via Optimistic Democracy.

![GenLayer](https://img.shields.io/badge/GenLayer-Bradbury_Testnet-violet)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### Setup (One-time)

```bash
# Clone the repository
git clone <repository-url>
cd ai-arbitration

# Run the complete setup (creates .env, installs dependencies)
chmod +x setup.sh
./setup.sh
```

### Running the Application

```bash
# Option 1: Run both services together (recommended)
chmod +x run.sh
./run.sh

# Option 2: Run services separately in different terminals
# Terminal 1 - Backend
cd backend && ./start.sh

# Terminal 2 - Frontend
cd frontend && ./start.sh
```

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## ⚙️ Configuration (Required)

Before running the app, you need to configure your credentials:

### 1. Wallet Private Key

1. Open MetaMask
2. Click your account → Account Details
3. Click "Export Private Key"
4. Copy your private key

### 2. Supabase (Optional - for file uploads)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy your `Project URL` and `service_role` key
4. Create a storage bucket named "Ai-Arbitration"

### 3. Configure Environment

Edit `backend/.env`:

```bash
# Wallet Private Key (from MetaMask)
PRIVATE_KEY=tu-private-key-aqui

# Contract Address (already configured - DO NOT CHANGE)
CONTRACT_ADDRESS=0x5844F58a9E2263d71C1e055765682880864785C3

# Supabase (optional - app works without it but file upload won't work)
SUPABASE_URL=tu-supabase-url
SUPABASE_SERVICE_ROLE_KEY=tu-supabase-key
```

Or copy the example and edit:
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

---

## 🔐 Security Notes

- **NEVER** commit your `.env` file to git
- The `.gitignore` already excludes `.env`
- The `PRIVATE_KEY` gives access to your wallet - keep it secret
- Only use wallets with test funds for development

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                     http://localhost:5173                    │
└─────────────────────────────┬───────────────────────────────┘
                              │ REST API
┌─────────────────────────────▼───────────────────────────────┐
│                       Backend (FastAPI)                      │
│                     http://localhost:8000                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Supabase   │  │   GenLayer   │  │   File Upload    │  │
│  │   Storage    │  │   Blockchain │  │   (PDF/Images)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │ JSON-RPC
┌─────────────────────────────▼───────────────────────────────┐
│              GenLayer Bradbury Testnet                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Intelligent Contract                        │    │
│  │           AI Arbitration Contract                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │          Validator Network                            │    │
│  │  Each validator calls own LLM → Consensus verdict    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ai-arbitration/
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
├── setup.sh                    # Complete setup script
├── run.sh                      # Run both services
│
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   ├── .env                    # Environment variables (git-ignored)
│   ├── setup.sh                # Backend setup script
│   ├── start.sh                # Backend start script
│   └── venv/                   # Python virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Main React application
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   ├── types/
│   │   │   └── index.ts        # TypeScript types
│   │   ├── constants/
│   │   │   └── index.ts        # App constants
│   │   ├── hooks/
│   │   │   └── useDisputes.ts  # Disputes data hook
│   │   └── new_design_components/
│   │       ├── CreateDisputeCard.tsx
│   │       ├── SubmitEvidenceCard.tsx
│   │       ├── AIResolutionCard.tsx
│   │       ├── AllDisputesView.tsx
│   │       └── ...
│   ├── package.json
│   ├── index.html
│   ├── setup.sh                # Frontend setup script
│   └── start.sh                # Frontend start script
│
├── contracts/
│   └── ai_arbitration.py       # GenLayer Intelligent Contract
│
└── demo/
    └── demo_scenario.md        # Demo script for presentations
```

---

## 🔐 Environment Configuration

The application comes pre-configured with:

| Variable | Pre-configured | Description |
|----------|----------------|-------------|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase storage access |
| `CONTRACT_ADDRESS` | ✅ | GenLayer contract address |
| `PRIVATE_KEY` | ✅ | Wallet private key (limited funds) |

> **Security Note**: The `.env` file is git-ignored and never committed. The pre-configured wallet has minimal test funds for demonstration purposes.

### Changing Configuration

To use your own wallet or contract:

```bash
# Edit the .env file
nano backend/.env

# Or create from template
cp backend/.env.example backend/.env
```

---

## 📄 File Upload

The system supports file uploads as evidence:

| File Type | Handling | Output |
|-----------|----------|--------|
| Images (JPG, PNG, WEBP) | Uploaded directly | Image URL |
| PDF (with text) | Text extracted | Text file URL |
| PDF (scanned) | Error shown | Must use image or text |

Files are stored in Supabase Storage and URLs are submitted to the blockchain contract.

---

## 🔄 Dispute Flow

```
1. Create Dispute
   createDispute(claimant, respondent, title, description)
        │
        ▼
2. Submit Evidence (Claimant)
   submitEvidence(dispute_id, "claimant", evidence)
        │
        ▼
3. Submit Evidence (Respondent)
   submitEvidence(dispute_id, "respondent", evidence)
        │
        ▼
4. AI Resolution
   resolveDispute(dispute_id)
        │
        ├──► Validator 1: calls LLM with prompt
        ├──► Validator 2: calls LLM with prompt
        ├──► Validator N: calls LLM with prompt
        │
        ▼
5. Consensus (Optimistic Democracy)
   - If majority agree → verdict finalized on-chain
   - Result: verdict + reason + confidence
        │
        ▼
6. Read Result
   getDispute(dispute_id) → verdict, reason, confidence
```

---

## 🤖 How AI Consensus Works

GenLayer validators each run the `resolveDispute` function independently:

1. Each validator receives the dispute context (title, description, all evidence)
2. Each validator calls their own LLM with a standardized prompt
3. Validators submit their verdicts on-chain
4. **Optimistic Democracy**: If the majority agree → verdict is finalized
5. This prevents any single AI from controlling the outcome

### Verdicts

- `FAVOR_CLAIMANT` - The claimant's case is stronger
- `FAVOR_RESPONDENT` - The respondent's case is stronger
- `INCONCLUSIVE` - Not enough evidence to decide

---

## 🛠️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Backend + contract status |
| GET | `/disputes` | List all disputes |
| GET | `/disputes/{id}` | Get dispute details |
| POST | `/disputes` | Create new dispute |
| POST | `/disputes/{id}/evidence` | Submit evidence |
| POST | `/disputes/{id}/resolve` | Trigger AI resolution |
| POST | `/upload` | Upload file (image/PDF) |
| GET | `/explorer/{tx_hash}` | Get transaction explorer URL |

---

## 🎯 Features

- ✅ Create disputes with claimant/respondent details
- ✅ Submit text evidence
- ✅ Upload images (JPG, PNG, WEBP)
- ✅ Upload PDFs with automatic text extraction
- ✅ AI-powered dispute resolution
- ✅ Real-time status updates
- ✅ LocalStorage caching
- ✅ Responsive dark theme UI

---

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check if .env exists
ls -la backend/.env

# If not, run setup
cd backend && ./setup.sh
```

### Frontend won't connect to backend

```bash
# Ensure backend is running
curl http://localhost:8000/health

# Check CORS settings in main.py
```

### Upload fails

```bash
# Check Supabase connection
curl http://localhost:8000/health | grep supabase

# Verify storage bucket exists in Supabase dashboard
```

---

## 📝 License

MIT License

---

Built at GenLayer Hackathon | Bradbury Testnet
