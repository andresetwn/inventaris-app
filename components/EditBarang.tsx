"use client";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function EditBarang({
  onBack,
  isLoggedIn,
}: {
  onBack: () => void;
  isLoggedIn: boolean;
}) {
  const [kodeBarang, setKodeBarang] = useState("");
  const [namaBaru, setNamaBaru] = useState("");
  const [kategoriBaru, setKategoriBaru] = useState("");
  const [hargaBaru, setHargaBaru] = useState<number | undefined>();
  const [stokBaru, setStokBaru] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">
          Silakan login terlebih dahulu untuk mengedit barang.
        </p>
      </div>
    );
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!kodeBarang.trim()) {
      setMessage("Kode barang wajib diisi.");
      return;
    }

    setLoading(true);

    const { data: barang, error: fetchError } = await supabase
      .from("Barang_Warput")
      .select("*")
      .eq("kode_barang", kodeBarang)
      .single();

    if (fetchError || !barang) {
      setMessage(`Barang dengan kode "${kodeBarang}" tidak ditemukan.`);
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("Barang_Warput")
      .update({
        nama_barang: namaBaru || barang.nama_barang,
        kategori: kategoriBaru || barang.kategori,
        harga: hargaBaru ?? barang.harga,
        stok: stokBaru ?? barang.stok,
        tanggal: new Date().toISOString().slice(0, 10),
      })
      .eq("kode_barang", kodeBarang);

    if (updateError) {
      console.error("Gagal mengedit:", updateError.message);
      setMessage("Gagal memperbarui data barang.");
    } else {
      setMessage("Data barang berhasil diperbarui.");
      setNamaBaru("");
      setKategoriBaru("");
      setHargaBaru(undefined);
      setStokBaru(undefined);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative px-4">
      <button
        onClick={onBack}
        className="absolute top-28 right-12 bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-500 transition flex space-x-1 items-center"
      >
        <FiArrowLeft />
        <span>Kembali</span>
      </button>

      <h1 className="text-3xl font-bold mb-6">Edit Barang</h1>

      <form
        onSubmit={handleEdit}
        className="bg-white shadow-lg text-black rounded p-6 w-full max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Kode Barang"
          value={kodeBarang}
          onChange={(e) => setKodeBarang(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Nama Baru"
          value={namaBaru}
          onChange={(e) => setNamaBaru(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Kategori Baru"
          value={kategoriBaru}
          onChange={(e) => setKategoriBaru(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Harga Baru"
          value={hargaBaru ?? ""}
          onChange={(e) => setHargaBaru(parseInt(e.target.value))}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Stok Baru"
          value={stokBaru ?? ""}
          onChange={(e) => setStokBaru(parseInt(e.target.value))}
          className="w-full border px-4 py-2 rounded"
        />

        {message && (
          <p
            className={`text-sm text-center ${
              message.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
