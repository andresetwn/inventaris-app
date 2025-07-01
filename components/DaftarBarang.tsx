"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Barang = {
  kode_barang: string;
  stok: number;
  kategori: string;
  nama_barang: string;
  harga: number;
};

export default function DaftarBarang({ keyword = "" }: { keyword?: string }) {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarang = async () => {
      const { data, error } = await supabase.from("Barang_Warput").select("*");
      if (error) {
        console.error("Gagal mengambil data:", error.message);
      } else {
        const sortedData = data.sort((a, b) =>
          a.kode_barang.localeCompare(b.kode_barang)
        );
        setBarangList(sortedData);
      }
      setLoading(false);
    };

    fetchBarang();
  }, []);

  const filteredList = barangList.filter((barang) => {
    const kata = keyword.toLowerCase();
    return (
      barang.nama_barang.toLowerCase().includes(kata) ||
      barang.kategori.toLowerCase().includes(kata) ||
      barang.kode_barang.toLowerCase().includes(kata)
    );
  });

  return (
    <div className="p-4 sm:p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Daftar Barang
      </h1>

      {loading ? (
        <p className="text-center text-gray-300">Memuat data...</p>
      ) : filteredList.length === 0 ? (
        <p className="text-center text-red-400">Tidak ada barang ditemukan.</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block">
            <table className="w-full bg-gray-800 text-sm sm:text-base rounded-lg">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="py-3 px-4 text-left">Kode</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">Harga</th>
                  <th className="py-3 px-4 text-left">Stok</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((barang) => (
                  <tr
                    key={barang.kode_barang}
                    className="border-b border-gray-700 hover:bg-gray-700/50 transition"
                  >
                    <td className="py-3 px-4">{barang.kode_barang}</td>
                    <td className="py-3 px-4">{barang.kategori}</td>
                    <td className="py-3 px-4">{barang.nama_barang}</td>
                    <td className="py-3 px-4">
                      Rp {barang.harga.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4">{barang.stok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-4 sm:hidden">
            {filteredList.map((barang) => (
              <div
                key={barang.kode_barang}
                className="bg-gray-800 rounded-lg p-4 shadow"
              >
                <p>
                  <span className="font-semibold">Kode:</span>{" "}
                  {barang.kode_barang}
                </p>
                <p>
                  <span className="font-semibold">Kategori:</span>{" "}
                  {barang.kategori}
                </p>
                <p>
                  <span className="font-semibold">Nama:</span>{" "}
                  {barang.nama_barang}
                </p>
                <p>
                  <span className="font-semibold">Harga:</span> Rp{" "}
                  {barang.harga.toLocaleString("id-ID")}
                </p>
                <p>
                  <span className="font-semibold">Stok:</span> {barang.stok}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
