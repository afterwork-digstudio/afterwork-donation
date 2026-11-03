# AW Studio Donation Cash - Full Dashboard & Integration Clone

Clone lengkap sistem **Donation Cash System (Roblox)** berbasis **Next.js (App Router)** dan **Tailwind CSS**, dengan tampilan modern Neo-brutalism untuk **AW Studio**.

---

## 📁 Struktur Halaman Dashboard

1. **[`/dashboard`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/page.tsx) - AW Studio Overview**:
   - KPI Metrik: Total Pendapatan (IDR), Total Cash beredar, Transaksi Donasi, dan Universe Aktif.
   - Leaderboard Top Universe (`NEW VERFECT SPACE`, `RBLX WITH EXT DB`, dll.).
   - Feed donasi terbaru secara real-time.
   - Quick action: Simulasi Donasi & Konfigurasi Provider.

2. **[`/dashboard/providers`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/providers/page.tsx) - Providers**:
   - Integrasi 3 provider donasi Indonesia: **Saweria**, **SociaBuzz (TRIBE)**, dan **BagiBagi**.
   - Input Stream Key / Secret / API Key dengan password masking & status tersimpan.
   - Field khusus SociaBuzz: **Webhook HTTP Test Response (`OK`)** anti-duplicate.
   - Tombol **Uji Konfigurasi** (verifikasi HMAC) & **Ganti Webhook URL** (rotasi token lokal).
   - Simulator Webhook Donasi & Tabel Log Pengiriman Webhook Real-Time.

3. **[`/dashboard/donations`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/donations/page.tsx) - Riwayat Donasi**:
   - Pencarian berdasarkan nama donatur, username Roblox, atau ID transaksi.
   - Filter berdasarkan Provider (Saweria, SociaBuzz, BagiBagi) dan Status (Claimed, Pending, Failed).
   - Fitur **Export data transaksi ke CSV**.
   - Tombol **Kreditkan Manual** untuk transaksi yang berstatus pending.

4. **[`/dashboard/fake-donation`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/fake-donation/page.tsx) - Simulator Donasi In-Game**:
   - Menguji notifikasi alert dan sound effect in-game tanpa uang sungguhan.
   - Preset efek suara (*Chime Bell*, *Victory Fanfare*, *Retro Coin*, *Cash Register*).
   - **Interactive Roblox Screen Mockup**: Preview langsung animasi pop-up ScreenGui dan pesan chat di layar Roblox.

5. **[`/dashboard/diagnostics`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/diagnostics/page.tsx) - Diagnostik & Health**:
   - Pemantauan status koneksi Roblox Open Cloud API (latensi respons).
   - Status Webhook Ingress Uptime & pemeriksaan protokol verifikasi.
   - Kuota API Rate Limiting.

6. **[`/dashboard/datastore`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/datastore/page.tsx) - DataStore Explorer**:
   - Menampilkan saldo Cash player yang tersimpan di DataStore Roblox.
   - Pencarian player via Username atau User ID.
   - Modal penyesuaian saldo (*Tambah / Kurang Cash*) secara instan.
   - Fitur download backup snapshot DataStore.

7. **[`/dashboard/workspaces`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/workspaces/page.tsx) - Kelola Universe Roblox**:
   - Daftarkan game Roblox (Universe ID, Place ID).
   - Manajemen API Secret Key per universe untuk koneksi server script.

8. **[`/dashboard/settings`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/settings/page.tsx) - Pengaturan Sistem**:
   - Rasio nilai tukar (Kurs: e.g. Rp 1.000 = X Cash).
   - Batas minimal donasi untuk memicu alert pop-up.
   - Integrasi Discord Webhook Notification dengan tombol **Kirim Pesan Tes**.

9. **[`/dashboard/profile`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/src/app/dashboard/profile/page.tsx) - Profil & API Keys**:
   - Informasi akun developer (Ryan Dev, Owner).
   - Master AW Studio API Token Generator.
   - Form ganti password.

---

## ⚡ Backend API Route Handlers (Lokal)

* `POST /api/webhooks/saweria`: Menerima dan memverifikasi payload webhook Saweria.
* `POST /api/webhooks/sociabuzz`: Mengembalikan response plain text `"OK"` sesuai standar SociaBuzz.
* `POST /api/webhooks/bagibagi`: Menerima payload donasi dari BagiBagi.id.
* `POST /api/roblox/claim`: Endpoint yang dipanggil oleh game Roblox untuk mengambil antrean donasi pemain online.

---

## 🎮 Roblox Studio Integration Script

File server script siap pakai tersedia di:
[`roblox/DonationCashService.server.luau`](file:///Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard/roblox/DonationCashService.server.luau)

**Cara Pasang di Roblox Studio:**
1. Masukkan file ini ke dalam folder `ServerScriptService`.
2. Pastikan opsi **Allow HTTP Requests** diaktifkan pada Game Settings Roblox Studio (*Home > Game Settings > Security > Allow HTTP Requests*).
3. Sesuaikan `API_URL` (default: `http://localhost:3000`) dan `UNIVERSE_ID` di dalam script sesuai dashboard Anda.
4. Script akan otomatis:
   * Menginisialisasi `leaderstats.Cash`.
   * Melakukan polling ke dashboard untuk mengecek donasi pemain online.
   * Mengkreditkan cash dan menyimpannya secara persisten ke `DataStoreService`.
   * Melakukan broadcast pengumuman donasi ke seluruh server game.

---

## 🚀 Menjalankan Proyek

```bash
cd /Users/ardiansyahzulfikar/.gemini/antigravity/scratch/donation-cash-dashboard
npm run dev
```

Buka di browser:
- Overview: `http://localhost:3000/dashboard`
- Providers: `http://localhost:3000/dashboard/providers`
- Donations: `http://localhost:3000/dashboard/donations`
- Fake Donation: `http://localhost:3000/dashboard/fake-donation`
- Diagnostics: `http://localhost:3000/dashboard/diagnostics`
- DataStore: `http://localhost:3000/dashboard/datastore`
- Workspaces: `http://localhost:3000/dashboard/workspaces`
- Settings: `http://localhost:3000/dashboard/settings`
- Profile: `http://localhost:3000/dashboard/profile`
