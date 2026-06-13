"use client";

import { TrendingUp, AlertTriangle, Info } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
}

interface RecommendationPanelProps {
  insights: string[];
  recommendations: Recommendation[];
  summary: string;
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Tinggi: "bg-red-500/20 text-red-400 border border-red-500/30",
    Sedang: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Rendah: "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  const icons: Record<string, React.ReactNode> = {
    Tinggi: <AlertTriangle className="w-3 h-3" />,
    Sedang: <TrendingUp className="w-3 h-3" />,
    Rendah: <Info className="w-3 h-3" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        styles[priority] || styles["Rendah"]
      }`}
    >
      {icons[priority]}
      {priority}
    </span>
  );
}

export default function RecommendationPanel({
  insights,
  recommendations,
  summary,
}: RecommendationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-blue-400 mb-2">
          📋 Ringkasan Eksekutif
        </h2>
        <p className="text-gray-300 leading-relaxed">{summary}</p>
      </div>

      {/* Insights */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          💡 Key Insights
        </h2>
        <ul className="space-y-3">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          🎯 Rekomendasi Strategis
        </h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-white font-semibold text-sm">
                  {rec.title}
                </h3>
                <PriorityBadge priority={rec.priority} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}