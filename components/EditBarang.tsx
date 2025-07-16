"use client";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function EditBarang({ onBack }: { onBack: () => void }) {
  const [kodeBarang, setKodeBarang] = useState("");
  const [namaBaru, setNamaBaru] = useState("");
  const [kategoriBaru, setKategoriBaru] = useState("");
  const [hargaBaru, setHargaBaru] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative px-4 py-8">
      <button
        onClick={onBack}
        className="fixed right-4 top-20 sm:right-8 z-50 bg-white text-black px-3 py-2 rounded-md shadow hover:bg-gray-500 transition flex items-center space-x-2 text-sm sm:text-base"
      >
        <FiArrowLeft className="text-base sm:text-lg" />
        <span>Kembali</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center mt-6">
        Edit Barang
      </h1>

      <form
        onSubmit={handleEdit}
        className="bg-white shadow-lg text-black rounded-md p-6 w-full max-w-md space-y-4"
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
          value={hargaBaru !== undefined ? hargaBaru : ""}
          onChange={(e) => {
            const value = e.target.value;
            setHargaBaru(value === "" ? undefined : parseInt(value));
          }}
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
