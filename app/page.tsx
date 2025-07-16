"use client";
import { useState, useEffect } from "react";
import HomeMenu from "@/components/home";
import CariBarang from "@/components/CariBarang";
import TambahBarang from "@/components/TambahBarang";
import EditBarang from "@/components/EditBarang";
import HapusBarang from "@/components/HapusBarang";
import Navbar from "@/components/navbar";
import DaftarBarang from "@/components/DaftarBarang";
import LoginPopup from "@/components/login";
import { useAuth } from "@/context/authContext";
import Footer from "@/components/footer";
import UpdateStok from "@/components/UpdateStok";

export default function Page() {
  const [mode, setMode] = useState<
    "home" | "cari" | "tambah" | "edit" |"updateStok" | "hapus"
  >("home");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const { loggedInUser, setLoggedInUser } = useAuth();
  const [keyword, setKeyword] = useState("");

  const goHome = () => setMode("home");

  const requireLogin = (action: () => void) => {
    if (loggedInUser) {
      action();
    } else {
      alert("Silakan login terlebih dahulu.");
      setShowLogin(true);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = atob(token);
      const username = decoded.split(":")[0];
      setLoggedInUser(username);
    }
  }, [setLoggedInUser]);

  const handleLoginSuccess = (username: string) => {
    setLoggedInUser(username);
    setShowLogin(false);
  };

  if (mode === "cari") {
    return (
      <CariBarang
        onBack={goHome}
        onSearch={(keyword) => {
          setSearchKeyword(keyword);
          setMode("home");
        }}
      />
    );
  }

  if (mode === "tambah") {
    return <TambahBarang onBack={goHome} />;
  }

  if (mode === "edit") {
    return <EditBarang onBack={goHome} />;
  }

  if (mode === "hapus") {
    return <HapusBarang onBack={goHome}  />;
  }
  if (mode === "updateStok") {
    return <UpdateStok onBack={goHome}  />;
  }
  return (
    <main>
      <Navbar />
      <HomeMenu
        onCari={() => setMode("cari")}
        onTambah={() => requireLogin(() => setMode("tambah"))}
        onEdit={() => requireLogin(() => setMode("edit"))}
        onUpdateStok={() => requireLogin(() => setMode("updateStok"))}
        onHapus={() => requireLogin(() => setMode("hapus"))}
        isLoggedIn={!!loggedInUser}
        keyword={keyword}
        setKeyword={setKeyword}
        handleSearch={() => {
          setSearchKeyword(keyword);
          setKeyword("");
        }}
      />
      <section id="DaftarBarang">
        <DaftarBarang keyword={searchKeyword} />
      </section>

      <LoginPopup
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Footer />
    </main>
  );
}
