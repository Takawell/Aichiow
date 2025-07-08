# 🌌 Aichiow

**Aichiow** adalah platform web streaming anime modern yang menampilkan info anime terkini, manga terbaru, trailer, jadwal rilis, dan pencarian lanjutan. Terinspirasi dari Crunchyroll dan LiveChart, Aichiow dibangun menggunakan Next.js 13, TailwindCSS, dan GraphQL API dari Anilist & MangaDex.

![Aichiow Banner](https://aichiow.vercel.app/banner-preview.jpg)

## 🚀 Fitur Utama

### 🎬 Anime
- Halaman detail anime dengan cover, trailer, studio, genre, skor, dan deskripsi
- Informasi karakter utama dan seiyuu (voice actor)
- Support trailer YouTube

### 🔥 Trending & Popular
- Anime trending harian dari Anilist (TRENDING_DESC)
- Anime ongoing & seasonal

### ⏳ Upcoming & Schedule
- Upcoming anime belum tayang (`NOT_YET_RELEASED`)
- Jadwal tayang mingguan dengan waktu airing
- Terintegrasi dalam 1 halaman: `/upcoming`

### 📚 Manga
- Data dari MangaDex API
- Halaman detail manga dengan deskripsi, cover, dan chapter
- Support karakter dan seiyuu jika tersedia
- Reader bawaan untuk membaca chapter

### 🧭 Explore & Search
- Fitur eksplorasi berbagai kategori anime
- Halaman pencarian global (`/search`) dengan tampilan menarik
- Autocomplete support (coming soon)

### 🎨 UI/UX
- UI bergaya anime-modern, elegan, dan mobile-friendly
- Dark mode support
- Routing cepat dengan Next.js App Router

## 🧩 Teknologi yang Digunakan

- **Next.js 13** – App Router, Client Components
- **TailwindCSS** – styling modern
- **Anilist GraphQL API** – anime data
- **MangaDex REST API** – manga data
- **SWR** – data fetching & caching
- **Vercel** – hosting dan deployment


## 🧪 Rencana Fitur Lanjutan
- [ ] Bookmark system (anime/manga)
- [ ] Continue Watching
- [ ] Anime episode tracker
- [ ] Genre page khusus
- [ ] Admin dashboard (untuk statistik)

## 🔗 Live Demo
🌐 https://aichiow.vercel.app

Dibuat dengan oleh !Taka
Powered by Anilist & MangaDex APIs.


## 📦 Instalasi Lokal

```bash
git clone https://github.com/username/Aichiow.git
cd Aichiow
npm install
npm run dev
