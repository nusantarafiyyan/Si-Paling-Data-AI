"use client";

import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";
import LoginPage from "@/components/LoginPage";

interface User {
  email: string;
  role: "creator" | "user";
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, string>[] | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load user dari localStorage saat pertama buka
  useEffect(() => {
    const savedUser = localStorage.getItem("sipaling_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("sipaling_user");
      }
    }
    setIsHydrated(true);
  }, []);

  const handleLogin = (email: string, role: "creator" | "user") => {
    const userData = { email, role };
    setUser(userData);
    // Simpan ke localStorage supaya tetap login
    localStorage.setItem("sipaling_user", JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    // Hapus dari localStorage saat logout
    localStorage.removeItem("sipaling_user");
    setCsvData(null);
    setHeaders([]);
    setFileName("");
  };

  const handleDataLoaded = (
    data: Record<string, string>[],
    headers: string[],
    fileName: string
  ) => {
    setCsvData(data);
    setHeaders(headers);
    setFileName(fileName);
  };

  const handleReset = () => {
    setCsvData(null);
    setHeaders([]);
    setFileName("");
  };

  // Tunggu hydration selesai dulu biar tidak flicker
  if (!isHydrated) return null;

  // Tampilkan halaman login
  if (showLogin) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setShowLogin(false)}
      />
    );
  }

  // Sudah login + upload CSV → dashboard
  if (user && csvData) {
    return (
      <Dashboard
        data={csvData}
        headers={headers}
        fileName={fileName}
        onReset={handleReset}
        userEmail={user.email}
        userRole={user.role}
        onLogout={handleLogout}
      />
    );
  }

  // Default → landing page
  return (
    <FileUpload
      onDataLoaded={handleDataLoaded}
      user={user}
      onLoginRequired={() => setShowLogin(true)}
      onLogout={handleLogout}
    />
  );
}