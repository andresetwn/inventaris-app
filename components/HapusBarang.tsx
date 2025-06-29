"use client";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function HapusBarang({
  onBack,
  isLoggedIn,
}: {
  onBack: () => void;
  isLoggedIn: boolean;
}) {
  const [kodeBarang, setKodeBarang] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!kodeBarang.trim()) {
      setMessage("Kode Barang tidak boleh kosong.");
      return;
    }

    setLoading(true);

    const { data: existingBarang, error: fetchError } = await supabase
      .from("Barang_Warput")
      .select("*")
      .eq("kode_barang", kodeBarang)
      .single();

    if (fetchError || !existingBarang) {
      setMessage(`Tidak ada barang dengan kode "${kodeBarang}".`);
      setLoading(false);
      return;
    }

    const confirm = window.confirm(
      `Apakah Anda yakin ingin menghapus barang dengan kode "${kodeBarang}"?`
    );

    if (!confirm) {
      setLoading(false);
      return;
    }


    const { error } = await supabase
      .from("Barang_Warput")
      .delete()
      .eq("kode_barang", kodeBarang);

    if (error) {
      console.error("Gagal menghapus:", error.message);
      setMessage("Terjadi kesalahan saat menghapus barang.");
    } else {
      setMessage("Barang berhasil dihapus.");
      setKodeBarang("");
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

      <h1 className="text-3xl font-bold mb-6 text-red-700">Hapus Barang</h1>

      {!isLoggedIn ? (
        <p className="bg-white text-red-700 p-4 rounded shadow text-center">
          Silakan login terlebih dahulu untuk menghapus barang.
        </p>
      ) : (
        <form
          onSubmit={handleDelete}
          className="bg-white shadow-lg text-black rounded p-6 w-full max-w-md space-y-4"
        >
          <input
            type="text"
            value={kodeBarang}
            onChange={(e) => setKodeBarang(e.target.value)}
            placeholder="Kode Barang"
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
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </form>
      )}
    </div>
  );
}
