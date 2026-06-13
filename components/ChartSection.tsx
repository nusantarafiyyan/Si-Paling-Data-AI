"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

interface ChartSuggestion {
  type: "bar" | "line" | "pie" | "area";
  title: string;
  xKey: string;
  yKey: string;
  description: string;
}

interface ChartSectionProps {
  data: Record<string, string>[];
  chartSuggestions: ChartSuggestion[];
}

function prepareChartData(
  data: Record<string, string>[],
  xKey: string,
  yKey: string
) {
  return data.slice(0, 10).map((row) => ({
    name: row[xKey] || "N/A",
    value: parseFloat(row[yKey]) || 0,
    [xKey]: row[xKey] || "N/A",
    [yKey]: parseFloat(row[yKey]) || 0,
  }));
}

function renderChart(
  type: string,
  chartData: any[],
  xKey: string,
  yKey: string
) {
  switch (type) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "line":
      return (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    case "area":
      return (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
}

export default function ChartSection({
  data,
  chartSuggestions,
}: ChartSectionProps) {
  if (!chartSuggestions || chartSuggestions.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">📊 Visualisasi Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {chartSuggestions.map((chart, index) => {
          const chartData = prepareChartData(data, chart.xKey, chart.yKey);
          return (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-1">{chart.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{chart.description}</p>
              {renderChart(chart.type, chartData, chart.xKey, chart.yKey)}
            </div>
          );
        })}
      </div>
    </div>
  );
}