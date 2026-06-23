"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { checkAnswer, generateMCQOptions, calculateAccuracy, type WordItem } from "@/lib/word-engine";

type Mode = "flashcard" | "typing" | "mcq";

interface ChapterInfo {
  id: number;
  slug: string;
  titleDe: string;
  titleEn: string;
  dayNumber: number;
}

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();

  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [chapter, setChapter] = useState<ChapterInfo | null>(null);
  const [words, setWords] = useState<WordItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState<Mode>("flashcard");
  const [flipped, setFlipped] = useState(false);
  const [typingInput, setTypingInput] = useState("");
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/chapters`)
      .then((r) => r.json())
      .then((allChapters: ChapterInfo[]) => {
        setChapters(allChapters);
        const ch = allChapters.find((c) => c.slug === slug);
        if (ch) {
          setChapter(ch);
          return fetch(`/api/words?chapterId=${ch.id}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data) setWords(data);
      })
      .catch(() => {});
  }, [slug]);

  const currentWord = words[current];
  const chapterIdx = chapters.findIndex((c) => c.slug === slug);
  const prevChapter = chapterIdx > 0 ? chapters[chapterIdx - 1] : null;
  const nextChapter = chapterIdx < chapters.length - 1 ? chapters[chapterIdx + 1] : null;

  useEffect(() => {
    if (currentWord && mode === "mcq") {
      setMcqOptions(generateMCQOptions(currentWord, words));
    }
  }, [current, mode, currentWord, words]);

  const recordAnswer = useCallback(
    (correct: boolean) => {
      if (!currentWord) return;
      setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
      setFeedback(correct ? "correct" : "wrong");

      fetch("/api/words", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordId: currentWord.id, correct }),
      }).catch(() => {});

      setTimeout(() => {
        setFeedback(null);
        setFlipped(false);
        setTypingInput("");
        if (current + 1 < words.length) {
          setCurrent((c) => c + 1);
        } else {
          setDone(true);
        }
      }, 1200);
    },
    [currentWord, current, words.length]
  );

  const handleTypingSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentWord) return;
      recordAnswer(checkAnswer(typingInput, currentWord.english));
    },
    [currentWord, typingInput, recordAnswer]
  );

  if (!chapter) return <main className="container"><p>Loading...</p></main>;

  if (done) {
    const accuracy = calculateAccuracy(score.correct, score.total);
    return (
      <main className="container">
        <div className="session-complete">
          <h2>{language === "de" ? "Sitzung abgeschlossen!" : "Session Complete!"}</h2>
          <div className="score-display">
            <span className="score-number">{accuracy}%</span>
            <span className="score-label">{score.correct}/{score.total} {language === "de" ? "richtig" : "correct"}</span>
          </div>
          <div className="session-nav">
            <Link href="/" className="btn btn--secondary">
              ← {language === "de" ? "Startseite" : "Home"}
            </Link>
            {nextChapter && (
              <Link href={`/chapter/${nextChapter.slug}`} className="btn btn--primary">
                {language === "de" ? "Nächstes Kapitel" : "Next Chapter"} →
              </Link>
            )}
          </div>
          <div className="chapter-links" style={{ marginTop: "1rem" }}>
            <Link href={`/verbs/${slug}`} className="btn btn--secondary">
              {language === "de" ? "Verben üben" : "Practice Verbs"}
            </Link>
            <Link href={`/grammar/${slug}`} className="btn btn--secondary">
              {language === "de" ? "Grammatik" : "Grammar"}
            </Link>
            <Link href={`/writing/${chapter.id}`} className="btn btn--secondary">
              {language === "de" ? "Schreiben üben" : "Practice Writing"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!currentWord) return <main className="container"><p>No words in this chapter.</p></main>;

  return (
    <main className="container">
      <nav className="chapter-nav-bar">
        <Link href="/" className="chapter-nav-back">
          ← {language === "de" ? "Startseite" : "Home"}
        </Link>
        <div className="chapter-nav-arrows">
          {prevChapter ? (
            <Link href={`/chapter/${prevChapter.slug}`} className="chapter-nav-arrow" title={language === "de" ? prevChapter.titleDe : prevChapter.titleEn}>
              ‹ {language === "de" ? "Zurück" : "Prev"}
            </Link>
          ) : <span className="chapter-nav-arrow chapter-nav-arrow--disabled">‹ {language === "de" ? "Zurück" : "Prev"}</span>}
          {nextChapter ? (
            <Link href={`/chapter/${nextChapter.slug}`} className="chapter-nav-arrow" title={language === "de" ? nextChapter.titleDe : nextChapter.titleEn}>
              {language === "de" ? "Weiter" : "Next"} ›
            </Link>
          ) : <span className="chapter-nav-arrow chapter-nav-arrow--disabled">{language === "de" ? "Weiter" : "Next"} ›</span>}
        </div>
      </nav>

      <div className="chapter-header">
        <div>
          <span className="chapter-day-badge">{language === "de" ? "Tag" : "Day"} {chapter.dayNumber}</span>
          <h2>{language === "de" ? chapter.titleDe : chapter.titleEn}</h2>
        </div>
        <span className="word-counter">{current + 1}/{words.length}</span>
      </div>

      <div className="chapter-links">
        <Link href={`/verbs/${slug}`} className="btn btn--primary">
          {language === "de" ? "Verben" : "Verbs"}
        </Link>
        <Link href={`/grammar/${slug}`} className="btn btn--primary">
          {language === "de" ? "Grammatik" : "Grammar"}
        </Link>
        <Link href={`/writing/${chapter.id}`} className="btn btn--primary">
          {language === "de" ? "Schreiben" : "Writing"}
        </Link>
      </div>

      <div className="mode-selector">
        {(["flashcard", "typing", "mcq"] as Mode[]).map((m) => (
          <button
            key={m}
            className={`mode-btn${mode === m ? " mode-btn--active" : ""}`}
            onClick={() => { setMode(m); setFlipped(false); setTypingInput(""); setFeedback(null); }}
          >
            {m === "flashcard" ? "Flip" : m === "typing" ? "Type" : "MCQ"}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback feedback--${feedback}`}>
          {feedback === "correct"
            ? (language === "de" ? "Richtig!" : "Correct!")
            : `${language === "de" ? "Falsch" : "Wrong"} — ${currentWord.english}`}
        </div>
      )}

      {mode === "flashcard" && (
        <div className="flashcard" onClick={() => setFlipped(!flipped)} role="button" tabIndex={0}>
          <div className="flashcard__front">
            <div className="word-side-de">
              {currentWord.article && <span className="word-article">{currentWord.article}</span>}
              <span className="word-german">{currentWord.german}</span>
              {currentWord.wordType && (
                <span className={`word-type-badge word-type-badge--${currentWord.wordType}`}>
                  {currentWord.wordType}
                </span>
              )}
            </div>
            <div className="word-side-icon">
              {currentWord.article === "der" ? "🔵" : currentWord.article === "die" ? "🔴" : currentWord.article === "das" ? "🟢" : "📝"}
            </div>
            <div className="word-side-en">
              {flipped ? (
                <span className="word-english">{currentWord.english}</span>
              ) : (
                <span className="word-english" style={{ opacity: 0.3 }}>?</span>
              )}
            </div>
          </div>
          {flipped && currentWord.exampleDe && (
            <div className="flashcard__back">
              <p className="word-example">{currentWord.exampleDe}</p>
            </div>
          )}
          {flipped && !feedback && (
            <div className="flashcard__actions">
              <button className="btn btn--wrong" onClick={(e) => { e.stopPropagation(); recordAnswer(false); }}>
                {language === "de" ? "Falsch" : "Wrong"}
              </button>
              <button className="btn btn--correct" onClick={(e) => { e.stopPropagation(); recordAnswer(true); }}>
                {language === "de" ? "Richtig" : "Correct"}
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "typing" && (
        <div className="typing-mode">
          <div className="typing-prompt">
            {currentWord.article && <span className="word-article">{currentWord.article}</span>}
            <span className="word-german">{currentWord.german}</span>
            {currentWord.wordType && currentWord.wordType !== "noun" && (
              <span className={`word-type-badge word-type-badge--${currentWord.wordType}`}>{currentWord.wordType}</span>
            )}
          </div>
          <form onSubmit={handleTypingSubmit}>
            <input
              className="typing-input"
              type="text"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
              placeholder={language === "de" ? "Englische Übersetzung eingeben..." : "Type the English translation..."}
              autoFocus
              disabled={!!feedback}
            />
            <button className="btn btn--primary" type="submit" disabled={!!feedback}>
              {language === "de" ? "Prüfen" : "Check"}
            </button>
          </form>
        </div>
      )}

      {mode === "mcq" && (
        <div className="mcq-mode">
          <div className="mcq-prompt">
            {currentWord.article && <span className="word-article">{currentWord.article}</span>}
            <span className="word-german">{currentWord.german}</span>
            {currentWord.wordType && currentWord.wordType !== "noun" && (
              <span className={`word-type-badge word-type-badge--${currentWord.wordType}`}>{currentWord.wordType}</span>
            )}
          </div>
          <div className="mcq-options">
            {mcqOptions.map((opt) => (
              <button
                key={opt}
                className="mcq-option"
                onClick={() => recordAnswer(checkAnswer(opt, currentWord.english))}
                disabled={!!feedback}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
