"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import { chapterProgress } from "@/lib/word-engine";

interface ChapterData {
  id: number;
  slug: string;
  titleDe: string;
  titleEn: string;
  dayNumber: number;
  totalWords: number;
  practicedWords: number;
}

export default function Home() {
  const { language } = useSettings();
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((data) => setChapters(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <h1>{t(language, "home.title")}</h1>
      <p className="subtitle">{t(language, "home.subtitle")}</p>

      {loading && <p className="loading">Loading...</p>}

      {!loading && chapters.length === 0 && (
        <p className="empty-state">No chapters yet. Run the seed script to add B1 content.</p>
      )}

      <div className="chapter-list">
        {chapters.map((ch) => {
          const { percent, complete } = chapterProgress(ch.totalWords, ch.practicedWords);
          return (
            <Link
              key={ch.id}
              href={`/chapter/${ch.slug}`}
              className={`chapter-card${complete ? " chapter-card--complete" : ""}`}
            >
              <div className="chapter-card__header">
                <span className="chapter-card__day">Day {ch.dayNumber}</span>
                <span className="chapter-card__progress">{percent}%</span>
              </div>
              <h3 className="chapter-card__title">
                {language === "de" ? ch.titleDe : ch.titleEn}
              </h3>
              <div className="chapter-card__bar">
                <div className="chapter-card__fill" style={{ width: `${percent}%` }} />
              </div>
              <span className="chapter-card__count">
                {ch.practicedWords}/{ch.totalWords} words
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
