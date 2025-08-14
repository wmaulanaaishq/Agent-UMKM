import os
import subprocess
from collections import defaultdict
from dataclasses import dataclass
from typing import List, Dict, Tuple

from uagents import Agent, Context
from data_simulasi import data_umkm

CANISTER_ID = os.environ.get("KAWAN_UMKM_CANISTER_ID", "")
DFX_NETWORK = os.environ.get("DFX_NETWORK", "local")

@dataclass
class Permintaan:
	id: int
	namaBarang: str
	totalKuantitas: int
	unit: str
	jumlahPartisipan: int
	status: str


def group_and_aggregate(data: List[Dict]) -> List[Permintaan]:
	groups: Dict[Tuple[str, str], List[Dict]] = defaultdict(list)
	for item in data:
		key = (item["barang"], item["unit"])
		groups[key].append(item)

	results: List[Permintaan] = []
	for idx, ((barang, unit), items) in enumerate(groups.items(), start=1):
		total = sum(i["kuantitas"] for i in items)
		jumlah = len(items)
		status = "MENGUMPULKAN"
		results.append(Permintaan(
			id=idx,
			namaBarang=barang,
			totalKuantitas=total,
			unit=unit,
			jumlahPartisipan=jumlah,
			status=status,
		))
	return results


def encode_candid_record(p: Permintaan) -> str:
	return f'(record {{ id = {p.id} : nat; namaBarang = "{p.namaBarang}"; totalKuantitas = {p.totalKuantitas} : nat; unit = "{p.unit}"; jumlahPartisipan = {p.jumlahPartisipan} : nat; status = "{p.status}" }})'


def kirim_ke_icp(permintaan: Permintaan) -> None:
	if not CANISTER_ID:
		raise RuntimeError("Environment KAWAN_UMKM_CANISTER_ID is not set")
	candid_arg = encode_candid_record(permintaan)
	cmd = [
		"dfx", "canister", "--network", DFX_NETWORK, "call", CANISTER_ID,
		"tambahPermintaan", candid_arg
	]
	result = subprocess.run(
		cmd,
		stdout=subprocess.PIPE,
		stderr=subprocess.PIPE,
		text=True,
		check=False,
	)
	if result.returncode != 0:
		raise RuntimeError(f"DFX call failed: {result.stderr}")


AgenAgregator = Agent(name="AgenAgregator")

@AgenAgregator.on_interval(period=60.0)
async def interval_task(ctx: Context):
	aggregated = group_and_aggregate(data_umkm)
	berhasil = 0
	for p in aggregated:
		try:
			kirim_ke_icp(p)
			berhasil += 1
		except Exception as e:
			ctx.logger.error(f"Gagal mengirim ke ICP: {e}")
	ctx.logger.info(f"Terkirim {berhasil}/{len(aggregated)} permintaan teragregasi ke ICP")


if __name__ == "__main__":
	AgenAgregator.run()