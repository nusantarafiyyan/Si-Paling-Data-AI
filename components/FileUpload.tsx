"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle, BarChart3, Brain, Zap, Shield, TrendingUp, MessageSquare } from "lucide-react";
import Papa from "papaparse";

interface FileUploadProps {
  onDataLoaded: (data: Record<string, string>[], headers: string[], fileName: string) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setError("Hanya file CSV yang didukung.");
        return;
      }
      setError("");
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          const data = results.data as Record<string, string>[];
          if (data.length === 0) {
            setError("File CSV kosong atau tidak valid.");
            return;
          }
          onDataLoaded(data, headers, file.name);
        },
        error: () => {
          setError("Gagal membaca file. Pastikan format CSV valid.");
        },
      });
    },
    [onDataLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-white" />,
      title: "Analisis AI Mendalam",
      desc: "Didukung oleh Groq LLaMA 3.3 70B, model AI terkuat yang mampu membaca pola tersembunyi dalam data bisnis kamu secara instan.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Visualisasi Otomatis",
      desc: "AI secara otomatis memilih jenis chart terbaik untuk merepresentasikan datamu secara akurat dan mudah dipahami.",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Rekomendasi Strategis",
      desc: "Dapatkan 5 langkah actionable berbasis data yang bisa langsung dieksekusi oleh tim manajemen.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      title: "Chat Interaktif",
      desc: "Tanya apa saja tentang datamu dalam Bahasa Indonesia. AI menjawab dengan analisis spesifik berdasarkan dataset kamu.",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Proses Super Cepat",
      desc: "Analisis ribuan baris data dalam hitungan detik. Hasil langsung tersaji di dashboard interaktif.",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Data Tetap Aman",
      desc: "Data kamu diproses langsung dan tidak disimpan di server manapun. Privasi perusahaan tetap terjaga.",
      color: "from-rose-500 to-pink-600",
    },
  ];

  const steps = [
    { number: "01", title: "Upload CSV", desc: "Drag & drop file CSV data perusahaan kamu ke dalam platform" },
    { number: "02", title: "AI Analisis", desc: "Groq LLaMA memproses dan menganalisis seluruh data secara otomatis" },
    { number: "03", title: "Lihat Dashboard", desc: "Hasil analisis, chart, dan rekomendasi strategis langsung tersaji" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Si Paling Data</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
            <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
            <a href="#upload" className="hover:text-white transition-colors">Mulai</a>
          </div>
          <a
            href="#upload"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold px-5 py-2 rounded-full"
          >
            Coba Sekarang
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 mb-8">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Powered by Groq LLaMA 3.3 70B Parameters
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Analisis Data
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Bisnis dengan AI
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload data CSV perusahaan kamu dan dapatkan analisis mendalam,
            visualisasi interaktif, serta rekomendasi strategis dari AI dalam hitungan detik.
          </p>

          <div className="flex justify-center gap-12 mb-12">
            {[
              { value: "70B", label: "Parameter AI" },
              { value: "<5s", label: "Waktu Analisis" },
              { value: "100%", label: "Bahasa Indonesia" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <a
            href="#upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-2xl text-lg"
          >
            Mulai Analisis Gratis
            <TrendingUp className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Kenapa{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Si Paling Data?
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Platform analisis data bisnis berbasis AI yang dirancang khusus untuk kebutuhan perusahaan Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section id="cara-kerja" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cara Kerja</h2>
            <p className="text-gray-400">Tiga langkah sederhana untuk mendapatkan insight bisnis yang mendalam</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4">
              Mulai{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Sekarang
              </span>
            </h2>
            <p className="text-gray-400">Upload file CSV dan biarkan AI bekerja untuk kamu</p>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
            className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-violet-500 bg-violet-500/10"
                : "border-white/20 bg-white/5 hover:border-violet-500/50"
            }`}
          >
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-4">
              <div className={`p-5 rounded-2xl ${isDragging ? "bg-violet-500/20" : "bg-white/10"}`}>
                <Upload className={`w-10 h-10 ${isDragging ? "text-violet-400" : "text-gray-400"}`} />
              </div>
              <div>
                <p className="text-white text-xl font-bold mb-1">
                  {isDragging ? "Lepaskan file di sini" : "Drag & drop file CSV"}
                </p>
                <p className="text-gray-500">atau klik untuk memilih file</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FileText className="w-4 h-4" />
                <span>Hanya mendukung format .CSV</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-gray-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <BarChart3 className="w-3 h-3 text-white" />
          </div>
          <span className="text-white font-semibold">Si Paling Data</span>
        </div>
        <p>Platform Analisis Data Bisnis Berbasis AI · Powered by Groq LLaMA 3.3 70B</p>
      </footer>

    </div>
  );
}