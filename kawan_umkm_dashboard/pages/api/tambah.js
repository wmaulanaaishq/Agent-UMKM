export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}
	try {
		const canisterId = process.env.KAWAN_UMKM_CANISTER_ID
		const network = process.env.DFX_NETWORK || 'local'
		if (!canisterId) {
			return res.status(500).json({ error: 'KAWAN_UMKM_CANISTER_ID belum diset' })
		}
		const body = req.body || {}
		const { id, namaBarang, totalKuantitas, unit, jumlahPartisipan, status } = body
		if ([id, namaBarang, totalKuantitas, unit, jumlahPartisipan, status].some((v) => v === undefined)) {
			return res.status(400).json({ error: 'Payload tidak lengkap' })
		}
		const candidArg = `(record { id = ${Number(id)} : nat; namaBarang = "${String(namaBarang)}"; totalKuantitas = ${Number(totalKuantitas)} : nat; unit = "${String(unit)}"; jumlahPartisipan = ${Number(jumlahPartisipan)} : nat; status = "${String(status)}" })`
		const { spawn } = require('child_process')
		const child = spawn('dfx', ['canister', '--network', network, 'call', canisterId, 'tambahPermintaan', candidArg], { stdio: ['ignore', 'pipe', 'pipe'] })

		let out = ''
		let err = ''
		child.stdout.on('data', (d) => { out += d.toString() })
		child.stderr.on('data', (d) => { err += d.toString() })

		child.on('close', (code) => {
			if (code !== 0) {
				return res.status(500).json({ error: err || 'Gagal memanggil canister' })
			}
			return res.status(200).json({ ok: true, result: out.trim() })
		})
	} catch (e) {
		return res.status(500).json({ error: e.message })
	}
}