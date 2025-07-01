"use client";
import { useState } from "react";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

export default function CariBarang({
  onBack,
  onSearch,
}: {
  onBack: () => void;
  onSearch: (keyword: string) => void;
}) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword);
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

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8 text-center mt-20">
        Cari Barang
      </h1>

      <div className="flex w-full max-w-md sm:max-w-xl items-center bg-white rounded-full shadow-lg overflow-hidden">
        <span className="pl-4 text-gray-400 text-xl">
          <FiSearch />
        </span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari kode, kategori, dan nama barang"
          className="flex-grow px-3 py-3 text-sm sm:text-base text-gray-800 bg-transparent focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 sm:px-5 py-3 rounded-r-full hover:bg-gray-800"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
