"use client";

import { useState } from "react";
import { RefreshCw, FileSpreadsheet, Loader2 } from "lucide-react";
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

export default function Dashboard({
  data,
  headers,
  fileName,
  onReset,
}: DashboardProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const csvPreview = data
    .slice(0, 50)
    .map((row) => headers.map((h) => row[h] || "").join(","))
    .join("\n");

  const fullCsvData = headers.join(",") + "\n" + csvPreview;

  const runAnalysis = async () => {
    setIsLoading(true);
    setError("");

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

      if (result.error) {
        setError(result.error);
        return;
      }

      setAnalysis(result);
    } catch {
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
          <div className="flex justify-center">
            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl px-8 py-4 text-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menganalisis data...
                </>
              ) : (
                <>
                  ✨ Analisis dengan AI
                </>
              )}
            </button>
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

            {/* Re-analyze button */}
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