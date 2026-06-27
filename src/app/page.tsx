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

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFC800">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--text-secondary)">
      <path d="M12 2a5 5 0 015 5v3h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v3h6V7a3 3 0 00-3-3zm0 10a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function DailyBanner({ chapters }: { chapters: ChapterData[] }) {
  const [target, setTarget] = useState({ wordsPerDay: 15, grammarPerDay: 1 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dailyTarget");
      if (saved) setTarget(JSON.parse(saved));
    } catch {}
  }, []);

  const totalPracticed = chapters.reduce((sum, ch) => sum + ch.practicedWords, 0);
  const totalWords = chapters.reduce((sum, ch) => sum + ch.totalWords, 0);
  const todayWords = Math.min(totalPracticed, target.wordsPerDay);
  const done = todayWords >= target.wordsPerDay;

  return (
    <div className={`daily-banner ${done ? "daily-banner--done" : ""}`}>
      <div className="daily-banner__icon">
        {done ? "🎉" : <span className="streak-flame__icon">🔥</span>}
      </div>
      <div className="daily-banner__content">
        <div className="daily-banner__title">
          {done ? "Daily goal complete!" : "Today's Goal"}
        </div>
        <div className="daily-banner__stats">
          {todayWords}/{target.wordsPerDay} words
        </div>
        <div className="daily-banner__bar">
          <div
            className="daily-banner__fill"
            style={{ width: `${Math.min(100, (todayWords / target.wordsPerDay) * 100)}%` }}
          />
        </div>
      </div>
      <div className="daily-banner__streak">
        <span className="daily-banner__streak-num">{Math.round((totalPracticed / Math.max(totalWords, 1)) * 100)}%</span>
        <span className="daily-banner__streak-label">overall</span>
      </div>
    </div>
  );
}

const NODE_COLORS = ["#58CC02", "#1CB0F6", "#CE82FF", "#FF9600", "#FF4B8F"];

function getNodeOffset(index: number): number {
  const pattern = [0, 40, 60, 40, 0, -40, -60, -40];
  return pattern[index % pattern.length];
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
      {!loading && chapters.length > 0 && <DailyBanner chapters={chapters} />}

      {loading && (
        <div className="skill-tree__loading">
          <div className="skill-tree__pulse" />
          <p>Loading your lessons...</p>
        </div>
      )}

      {!loading && chapters.length === 0 && (
        <p className="empty-state">No chapters yet. Run the seed script to add B1 content.</p>
      )}

      <div className="skill-tree">
        {chapters.map((ch, i) => {
          const { percent, complete } = chapterProgress(ch.totalWords, ch.practicedWords);
          const started = ch.practicedWords > 0;
          const prevComplete = i === 0 || chapterProgress(chapters[i - 1].totalWords, chapters[i - 1].practicedWords).complete;
          const unlocked = i === 0 || started || prevComplete;
          const color = NODE_COLORS[i % NODE_COLORS.length];
          const offset = getNodeOffset(i);

          return (
            <div key={ch.id} className="skill-tree__row" style={{ transform: `translateX(${offset}px)` }}>
              {i > 0 && (
                <div className={`skill-tree__connector ${unlocked ? "skill-tree__connector--active" : ""}`} />
              )}
              {unlocked ? (
                <Link href={`/chapter/${ch.slug}`} className="skill-node" style={{ "--node-color": color } as React.CSSProperties}>
                  <div className={`skill-node__circle ${complete ? "skill-node__circle--complete" : started ? "skill-node__circle--active" : ""}`}>
                    {complete ? (
                      <CrownIcon />
                    ) : (
                      <StarIcon />
                    )}
                    {started && !complete && (
                      <svg className="skill-node__ring" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--border)" strokeWidth="6" />
                        <circle
                          cx="50" cy="50" r="46"
                          fill="none"
                          stroke={color}
                          strokeWidth="6"
                          strokeLinecap="round"
                          strokeDasharray={`${percent * 2.89} ${289 - percent * 2.89}`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="skill-node__label">
                    {language === "de" ? ch.titleDe : ch.titleEn}
                  </span>
                  <span className="skill-node__day">Day {ch.dayNumber}</span>
                </Link>
              ) : (
                <div className="skill-node skill-node--locked">
                  <div className="skill-node__circle skill-node__circle--locked">
                    <LockIcon />
                  </div>
                  <span className="skill-node__label">
                    {language === "de" ? ch.titleDe : ch.titleEn}
                  </span>
                  <span className="skill-node__day">Day {ch.dayNumber}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
