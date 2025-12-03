import { useState, useEffect, useCallback } from "react";
import ConsumetAPI from "@/lib/consumet";

export function useConsumetSearch(query?: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    ConsumetAPI.search(query)
      .then((res) => setData(res?.results || []))
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  }, [query]);

  return { data, loading, error };
}

export function useConsumetInfo(id?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    ConsumetAPI.info(id)
      .then((res) => setData(res))
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useConsumetEpisode(episodeId?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisode = useCallback(() => {
    if (!episodeId) return;

    setLoading(true);
    setError(null);

    ConsumetAPI.watch(episodeId)
      .then((res) => setData(res))
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  }, [episodeId]);

  useEffect(() => {
    fetchEpisode();
  }, [fetchEpisode]);

  return { data, loading, error, refetch: fetchEpisode };
}
