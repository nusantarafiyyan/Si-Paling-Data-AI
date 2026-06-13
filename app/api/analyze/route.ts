import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { csvData, headers, question } = await request.json();

    const isChat = !!question;

    const prompt = isChat
      ? `Kamu adalah analis data profesional. Tugasmu HANYA menjawab pertanyaan yang berkaitan langsung dengan data CSV yang diberikan.

Headers: ${headers.join(", ")}
Data (sample 50 baris pertama):
${csvData}

Pertanyaan dari user: ${question}

ATURAN WAJIB:
1. Jika pertanyaan TIDAK berkaitan dengan data di atas, tolak dengan sopan dan arahkan user untuk bertanya seputar data.
2. Jika pertanyaan berkaitan dengan data, jawab dengan spesifik dan akurat dalam Bahasa Indonesia.
3. JANGAN menjawab pertanyaan di luar konteks data seperti resep makanan, berita, atau topik umum lainnya.
4. Selalu referensikan kolom atau angka dari data saat menjawab.`
      : `Kamu adalah analis data bisnis profesional. Analisis data CSV berikut dan berikan response dalam format JSON yang valid.

Headers: ${headers.join(", ")}
Data (sample 50 baris pertama):
${csvData}

Berikan analisis dalam format JSON berikut (HANYA JSON, tanpa teks lain):
{
  "summary": "Ringkasan eksekutif data dalam 2-3 kalimat",
  "insights": [
    "insight 1",
    "insight 2", 
    "insight 3",
    "insight 4",
    "insight 5"
  ],
  "recommendations": [
    {
      "title": "Judul Rekomendasi",
      "description": "Deskripsi langkah strategis",
      "priority": "Tinggi/Sedang/Rendah"
    }
  ],
  "chartSuggestions": [
    {
      "type": "bar/line/pie/area",
      "title": "Judul Chart",
      "xKey": "nama_kolom_x",
      "yKey": "nama_kolom_y",
      "description": "Kenapa chart ini relevan"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || "";

    if (isChat) {
      return NextResponse.json({ answer: content });
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const analysisResult = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Gagal menganalisis data. Silakan coba lagi." },
      { status: 500 }
    );
  }
}