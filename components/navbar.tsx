"use client";

import Link from "next/link";
import { useState } from "react";
import LoginPopup from "./login";
import { useAuth } from "@/context/authContext";
import { saveAs } from "file-saver";
import { supabase } from "@/lib/supabase";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { loggedInUser, setLoggedInUser } = useAuth();

  const handleLoginSuccess = (username: string) => {
    setLoggedInUser(username);
    setShowLogin(false);
  };

  const handleLogout = () => {
    const confirmLogout = confirm("Yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      setLoggedInUser(null);
    }
  };

  const handleDownloadLaporan = async () => {
    const tanggalLaporan = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase.from("Barang_Warput").select("*");

    if (error || !data) {
      alert("Gagal mengambil data laporan.");
      return;
    }

    const csv = [
      [
        "Tanggal Input",
        "Kode Barang",
        "Nama Barang",
        "Kategori",
        "Harga",
        "Stok",
      ].join(","),
      ...data.map((barang) =>
        [
          barang.tanggal,
          barang.kode_barang,
          barang.nama_barang,
          barang.kategori,
          barang.harga,
          barang.stok,
        ]
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `laporan-stok-warput-${tanggalLaporan}.csv`);
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-gray-900 text-white py-3 shadow-md z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="text-2xl font-bold tracking-wide px-4">
            WarPut
          </Link>

          <div className="hidden md:flex space-x-6 items-center text-lg">
            <Link href="/" className="hover:underline">
              Beranda
            </Link>
            <Link href="#DaftarBarang" className="hover:underline">
              Daftar Barang
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loggedInUser && (
              <button
                onClick={handleDownloadLaporan}
                className="text-base bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Download Laporan Stok
              </button>
            )}
            {loggedInUser ? (
              <>
                <span className="text-lg">Hello, {loggedInUser}</span>
                <button
                  onClick={handleLogout}
                  className="text-lg bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Keluar
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-black px-4 py-1 rounded-md text-lg hover:bg-gray-200"
              >
                Masuk
              </button>
            )}
          </div>

          
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        
        {menuOpen && (
          <div className="md:hidden px-4 py-2 space-y-3 text-lg text-center bg-gray-800">
            <Link
              href="/"
              className="block hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="#DaftarBarang"
              className="block hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              Daftar Barang
            </Link>
            {loggedInUser && (
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleDownloadLaporan();
                  }}
                  className="block bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                >
                  Download Laporan Stok
                </button>
              </div>
            )}
            {loggedInUser ? (
              <div className="flex flex-col items-center space-y-2">
                <span className="block">Hello, {loggedInUser}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  setMenuOpen(false);
                }}
                className="bg-white text-black px-4 py-1 rounded-md hover:bg-gray-200"
              >
                Masuk
              </button>
            )}
          </div>
        )}
      </nav>

      <LoginPopup
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
