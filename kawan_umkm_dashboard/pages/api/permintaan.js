export default async function handler(req, res) {
	try {
		const canisterId = process.env.KAWAN_UMKM_CANISTER_ID
		const network = process.env.DFX_NETWORK || 'local'
		if (!canisterId) {
			return res.status(500).json({ error: 'KAWAN_UMKM_CANISTER_ID belum diset' })
		}
		const { spawn } = require('child_process')
		const child = spawn('dfx', ['canister', '--network', network, 'call', canisterId, 'getPermintaan'], { stdio: ['ignore', 'pipe', 'pipe'] })

		let out = ''
		let err = ''
		child.stdout.on('data', (d) => { out += d.toString() })
		child.stderr.on('data', (d) => { err += d.toString() })

		child.on('close', (code) => {
			if (code !== 0) {
				return res.status(500).json({ error: err || 'Gagal memanggil canister' })
			}
			// dfx returns candid text, e.g., (vec { record { ... } })
			// For MVP, do a naive parse by delegating to dfx to output JSON via --output json if available; fallback to quick transform
			// Try: dfx canister call --output json
			if (out.trim().startsWith('(')) {
				try {
					// attempt to transform candid tuple string to JSON
					const jsonLike = out
						.replace(/^\(/, '')
						.replace(/\)$/, '')
						.replace(/^\s*vec\s*/, '')
						.replace(/record\s*\{/g, '{')
						.replace(/\}/g, '}')
						.replace(/: nat/g, '')
						.replace(/: text/g, '')
						.replace(/;/g, ',')
						.replace(/\s+([}\]])/g, '$1')
						.replace(/([\{,])\s*(\w+)\s*=/g, '$1"$2":')
						.trim()
					const data = JSON.parse(jsonLike)
					return res.status(200).json(Array.isArray(data) ? data : [])
				} catch (e) {
					return res.status(200).json([])
				}
			}
			return res.status(200).json([])
		})
	} catch (e) {
		return res.status(500).json({ error: e.message })
	}
}