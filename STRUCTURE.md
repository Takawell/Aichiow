### 📂 PROJECT STRUCTURE

---

```
Aichiow-main/
├─ .env.example
├─ LICENSE
├─ README.md
├─ middleware.ts
├─ next-env.d.ts
├─ next.config.js
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ vercel.json
├─ components/
│  ├─ anime/
│  │  ├─ AnimeCard.tsx         
│  │  ├─ AnimeDetailHeader.tsx 
│  │  └─ AnimeTrailer.tsx      
│  ├─ character/
│  │  └─ CharacterList.tsx     
│  ├─ home/
│  │  ├─ HeroSection.tsx
│  │  ├─ TrendingSection.tsx
│  │  ├─ TopGenres.tsx
│  │  ├─ NowAiringSection.tsx
│  │  ├─ AnimeSection.tsx
│  │  ├─ NewsBanner.tsx
│  │  └─ CTACommunity.tsx
│  ├─ layout/
│  │  ├─ Navbar.tsx
│  │  └─ BottomNav.tsx
│  ├─ manga/
│  │  ├─ MangaSection.tsx
│  │  ├─ MangaCard.tsx
│  │  ├─ MangaGrid.tsx
│  │  ├─ GenreFilter.tsx
│  │  └─ SearchBar.tsx
│  ├─ manhwa/
│  │  ├─ ManhwaHeroSection.tsx
│  │  └─ ManhwaCard.tsx
│  ├─ shared/
│  │  ├─ SectionTitle.tsx
│  │  ├─ ShareModal.tsx
│  │  ├─ GenreFilter.tsx
│  │  └─ ThemeToggle.tsx
│  ├─ trailer/
│  │  ├─ TrailerGrid.tsx
│  │  └─ TrailerCard.tsx
│  └─ upcoming/
│     ├─ UpcomingAnimeGrid.tsx
│     ├─ UpcomingAnimeCard.tsx
│     ├─ ScheduleSection.tsx
│     └─ ScheduleAnimeCard.tsx
├─ constants/
│  └─ genres.ts
├─ graphql/
│  └─ queries.ts
├─ hooks/
│  ├─ useAnimeByGenre.ts
│  ├─ useAnimeDetail.ts
│  ├─ useExploreAnime.ts
│  ├─ useFavorites.ts
│  ├─ useHeroAnime.ts
│  ├─ useManhwaByGenre.ts
│  ├─ useOngoingAnime.ts
│  ├─ useSearchAnime.ts
│  ├─ useSeasonalAnime.ts
│  ├─ useTopRatedAnime.ts
│  ├─ useTrendingAnime.ts
│  └─ index.ts
├─ lib/
│  ├─ api.ts
│  ├─ anilist.ts
│  ├─ anilistLightNovel.ts
│  ├─ anilistManhwa.ts
│  ├─ mangadex.ts
│  └─ supabaseClient.ts
├─ pages/
│  ├─ 404.tsx
│  ├─ 500.tsx
│  ├─ _app.tsx
│  ├─ index.tsx
│  ├─ home.tsx
│  ├─ explore.tsx
│  ├─ maintenance.tsx
│  ├─ profile.tsx
│  ├─ soon.tsx
│  ├─ upcoming.tsx
│  ├─ anime/
│  │  ├─ [slug].tsx
│  │  └─ genre/[name].tsx
│  ├─ manga/
│  │  ├─ [slug].tsx
│  │  ├─ explore.tsx
│  │  ├─ index.tsx
│  │  └─ genre/[name].tsx
│  ├─ manhwa/
│  │  ├─ [id].tsx
│  │  ├─ index.tsx
│  │  └─ genre/[name].tsx
│  ├─ light-novel/
│  │  ├─ [id].tsx
│  │  └─ index.tsx
│  ├─ read/
│  │  └─ [chapterId].tsx
│  └─ api/
│     ├─ your api.txt
│     └─ manga/
│        ├─ chapter-images.ts
│        ├─ chapters.ts
│        ├─ cover.ts
│        ├─ detail.ts
│        ├─ filter.ts
│        ├─ genres.ts
│        ├─ popular.ts
│        ├─ search.ts
│        └─ section.ts
├─ public/
│  ├─ background.png
│  ├─ default.png
│  ├─ favicon.ico
│  ├─ logo.png
│  ├─ manifest.json
│  ├─ robots.txt
│  └─ sitemap.xml
├─ styles/
│  └─ globals.css
├─ types/
│  ├─ anime.ts
│  ├─ character.ts
│  ├─ index.ts
│  ├─ lightNovel.ts
│  ├─ manga.ts
│  ├─ manhwa.ts
│  └─ supabase.ts
└─ utils/
   ├─ classNames.ts       
   ├─ cn.ts               
   └─ time.ts            
