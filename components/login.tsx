"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LoginPopup({
  isOpen,
  onClose,
  onLoginSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setMessage("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        onLoginSuccess(username);
        setMessage("Login berhasil!");
        onClose();
      } else {
        setMessage(data.message || "Login gagal. Periksa kembali akun Anda.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-xl w-96 relative"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 text-2xl hover:text-black"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Masuk ke WarPut
            </h2>

            {message && (
              <p
                className={`text-center mb-4 ${
                  message.includes("berhasil")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full p-3 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full p-3 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-md text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
