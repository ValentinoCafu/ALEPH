# GenLayer AI Arbitration Backend

## Setup

1. **Create and activate virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
pip install genlayer-py
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your values
```

## Environment Variables

```env
# Private key for wallet (required for writing to blockchain)
PRIVATE_KEY=your_private_key_here

# Deployed contract address (optional - uses mock mode if not set)
CONTRACT_ADDRESS=your_contract_address_here
```

## Running

```bash
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

## Testing

The API runs in two modes:
- **Mock Mode**: When no contract is deployed (uses local storage)
- **Live Mode**: When `PRIVATE_KEY` and `CONTRACT_ADDRESS` are set

### Mock Mode (Default)
Just run the server without configuring `.env`:
```bash
uvicorn main:app --reload --port 8000
```

### Live Mode (GenLayer Bradbury Testnet)
1. Deploy the `AIArbitrationContract` to GenLayer Bradbury Testnet
2. Set your `PRIVATE_KEY` and `CONTRACT_ADDRESS` in `.env`
3. Run the server

## API Endpoints

- `GET /health` - Check API and blockchain connection status
- `POST /disputes` - Create a new dispute
- `POST /disputes/{id}/evidence` - Submit evidence
- `POST /disputes/{id}/resolve` - Trigger AI resolution
- `GET /disputes/{id}` - Get dispute details
- `GET /disputes` - List all disputes
- `GET /explorer/{tx_hash}` - Get transaction explorer URL
