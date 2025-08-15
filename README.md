# Agent UMKM MVP

Komponen:

- Backend ICP (Motoko canister) di `kawan_umkm_backend/`
- Agen AI (Python + uagents) di `ai_agent/`
- Dashboard Next.js + Tailwind di `kawan_umkm_dashboard/`

Catatan: dfx harus dijalankan di lingkungan WSL. Jalankan local replica dan deploy canister terlebih dahulu, lalu set `KAWAN_UMKM_CANISTER_ID`.

## Backend (ICP)

1. Masuk WSL, install DFX, jalankan replica:

```bash
dfx start --background
```

2. Deploy:

```bash
cd /workspace/kawan_umkm_backend
dfx deploy
```

Simpan canister id yang muncul untuk `kawan_umkm_backend`.

## Agen AI

```bash
cd /workspace/ai_agent
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export KAWAN_UMKM_CANISTER_ID=<CANISTER_ID>
export DFX_NETWORK=local
python agent.py
```

## Dashboard

```bash
cd /workspace/kawan_umkm_dashboard
npm install
echo "KAWAN_UMKM_CANISTER_ID=<CANISTER_ID>" > .env.local
echo "DFX_NETWORK=local" >> .env.local
npm run dev
```

Dashboard akan mengambil data dari canister melalui API route yang memanggil `dfx canister call getPermintaan`.
