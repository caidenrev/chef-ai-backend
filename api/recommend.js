const { GoogleGenAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // 1. Handle Preflight/CORS Options Request
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // 2. Limit request method only to POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const { budget, ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({ error: "Parameter 'ingredients' wajib diisi." });
    }


    const targetBudget = budget || 50000;

    // 3. Initialize Gemini Client using secure Environment Variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Server Error: GEMINI_API_KEY belum dikonfigurasi di dashboard Vercel."
      });
    }

    const genAI = new GoogleGenAI({ apiKey: apiKey });

    // Using gemini-1.5-flash for rapid, lightweight text generation
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // 4. Construct high-fidelity system prompt
    const prompt = `
      Anda adalah Chef AI Masakin yang ahli merancang resep ekonomis untuk anak kos.
      Tolong buatkan resep masakan halal yang lezat berdasarkan bahan berikut: "${ingredients}".
      Estimasi total harga belanja bahan masakan ini di warung lokal Indonesia HARUS berada di bawah Rp ${targetBudget}.
      
      Anda WAJIB memberikan jawaban dalam format JSON yang valid dengan struktur persis seperti berikut:
      {
        "name": "Nama Resep Masakan Yang Jelas",
        "cost": EstimasiBiayaDalamAngkaIntegerRupiah,
        "steps": "Langkah 1.\\nLangkah 2.\\nLangkah 3. (Gunakan pemisah \\n untuk baris baru)"
      }
      
      PENTING: Jangan tambahkan kata pengantar, penutup, atau tanda markdown (seperti \`\`\`json). Berikan objek JSON mentah saja.
    `;

    // 5. Query Gemini AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // 6. Parse and send verified JSON response
    const recipeData = JSON.parse(rawText);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(recipeData);

  } catch (error) {
    console.error("Gemini Serverless Error:", error);
    return res.status(500).json({
      error: "Gagal memproses resep masakan via AI.",
      details: error.message
    });
  }
};
