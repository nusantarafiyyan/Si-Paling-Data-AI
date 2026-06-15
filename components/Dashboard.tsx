"use client";

import { useState, useEffect } from "react";
import { RefreshCw, FileSpreadsheet, Loader2, TrendingUp, Database, Columns, Hash } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              AI Data Analytics Dashboard
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <FileSpreadsheet className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">{fileName}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400 text-sm">
                {data.length} baris · {headers.length} kolom
              </span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl px-4 py-2 text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Ganti File
          </button>
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