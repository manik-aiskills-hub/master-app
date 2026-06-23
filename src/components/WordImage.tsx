"use client";

import { useEffect, useState } from "react";

const cache: Record<string, string | null> = {};

function cacheKey(word: string) {
  return `wimg-${word.toLowerCase().replace(/\s+/g, "_")}`;
}

function loadCache(word: string): string | null | undefined {
  const k = cacheKey(word);
  if (k in cache) return cache[k];
  try {
    const stored = localStorage.getItem(k);
    if (stored === "none") { cache[k] = null; return null; }
    if (stored) { cache[k] = stored; return stored; }
  } catch {}
  return undefined;
}

function saveCache(word: string, url: string | null) {
  const k = cacheKey(word);
  cache[k] = url;
  try { localStorage.setItem(k, url ?? "none"); } catch {}
}

export default function WordImage({ word, size = 40 }: { word: string; size?: number }) {
  const [src, setSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cached = loadCache(word);
    if (cached !== undefined) {
      setSrc(cached);
      return;
    }

    let cancelled = false;
    const term = word.toLowerCase().split(/[,;(]/)[0].trim();

    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (cancelled) return;
        const url = data?.thumbnail?.source ?? null;
        saveCache(word, url);
        setSrc(url);
      })
      .catch(() => {
        if (!cancelled) { saveCache(word, null); setSrc(null); }
      });

    return () => { cancelled = true; };
  }, [word]);

  if (!src) return null;

  return (
    <img
      className="word-image"
      src={src}
      alt={word}
      width={size}
      height={size}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setSrc(null)}
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
}
