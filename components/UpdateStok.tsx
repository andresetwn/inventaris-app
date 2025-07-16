"use client";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function UpdateStokBarang({ onBack }: { onBack: () => void }) {
  const [kodeBarang, setKodeBarang] = useState("");
  const [jumlahPerubahan, setJumlahPerubahan] = useState<number | undefined>();
  const [tipe, setTipe] = useState<"Masuk" | "Keluar">("Masuk");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateStok = async () => {
    setMessage("");
    if (
      !kodeBarang.trim() ||
      jumlahPerubahan === undefined ||
      isNaN(jumlahPerubahan) ||
      jumlahPerubahan <= 0
    ) {
      setMessage("Mohon isi kode barang dan jumlah perubahan dengan benar.");
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

    const stokBaru =
      tipe === "Masuk"
        ? barang.stok + jumlahPerubahan
        : barang.stok - jumlahPerubahan;

    if (stokBaru < 0) {
      setMessage("Stok tidak boleh kurang dari 0.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("Barang_Warput")
      .update({
        stok: stokBaru,
        tanggal: new Date().toISOString().slice(0, 10),
      })
      .eq("kode_barang", kodeBarang);

    if (updateError) {
      console.error(updateError.message);
      setMessage("Gagal mengupdate stok barang.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("Persediaan")
      .insert({
        kode_barang: kodeBarang,
        tipe: tipe,
        jumlah: jumlahPerubahan,
        tanggal: new Date().toISOString().slice(0, 10),
      });

    if (insertError) {
      console.error(insertError.message);
      setMessage("Stok terupdate, tetapi gagal mencatat di persediaan.");
    } else {
      setMessage(`Stok barang "${kodeBarang}" berhasil diupdate & dicatat.`);
      setKodeBarang("");
      setJumlahPerubahan(undefined);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <button
        onClick={onBack}
        className="fixed top-20 right-4 sm:right-8 z-50 bg-white text-black px-3 py-2 rounded-md shadow hover:bg-gray-500 transition flex items-center space-x-2 text-sm sm:text-base"
      >
        <FiArrowLeft className="text-base sm:text-lg" />
        <span>Kembali</span>
      </button>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center mt-20">
        Update Stok Barang & Catat Persediaan
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          value={kodeBarang}
          onChange={(e) => setKodeBarang(e.target.value)}
          placeholder="Kode Barang"
          className="px-4 py-2 rounded bg-white text-black focus:outline-none"
        />

        <select
          value={tipe}
          onChange={(e) => setTipe(e.target.value as "Masuk" | "Keluar")}
          className="px-4 py-2 rounded bg-white text-black focus:outline-none"
        >
          <option value="Masuk">Masuk</option>
          <option value="Keluar">Keluar</option>
        </select>

        <input
          type="number"
          value={jumlahPerubahan !== undefined ? jumlahPerubahan : ""}
          onChange={(e) => {
            const value = e.target.value;
            setJumlahPerubahan(value === "" ? undefined : parseInt(value));
          }}
          placeholder="Jumlah Barang"
          className="px-4 py-2 rounded bg-white text-black focus:outline-none"
        />

        {message && (
          <p
            className={`text-center ${
              message.includes("berhasil") ? "text-green-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          onClick={handleUpdateStok}
          disabled={loading}
          className={`bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Menyimpan..." : "Update & Catat"}
        </button>
      </div>
    </div>
  );
}
