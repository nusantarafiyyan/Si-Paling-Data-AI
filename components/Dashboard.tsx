"use client";

import { useState } from "react";
import { RefreshCw, FileSpreadsheet, Loader2, TrendingUp, Database, Columns, Hash, Download } from "lucide-react";
import ChartSection from "./ChartSection";
import RecommendationPanel from "./RecommendationPanel";
import ChatPanel from "./ChatPanel";

interface Recommendation {
  title: string;
  description: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
}

interface ChartSuggestion {
  type: "bar" | "line" | "pie" | "area";
  title: string;
  xKey: string;
  yKey: string;
  description: string;
}

interface AnalysisResult {
  summary: string;
  insights: string[];
  recommendations: Recommendation[];
  chartSuggestions: ChartSuggestion[];
}

interface DashboardProps {
  data: Record<string, string>[];
  headers: string[];
  fileName: string;
  onReset: () => void;
  userEmail: string;
  userRole: "creator" | "user";
  onLogout: () => void;
}

function computeStats(data: Record<string, string>[], headers: string[]) {
  const numericHeaders = headers.filter((h) =>
    data.slice(0, 10).some((row) => !isNaN(parseFloat(row[h])))
  );

  let maxVal = -Infinity;
  let minVal = Infinity;
  let maxCol = "";
  let minCol = "";
  let totalSum = 0;
  let totalCount = 0;

  numericHeaders.forEach((h) => {
    data.forEach((row) => {
      const val = parseFloat(row[h]);
      if (!isNaN(val)) {
        if (val > maxVal) { maxVal = val; maxCol = h; }
        if (val < minVal) { minVal = val; minCol = h; }
        totalSum += val;
        totalCount++;
      }
    });
  });

  const avg = totalCount > 0 ? (totalSum / totalCount).toFixed(1) : "N/A";

  return {
    totalRows: data.length,
    totalCols: headers.length,
    maxVal: maxVal === -Infinity ? "N/A" : maxVal.toLocaleString(),
    minVal: minVal === Infinity ? "N/A" : minVal.toLocaleString(),
    avg,
    maxCol,
    minCol,
  };
}

export default function Dashboard({
  data,
  headers,
  fileName,
  onReset,
  userEmail,
  userRole,
  onLogout,
}: DashboardProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  const stats = computeStats(data, headers);

  const csvPreview = data
    .slice(0, 50)
    .map((row) => headers.map((h) => row[h] || "").join(","))
    .join("\n");

  const fullCsvData = headers.join(",") + "\n" + csvPreview;

  const runAnalysis = async () => {
    setIsLoading(true);
    setError("");

    const loadingSteps = [
      "Membaca struktur data...",
      "Mengidentifikasi pola...",
      "Menganalisis tren...",
      "Menyusun insight...",
      "Menyiapkan rekomendasi...",
      "Membuat visualisasi...",
    ];
    let stepIndex = 0;
    setLoadingText(loadingSteps[0]);
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % loadingSteps.length;
      setLoadingText(loadingSteps[stepIndex]);
    }, 1500);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          csvData: fullCsvData,
          headers,
        }),
      });

      const result = await response.json();
      clearInterval(interval);

      if (result.error) {
        setError(result.error);
        return;
      }

      setAnalysis(result);
    } catch {
      clearInterval(interval);
      setError("Gagal menghubungi server. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPos = 20;

      pdf.setFontSize(20);
      pdf.setTextColor(139, 92, 246);
      pdf.text("Si Paling Data - Laporan Analisis", pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`File: ${fileName} | ${data.length} baris · ${headers.length} kolom`, pageWidth / 2, yPos, { align: "center" });
      yPos += 15;

      if (analysis?.summary) {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Ringkasan Eksekutif", 14, yPos);
        yPos += 8;
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        const summaryLines = pdf.splitTextToSize(analysis.summary, pageWidth - 28);
        pdf.text(summaryLines, 14, yPos);
        yPos += summaryLines.length * 6 + 10;
      }

      if (analysis?.insights?.length) {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Key Insights", 14, yPos);
        yPos += 8;
        analysis.insights.forEach((insight, i) => {
          if (yPos + 20 > 270) { pdf.addPage(); yPos = 20; }
          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);
          const lines = pdf.splitTextToSize(`${i + 1}. ${insight}`, pageWidth - 28);
          pdf.text(lines, 14, yPos);
          yPos += lines.length * 6 + 4;
        });
        yPos += 6;
      }

      if (analysis?.recommendations?.length) {
        if (yPos > 220) { pdf.addPage(); yPos = 20; }
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Rekomendasi Strategis", 14, yPos);
        yPos += 8;
        analysis.recommendations.forEach((rec, i) => {
          if (yPos + 20 > 270) { pdf.addPage(); yPos = 20; }
          pdf.setFontSize(11);
          pdf.setTextColor(139, 92, 246);
          pdf.text(`${i + 1}. ${rec.title} [${rec.priority}]`, 14, yPos);
          yPos += 6;
          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);
          const lines = pdf.splitTextToSize(rec.description, pageWidth - 28);
          pdf.text(lines, 14, yPos);
          yPos += lines.length * 6 + 6;
        });
      }

      if (yPos > 220) { pdf.addPage(); yPos = 20; }
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Statistik Data", 14, yPos);
      yPos += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Total Baris: ${stats.totalRows}`, 14, yPos); yPos += 6;
      pdf.text(`Total Kolom: ${stats.totalCols}`, 14, yPos); yPos += 6;
      pdf.text(`Nilai Tertinggi: ${stats.maxVal} (${stats.maxCol})`, 14, yPos); yPos += 6;
      pdf.text(`Rata-rata: ${stats.avg}`, 14, yPos); yPos += 6;

      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Dibuat oleh Si Paling Data · ${new Date().toLocaleDateString("id-ID")}`, pageWidth / 2, 285, { align: "center" });

      pdf.save(`analisis-${fileName.replace(".csv", "")}.pdf`);
    } catch (err) {
      console.error("Gagal export PDF:", err);
      alert("Gagal mengexport PDF. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div id="dashboard-content" className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              AI Data Analytics Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <FileSpreadsheet className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm truncate max-w-xs">{fileName}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">
                {data.length} baris · {headers.length} kolom
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* User Info */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <div>
                <p className="text-white text-xs font-semibold">{userEmail}</p>
                <p className={`text-xs font-bold ${userRole === "creator" ? "text-violet-400" : "text-cyan-400"}`}>
                  {userRole === "creator" ? "👑 Creator" : "👤 User"}
                </p>
              </div>
            </div>

            {/* Export PDF - hanya muncul setelah analisis */}
            {analysis && (
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90 text-white rounded-xl px-4 py-2 text-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            )}

            {/* Ganti File */}
            <button
              onClick={onReset}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl px-4 py-2 text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Ganti File
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl px-4 py-2 text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <Database className="w-5 h-5 text-violet-400" />,
              label: "Total Baris",
              value: stats.totalRows.toLocaleString(),
              bg: "from-violet-500/10 to-violet-600/5",
              border: "border-violet-500/20",
            },
            {
              icon: <Columns className="w-5 h-5 text-cyan-400" />,
              label: "Total Kolom",
              value: stats.totalCols.toLocaleString(),
              bg: "from-cyan-500/10 to-cyan-600/5",
              border: "border-cyan-500/20",
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
              label: "Nilai Tertinggi",
              value: stats.maxVal,
              sub: stats.maxCol,
              bg: "from-emerald-500/10 to-emerald-600/5",
              border: "border-emerald-500/20",
            },
            {
              icon: <Hash className="w-5 h-5 text-amber-400" />,
              label: "Rata-rata",
              value: stats.avg,
              bg: "from-amber-500/10 to-amber-600/5",
              border: "border-amber-500/20",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-4`}
            >
              <div className="flex items-center gap-2 mb-3">
                {card.icon}
                <span className="text-gray-400 text-xs">{card.label}</span>
              </div>
              <p className="text-white text-2xl font-bold">{card.value}</p>
              {card.sub && (
                <p className="text-gray-500 text-xs mt-1 truncate">{card.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Data Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">🗂 Preview Data</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="text-left text-gray-400 font-medium pb-3 pr-6 border-b border-gray-800 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-gray-800/50">
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="text-gray-300 py-3 pr-6 whitespace-nowrap"
                      >
                        {row[h] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.length > 5 && (
            <p className="text-gray-600 text-xs mt-3">
              Menampilkan 5 dari {data.length} baris
            </p>
          )}
        </div>

        {/* Analyze Button */}
        {!analysis && (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl px-8 py-4 text-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                <>✨ Analisis dengan AI</>
              )}
            </button>

            {isLoading && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <p className="text-gray-400 text-sm animate-pulse">{loadingText}</p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <RecommendationPanel
              summary={analysis.summary}
              insights={analysis.insights}
              recommendations={analysis.recommendations}
            />
            <ChartSection
              data={data}
              chartSuggestions={analysis.chartSuggestions}
            />
            <ChatPanel csvData={fullCsvData} headers={headers} />

            <div className="flex justify-center pb-6">
              <button
                onClick={runAnalysis}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl px-6 py-3 text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Analisis Ulang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}