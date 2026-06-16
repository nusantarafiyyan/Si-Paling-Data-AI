"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { Upload, FileText, AlertCircle, BarChart3, Brain, Zap, Shield, TrendingUp, MessageSquare, ChevronDown, ArrowRight } from "lucide-react";
import Papa from "papaparse";

interface FileUploadProps {
  onDataLoaded: (data: Record<string, string>[], headers: string[], fileName: string) => void;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        error: () => setError("Gagal membaca file. Pastikan format CSV valid."),
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
      desc: "Didukung Groq LLaMA 3.3 70B yang mampu membaca pola tersembunyi dalam data bisnis secara instan.",
      color: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/25",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Visualisasi Otomatis",
      desc: "AI memilih jenis chart terbaik — bar, line, pie, atau area — untuk merepresentasikan data secara akurat.",
      color: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/25",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Rekomendasi Strategis",
      desc: "Dapatkan langkah actionable berbasis data yang bisa langsung dieksekusi tim manajemen.",
      color: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/25",
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      title: "Chat Interaktif",
      desc: "Tanya apa saja tentang datamu dalam Bahasa Indonesia. AI menjawab dengan analisis spesifik.",
      color: "from-orange-500 to-amber-600",
      glow: "shadow-orange-500/25",
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Proses Super Cepat",
      desc: "Analisis ribuan baris data dalam hitungan detik. Hasil langsung tersaji di dashboard interaktif.",
      color: "from-yellow-500 to-orange-600",
      glow: "shadow-yellow-500/25",
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Data Tetap Aman",
      desc: "Data diproses langsung dan tidak disimpan di server manapun. Privasi perusahaan terjaga.",
      color: "from-rose-500 to-pink-600",
      glow: "shadow-rose-500/25",
    },
  ];

  const steps = [
    { number: "01", title: "Upload CSV", desc: "Drag & drop file CSV data perusahaan ke dalam platform", icon: "📁" },
    { number: "02", title: "AI Analisis", desc: "Groq LLaMA memproses dan menganalisis seluruh data otomatis", icon: "🤖" },
    { number: "03", title: "Lihat Dashboard", desc: "Hasil analisis, chart, dan rekomendasi strategis langsung tersaji", icon: "📊" },
  ];

  const stats = [
    { value: "70B", label: "Parameter AI", desc: "Model LLaMA terbesar" },
    { value: "<5s", label: "Waktu Analisis", desc: "Hasil instan" },
    { value: "100%", label: "Bahasa Indonesia", desc: "Fully localized" },
    { value: "∞", label: "Baris Data", desc: "Tanpa batas" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrollY > 50 ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(20px)",
          borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.1)" : "none",
          animation: "fadeSlideDown 0.6s ease 0.2s both",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Si Paling Data
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#fitur" className="hover:text-white transition-colors hover:scale-105 inline-block">Fitur</a>
            <a href="#statistik" className="hover:text-white transition-colors hover:scale-105 inline-block">Statistik</a>
            <a href="#cara-kerja" className="hover:text-white transition-colors hover:scale-105 inline-block">Cara Kerja</a>
            <a href="#upload" className="hover:text-white transition-colors hover:scale-105 inline-block">Mulai</a>
          </div>
          <a href="#upload" className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all hover:scale-105">
            Coba Sekarang
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "3s" }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s", animationDuration: "4s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s", animationDuration: "3.5s" }} />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-300 mb-8 backdrop-blur-sm"
            style={{ animation: "fadeSlideUp 0.8s ease 0.1s both" }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Powered by Groq LLaMA 3.3 · 70B Parameters
            <ArrowRight className="w-3 h-3 text-gray-500" />
          </div>

          <h1
  className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
  style={{ animation: "fadeSlideUp 0.8s ease 0.3s both" }}
>
  <span className="text-white">AI-Powered</span>
  <br />
  <span
    className="bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
    style={{ backgroundSize: "200% auto", animation: "gradient 4s linear infinite" }}
  >
    Data Analytics
  </span>
</h1>

<p
  className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
  style={{ animation: "fadeSlideUp 0.8s ease 0.5s both" }}
>
  Upload your CSV data and get deep insights, interactive visualizations,
  and strategic AI recommendations in seconds.
</p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            style={{ animation: "fadeSlideUp 0.8s ease 0.7s both" }}
          >
            <a
              href="#upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-300"
            >
              Mulai Analisis Gratis
              <TrendingUp className="w-5 h-5" />
            </a>
            <a
              href="#fitur"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
          <span className="text-xs">Scroll untuk lihat lebih</span>
          <div className="w-5 h-8 border border-gray-700 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="statistik" className="py-20 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} className="text-center" delay={i * 0.15}>
                <div className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-gray-500 text-sm">{stat.desc}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Fitur Section */}
      <section id="fitur" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 text-sm text-violet-300 mb-4">
              ✨ Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Kenapa{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Si Paling Data?
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Platform analisis data bisnis berbasis AI yang dirancang khusus untuk kebutuhan perusahaan Indonesia.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={0.1 + i * 0.1}>
                <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-500 group h-full shadow-xl ${feature.glow}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2 text-lg">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section id="cara-kerja" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <AnimatedSection className="text-center mb-16" delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-sm text-cyan-300 mb-4">
              🚀 Mudah & Cepat
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cara Kerja</h2>
            <p className="text-gray-400 text-lg">Tiga langkah sederhana untuk mendapatkan insight bisnis yang mendalam</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={step.number} className="relative text-center" delay={0.1 + index * 0.15}>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[65%] w-[70%] h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-600 flex flex-col items-center justify-center mx-auto shadow-xl shadow-violet-500/30 hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl mb-1">{step.icon}</span>
                    <span className="text-white/60 text-xs font-bold">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-white font-bold mb-2 text-lg">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-2xl mx-auto relative">
          <AnimatedSection className="text-center mb-10" delay={0.1}>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-sm text-emerald-300 mb-4">
              📁 Upload Data
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Mulai{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Sekarang
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Upload file CSV dan biarkan AI bekerja untuk kamu</p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput")?.click()}
              className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isDragging
                  ? "border-violet-500 bg-violet-500/10 scale-105"
                  : "border-white/15 bg-white/5 hover:border-violet-500/50 hover:bg-white/10"
              }`}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-violet-500/5 animate-pulse" />
              )}
              <input id="fileInput" type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
              <div className="flex flex-col items-center gap-4 relative">
                <div className={`p-5 rounded-2xl transition-all ${isDragging ? "bg-violet-500/20 scale-110" : "bg-white/10"}`}>
                  <Upload className={`w-10 h-10 transition-colors ${isDragging ? "text-violet-400" : "text-gray-400"}`} />
                </div>
                <div>
                  <p className="text-white text-xl font-bold mb-1">
                    {isDragging ? "Lepaskan file di sini!" : "Drag & drop file CSV"}
                  </p>
                  <p className="text-gray-500">atau klik untuk memilih file</p>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm bg-white/5 px-4 py-2 rounded-full">
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
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Si Paling Data</span>
            </div>
            <p className="text-gray-600 text-sm text-center">
              Platform Analisis Data Bisnis Berbasis AI · Powered by Groq LLaMA 3.3 70B
            </p>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
              <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
              <a href="#upload" className="hover:text-white transition-colors">Mulai</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}