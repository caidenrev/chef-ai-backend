# Panduan Deployment Backend Serverless Vercel 🚀

Folder ini berisi kode backend lengkap yang siap di-deploy secara instan ke **Vercel** untuk bertindak sebagai **Proxy Serverless aman** untuk aplikasi Android **MASAKIN by Revan**.

Dengan sistem ini, kunci rahasia `GEMINI_API_KEY` Anda akan **tersembunyi dengan aman di server Vercel** dan aplikasi Android Anda bebas dari risiko kebocoran kunci!

---

## 🛠️ Cara Deploy ke Vercel (Pilih Salah Satu)

### Cara A: Deploy Instan Lewat GitHub (Paling Mudah & Populer 🌟)
1. Buat sebuah repositori baru di GitHub Anda (misal namanya `masakin-backend`).
2. Upload/Push **hanya isi folder `backend_vercel` ini** (file `package.json`, `vercel.json`, dan folder `api/`) ke repositori GitHub baru Anda tersebut.
3. Buka Dashboard **[Vercel](https://vercel.com/)** Anda, buat project baru, lalu hubungkan (*import*) repositori GitHub `masakin-backend` Anda tadi.
4. Pada bagian **Environment Variables** sebelum klik Deploy, tambahkan:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *(Masukkan Kunci API Gemini Anda dari Google AI Studio)*
5. Klik **Deploy**! Selesai! Anda akan mendapatkan domain URL gratis (contoh: `https://masakin-revan.vercel.app/`).

---

### Cara B: Deploy Lewat Vercel CLI (Sangat Cepat via Command Line)
Jika Anda memiliki Node.js terinstal di laptop Anda:
1. Buka terminal Anda dan instal Vercel CLI secara global:
   ```bash
   npm install -g vercel
   ```
2. Arahkan terminal Anda masuk ke dalam folder `backend_vercel`:
   ```bash
   cd backend_vercel
   ```
3. Jalankan perintah deploy:
   ```bash
   vercel
   ```
   *(Ikuti petunjuk di terminal untuk login dan setup proyek baru, tekan Enter untuk pilihan default).*
4. Tambahkan API Key Gemini Anda ke dashboard proyek Vercel Anda di bawah tab *Settings -> Environment Variables*.
5. Lakukan deploy ke produksi:
   ```bash
   vercel --prod
   ```

---

## 📲 Hubungkan Aplikasi Android Anda

Setelah Anda sukses melakukan deploy ke Vercel:
1. Anda akan memperoleh **Domain URL Backend** Anda (misalnya: `https://masakin-revan.vercel.app/`).
2. Buka file Kotlin Anda di **`app/src/main/java/com/example/chef_ai_revan/data/api/ApiService.kt`**.
3. Cari baris ke-21 (`private const val BASE_URL = ...`) dan ganti dengan URL Vercel asli milik Anda:
   ```kotlin
   // GANTI URL INI dengan URL dari Vercel Anda yang asli
   private const val BASE_URL = "https://masakin-revan.vercel.app/"
   ```
4. Simpan, dan aplikasi Android MASAKIN by Revan Anda kini resmi menggunakan backend serverless proxy tercanggih dan paling aman skala industri!

