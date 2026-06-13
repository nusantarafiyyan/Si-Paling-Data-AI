"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [csvData, setCsvData] = useState<Record<string, string>[] | null>(
    null
  );
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

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

  return (
    <main>
      {csvData ? (
        <Dashboard
          data={csvData}
          headers={headers}
          fileName={fileName}
          onReset={handleReset}
        />
      ) : (
        <FileUpload onDataLoaded={handleDataLoaded} />
      )}
    </main>
  );
}