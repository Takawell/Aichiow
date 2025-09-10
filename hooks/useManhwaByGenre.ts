import { useEffect, useState } from "react";
import { fetchManhwaByGenre } from "@/lib/anilistManhwa";
import { Manhwa } from "@/types/manhwa";

export function useManhwaByGenre(genre: string, page = 1) {
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);

  useEffect(() => {
    if (!genre) return;

    setLoading(true);
    fetchManhwaByGenre(page, genre)
      .then((data) => {
        setManhwas((prev) =>
          page === 1 ? data.list : [...prev, ...data.list]
        );
        setPageInfo(data.pageInfo);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching manhwa by genre:", err);
        setError("Gagal mengambil data manhwa");
        setLoading(false);
      });
  }, [genre, page]);

  return { manhwas, loading, error, pageInfo };
}
