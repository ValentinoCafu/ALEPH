# AI Arbitration Contract

Un contrato inteligente de arbitraje descentralizado construido sobre GenLayer que permite:
- Crear disputas entre partes
- Presentar evidencia de ambas partes
- Resolver disputas usando IA a través del consenso de GenLayer

## Estructura del Proyecto

```
backend/
├── contracts/
│   └── ai_arbitration.py    # Contrato inteligente
├── main.py                   # API FastAPI
├── .env.example              # Variables de entorno ejemplo
├── requirements.txt
└── README.md
```

## Requisitos

1. **Docker** (para localnet)
2. **Node.js 18+** (para GenLayer CLI)
3. **Python 3.12+** (para el backend)

## Instalación

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install genlayer-py
```

### 2. GenLayer CLI

```bash
npm install -g genlayer
genlayer --version
```

## Despliegue del Contrato

### Opción A: Localnet (Desarrollo)

```bash
# Inicializar localnet
genlayer init --numValidators 3

# Esperar a que inicie (acceso en http://localhost:8080)
genlayer up

# En otra terminal, desplegar el contrato
genlayer deploy --contract contracts/ai_arbitration.py
```

Guarda la dirección del contrato desplegado.

### Opción B: Testnet Bradbury (Producción-like)

```bash
# Configurar testnet
genlayer network testnet-bradbury

# Desplegar al testnet
genlayer deploy --contract contracts/ai_arbitration.py

# Obtener tokens de prueba (faucet)
# Visita: https://faucet.genlayer.com
```

## Configuración del Backend

```bash
cd backend
cp .env.example .env
```

Edita `.env`:

```env
# Clave privada de tu wallet (necesaria para escribir en blockchain)
PRIVATE_KEY=tu_clave_privada_aqui

# Dirección del contrato desplegado
CONTRACT_ADDRESS=0x_tu_direccion_de_contrato_aqui
```

## Ejecutar el Backend

```bash
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

## Modos de Operación

### Mock Mode (Predeterminado)
Sin configuración de `.env`, el backend usa almacenamiento local simulado.
Útil para desarrollo y pruebas sin conexión a blockchain.

### Live Mode (GenLayer)
Con `PRIVATE_KEY` y `CONTRACT_ADDRESS` configurados, el backend se conecta a GenLayer Bradbury Testnet.

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado de la API y conexión |
| POST | `/disputes` | Crear nueva disputa |
| POST | `/disputes/{id}/evidence` | Presentar evidencia |
| POST | `/disputes/{id}/resolve` | Resolver con IA |
| GET | `/disputes/{id}` | Obtener detalles de disputa |
| GET | `/disputes` | Listar todas las disputas |

## Estructura del Contrato

### Funciones

- `create_dispute(claimant, respondent, title, description)` → dispute_id
- `submit_evidence(dispute_id, party, content)`
- `resolve_dispute(dispute_id)` → dict con veredicto
- `get_dispute(dispute_id)` → dict
- `get_all_disputes()` → list[dict]

### Veredictos

- `FAVOR_CLAIMANT` - A favor del demandante
- `FAVOR_RESPONDENT` - A favor del demandado
- `INCONCLUSIVE` - Evidencia insuficiente

## Cómo Funciona la Resolución IA

1. El contrato recibe evidencia de ambas partes
2. Al llamar `resolve_dispute`, el contrato ejecuta `_ai_analyze()`
3. Los validadores de GenLayer ejecutan LLMs para analizar la evidencia
4. Se alcanza consenso sobre el veredicto
5. El resultado se almacena permanentemente en la blockchain

## Recursos

- [Documentación de GenLayer](https://docs.genlayer.com)
- [Testnet Bradbury Explorer](https://explorer-bradbury.genlayer.com)
- [Discord de GenLayer](https://discord.gg/genlayer)
