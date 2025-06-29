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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative px-4">
      <button
        onClick={onBack}
        className="absolute top-28 right-12 bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-500 transition flex space-x-1 items-center"
      >
        <FiArrowLeft />
        <span>Kembali</span>
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Cari Barang
      </h1>

      <div className="flex w-full max-w-xl items-center bg-white rounded-full shadow-lg overflow-hidden">
        <span className="pl-4 text-gray-400 text-xl">
          <FiSearch />
        </span>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari kode, kategori, dan nama barang di sini"
          className="flex-grow px-4 py-3 text-gray-800 bg-transparent focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-5 py-3 rounded-r-full hover:bg-gray-800"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

