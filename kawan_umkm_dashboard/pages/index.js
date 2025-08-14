import { useEffect, useState } from 'react'
import KartuPermintaan from '@/components/KartuPermintaan'

export default function Home() {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function fetchPermintaan() {
		try {
			setLoading(true)
			const res = await fetch('/api/permintaan')
			if (!res.ok) throw new Error('Gagal memuat data')
			const json = await res.json()
			setData(json || [])
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchPermintaan()
		const id = setInterval(fetchPermintaan, 30000)
		return () => clearInterval(id)
	}, [])

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-5xl mx-auto p-6">
				<h1 className="text-2xl font-bold mb-4">Kawan UMKM - Dashboard Permintaan Kolektif</h1>
				{loading && <div className="text-gray-600">Memuat...</div>}
				{error && <div className="text-red-600">{error}</div>}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
					{data.map((p, idx) => (
						<KartuPermintaan key={idx} permintaan={p} />
					))}
				</div>
			</div>
		</div>
	)
}