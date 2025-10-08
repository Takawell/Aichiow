import { useEffect, useState } from "react";
import { getCharacterDetail } from "@/lib/anilist";

export function useCharacterDetail(id?: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCharacterDetail(id);
        setData(result);
      } catch (err: any) {
        console.error("Failed to fetch character detail:", err);
        setError(err.message || "Failed to load character");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
}
