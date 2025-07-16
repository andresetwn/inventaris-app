"use client";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function HapusBarang({ onBack }: { onBack: () => void }) {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative px-4 py-8">
      <button
        onClick={onBack}
        className="fixed right-4 top-20 sm:right-8 z-50 bg-white text-black px-3 py-2 rounded-md shadow hover:bg-gray-500 transition flex items-center space-x-2 text-sm sm:text-base"
      >
        <FiArrowLeft className="text-base sm:text-lg" />
        <span>Kembali</span>
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-red-600 text-center mt-6">
        Hapus Barang
      </h1>
        <form
          onSubmit={handleDelete}
          className="bg-white shadow-lg text-black rounded-md p-6 w-full max-w-md space-y-4"
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
     
    </div>
  );
}
