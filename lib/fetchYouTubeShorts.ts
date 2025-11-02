import * as cheerio from "cheerio";

export interface YouTubeShort {
  title: string;
  url: string;
  thumbnail: string;
}

export async function fetchYouTubeShorts(query = "anime shorts", limit = 10): Promise<YouTubeShort[]> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);
    const videoLinks = new Set<string>();
    const results: YouTubeShort[] = [];

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href && href.startsWith("/shorts/")) {
        videoLinks.add(`https://www.youtube.com${href}`);
      }
    });

    for (const url of Array.from(videoLinks).slice(0, limit)) {
      const videoId = url.split("/shorts/")[1];
      const title = `Anime Shorts - ${videoId.slice(0, 6)}`;
      const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      results.push({ title, url, thumbnail });
    }

    return results;
  } catch (error) {
    console.error("Error fetching YouTube Shorts:", error);
    return [];
  }
}
