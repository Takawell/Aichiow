# 🌌 Aichiow — Anime Showcase Platform

**Aichiow** adalah platform modern berbasis web untuk menampilkan informasi lengkap anime, trailer, karakter, dan voice actor (seiyuu), menggunakan data real-time dari **Anilist GraphQL API**. Proyek ini bersifat UI-first dan berfokus pada pengalaman pengguna yang cinematic, elegan, dan cepat.

---

## 🚀 Features

- 🎬 Hero trailer section dengan embed video
- ⭐ Trending anime dari Anilist
- 🏷️ Genre filter interaktif
- 🔍 Real-time anime search
- 📖 Halaman detail anime lengkap:
  - Trailer
  - Poster & deskripsi
  - Statistik (episode, score, rank)
  - Karakter & voice actor
- 🎞️ Halaman khusus trailer gallery
- 🌑 Dark mode toggle
- 💨 UI halus dengan Framer Motion

---

## 🛠️ Tech Stack

- **Next.js** (Pages Router)
- **TypeScript**
- **TailwindCSS**
- **Framer Motion**
- **Anilist GraphQL API**

---

## 📁 Project Structure

components/
  ├── layout/
  ├── home/
  ├── anime/
  ├── character/
  ├── trailer/
  └── shared/

pages/
  ├── index.tsx
  ├── trailer.tsx
  └── anime/[slug].tsx

lib/
  └── anilist.ts

graphql/
  ├── queries.ts
  └── fragments.ts

hooks/
  └── useAnime.ts

types/
  ├── anime.ts
  └── character.ts

utils/
constants/
styles/
public/

🔧 Setup & Run Locally

git clone https://github.com/kamu/aichiow.git
cd aichiow
npm install
npm run dev

---

### 📡 Data Source
Data anime diambil dari Anilist.co melalui Anilist GraphQL API.

📜 License
MIT — free to use for personal & educational projects.

Dibuat dengan ✨ oleh tim Aichiow.

---
