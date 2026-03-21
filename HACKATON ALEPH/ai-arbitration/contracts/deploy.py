"""
Deploy ai_arbitration.py to GenLayer Bradbury Testnet.

Usage:
    pip install genlayer python-dotenv
    python deploy.py
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

try:
    from genlayer import GenLayerClient
except ImportError:
    print("❌  Install the SDK first:  pip install genlayer python-dotenv")
    raise


def deploy():
    rpc_url     = os.getenv("GENLAYER_RPC_URL", "https://studio.genlayer.com/api")
    private_key = os.getenv("PRIVATE_KEY")

    if not private_key:
        print("❌  Set PRIVATE_KEY in your .env file")
        print("    Get a test key from GenLayer Studio: https://studio.genlayer.com")
        return

    print(f"🔗  Connecting to GenLayer RPC: {rpc_url}")
    client = GenLayerClient(rpc_url=rpc_url, private_key=private_key)

    contract_path = Path(__file__).parent / "ai_arbitration.py"
    print(f"📄  Reading contract: {contract_path}")
    contract_code = contract_path.read_text()

    print("🚀  Deploying contract to Bradbury testnet...")
    address = client.deploy_contract(contract_code)

    print(f"\n✅  Contract deployed successfully!")
    print(f"📍  Contract address: {address}")
    print(f"\nAdd this to your backend/.env file:")
    print(f"CONTRACT_ADDRESS={address}")

    # Optionally save the address
    env_file = Path(__file__).parent.parent / "backend" / ".env"
    if env_file.exists():
        content = env_file.read_text()
        if "CONTRACT_ADDRESS=" not in content:
            with open(env_file, "a") as f:
                f.write(f"\nCONTRACT_ADDRESS={address}\n")
            print(f"\n✅  Saved to {env_file}")


if __name__ == "__main__":
    deploy()
