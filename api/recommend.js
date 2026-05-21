import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Hanya menerima POST' });
  }

  const { budget, ingredients } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ name: "Error", cost: 0, steps: "API Key belum di-set di Vercel." });
  }

  // Inisialisasi Google AI
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // COBA: Gunakan model 'gemini-1.5-flash' (tanpa -latest) 
  // Jika masih 404, coba ganti ke 'gemini-1.5-pro' untuk testing
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Anda adalah Chef Revan, asisten kuliner khusus anak kos di Indonesia.
    User punya budget: Rp ${budget}.
    Bahan tersedia: ${ingredients || "bebas"}.
    Berikan 1 resep kreatif (rice cooker friendly) di bawah Rp ${budget}.
    
    WAJIB BERIKAN RESPON DALAM JSON MURNI (TANPA TEKS LAIN, TANPA MARKDOWN):
    {
      "name": "Nama Masakan",
      "cost": angka_total_biaya,
      "steps": "Langkah 1. Langkah 2. dst"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Membersihkan format markdown jika AI bandel ngasih ```json ... ```
    let cleanJson = text.trim();
    if (cleanJson.includes("```")) {
      const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        cleanJson = match[1].trim();
      }
    }

    const recipe = JSON.parse(cleanJson);
    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      name: "Resep Darurat",
      cost: 0,
      steps: "Gagal panggil AI, coba cek koneksi atau API Key."
    });
  }
}