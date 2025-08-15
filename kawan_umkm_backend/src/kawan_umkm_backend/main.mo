import Buffer "mo:base/Buffer";

actor {
	public type Permintaan = {
		id: Nat;
		namaBarang: Text;
		totalKuantitas: Nat;
		unit: Text;
		jumlahPartisipan: Nat;
		status: Text;
	};

	stable var permintaanList : [Permintaan] = [];

	public query func getPermintaan() : async [Permintaan] {
		permintaanList
	};

	public func tambahPermintaan(permintaan: Permintaan) : async () {
		var ditemukan: Bool = false;
		let buffer = Buffer.Buffer<Permintaan>(permintaanList.size());
		for (item in permintaanList.vals()) {
			if (item.id == permintaan.id) {
				buffer.add(permintaan);
				ditemukan := true;
			} else {
				buffer.add(item);
			};
		};
		if (!ditemukan) {
			buffer.add(permintaan);
		};
		permintaanList := Buffer.toArray(buffer);
	};

	public func resetData() : async () {
		permintaanList := [];
	};
}