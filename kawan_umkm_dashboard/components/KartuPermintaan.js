export default function KartuPermintaan({ permintaan }) {
	return (
		<div className="rounded-lg border p-4 shadow-sm bg-white">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">{permintaan.namaBarang}</h3>
				<span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{permintaan.status}</span>
			</div>
			<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
				<div>
					<div className="text-gray-500">Total Kuantitas</div>
					<div className="font-medium">{permintaan.totalKuantitas} {permintaan.unit}</div>
				</div>
				<div>
					<div className="text-gray-500">Jumlah Partisipan</div>
					<div className="font-medium">{permintaan.jumlahPartisipan}</div>
				</div>
			</div>
		</div>
	)
}