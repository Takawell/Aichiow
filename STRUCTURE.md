### 📂 PROJECT STRUCTURE

---

```
Aichiow-main/
├─env.example
├─LICENSE
├─middleware.ts
├─next-env.d.ts
├─next.config.js
├─package.json
├─postcss.config.js
├─README.md
├─STRUCTURE.md
├─tailwind.config.js
├─tsconfig.json
├
├─components/
    ├── anime/
        ├── AnimeCard.tsx
        ├── AnimeDetailHeader.tsx
        └── AnimeTrailer.tsx
    ├── character/
        └── CharacterList.tsx
    ├── home/
        ├── AnimeSection.tsx
        ├── CTACommunity.tsx
        ├── HeroSection.tsx
        ├── NewsBanner.tsx
        ├── NowAiringSection.tsx
        ├── TopGenres.tsx
        └── TrendingSection.tsx
    ├── layout/
        ├── BottomNav.tsx
        └── Navbar.tsx
    ├── manga/
        ├── GenreFilter.tsx
        ├── MangaCard.tsx
        ├── MangaGrid.tsx
        ├── MangaSection.tsx
        └── SearchBar.tsx
    ├── manhwa/
        ├── ManhwaCard.tsx
        └── ManhwaHeroSection.tsx
    ├── novels/
        └── HeroSelection.tsx
    ├── shared/
        ├── GenreFilter.tsx
        ├── SectionTitle.tsx
        ├── ShareModal.tsx
        ├── ThemeToggle.tsx
        └── UpdateModal.tsx
    ├── trailer/
        ├── TrailerCard.tsx
        └── TrailerGrid.tsx
    ├── ui/
        ├── MediaWidgets.tsx
        └── sheet.tsx
    └── upcoming/
        ├── ScheduleAnimeCard.tsx
        ├── ScheduleSection.tsx
        ├── UpcomingAnimeCard.tsx
        └── UpcomingAnimeGrid.tsx
├─constants/
    └── genres.ts
├─graphql/
    └── queries.ts
├─hooks/
    ├── index.ts
    ├── useAnimeByGenre.ts
    ├── useAnimeDetail.ts
    ├── useExploreAnime.ts
    ├── useFavorites.ts
    ├── useHeroAnime.ts
    ├── useManhwaByGenre.ts
    ├── useOngoingAnime.ts
    ├── useSearchAnime.ts
    ├── useSeasonalAnime.ts
    ├── useTopRatedAnime.ts
    └── useTrendingAnime.ts
├─lib/
    ├── anilist.ts
    ├── anilistLightNovel.ts
    ├── anilistManhwa.ts
    ├── mangadex.ts
    ├── supabaseClient.ts
    └── traceMoe.ts
├─pages/
    ├── anime/
        ├── genre/
            └── [name].tsx
        └── [slug].tsx
    ├── api/
        ├── manga/
            ├── chapter-images.ts
            ├── chapters.ts
            ├── cover.ts
            ├── detail.ts
            ├── filter.ts
            ├── genres.ts
            ├── popular.ts
            ├── search.ts
            └── section.ts
        ├── aichixia.ts
        └── your api.txt
    ├── auth/
        ├── callback.tsx
        ├── login.tsx
        ├── register.tsx
        ├── reset-password.tsx
        └── update-password.tsx
    ├── community/
        └── index.tsx
    ├── light-novel/
        ├── [id].tsx
        └── index.tsx
    ├── manga/
        ├── genre/
            └── [name].tsx
        ├── [slug].tsx
        ├── explore.tsx
        └── index.tsx
    ├── manhwa/
        ├── genre/
            └── [name].tsx
        ├── [id].tsx
        └── index.tsx
    ├── read/
        └── [chapterId].tsx
    ├── watch/
        ├── [id].tsx
        └── soon.tsx
    ├── _app.tsx
    ├── 404.tsx
    ├── 500.tsx
    ├── about.tsx
    ├── aichixia.tsx
    ├── API.tsx
    ├── explore.tsx
    ├── home.tsx
    ├── index.tsx
    ├── maintenance.tsx
    ├── privacy.tsx
    ├── profile.tsx
    ├── status.tsx
    ├── terms.tsx
    └── upcoming.tsx
├─public/
    ├── aichixia.png
    ├── background.png
    ├── default.png
    ├── favicon.ico
    ├── loading.gif
    ├── logo.png
    ├── manifest.json
    ├── robots.txt
    ├── sitemap.xml
    ├── v2.png
    ├── v3.png
    └── v4.png
├─styles/
    └── globals.css
├─types/
    ├── anime.ts
    ├── character.ts
    ├── index.ts
    ├── lightNovel.ts
    ├── manga.ts
    ├── manhwa.ts
    ├── slugify.d.ts
    └── supabase.ts
├─utils/
    ├── classNames.ts
    ├── cn.ts
    ├── slug.ts
    └── time.ts
```
