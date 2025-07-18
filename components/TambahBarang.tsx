"use client";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function TambahBarang({ onBack }: { onBack: () => void }) {
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [kategori, setKategori] = useState("");
  const [harga, setHarga] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambah = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!kode.trim() || !nama.trim() || harga === undefined) {
      setMessage("Nama, Kode, dan Harga wajib diisi.");
      return;
    }

    setLoading(true);

    const { data: existing } = await supabase
      .from("Barang_Warput")
      .select("*")
      .eq("kode_barang", kode)
      .single();

    if (existing) {
      setMessage(`Barang dengan kode "${kode}" sudah ada.`);
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("Barang_Warput").insert([
      {
        kode_barang: kode,
        nama_barang: nama,
        kategori,
        harga,
        tanggal: new Date().toISOString().slice(0, 10),
      },
    ]);

    if (insertError) {
      console.error("Gagal menambahkan barang:", insertError.message);
      setMessage("Gagal menambahkan barang.");
    } else {
      setMessage("Barang berhasil ditambahkan.");
      setNama("");
      setKode("");
      setKategori("");
      setHarga(undefined);
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
        Tambah Barang
      </h1>

      <form
        onSubmit={handleTambah}
        className="bg-white shadow-lg text-black rounded-md p-6 w-full max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Nama Barang"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Kode Barang"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Harga"
          value={harga !== undefined ? harga : ""}
          onChange={(e) => {
            const value = e.target.value;
            setHarga(value === "" ? undefined : parseInt(value));
          }}
          className="w-full border px-4 py-2 rounded"
          required
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
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
