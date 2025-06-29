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
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Daftar Barang</h1>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-sm rounded-lg">
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
                  className="border-b border-gray-700"
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
      )}
    </div>
  );
}
