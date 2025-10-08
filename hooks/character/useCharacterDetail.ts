import { useEffect, useState } from "react";
import { fetchCharacterDetail } from "@/lib/anilist";

export function useCharacterDetail(id?: number) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getCharacterDetail(Number(id));
        if (isMounted) setData(result);
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to fetch character detail:", err);
          setError(err?.message || "Failed to load character");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, loading, error };
}
