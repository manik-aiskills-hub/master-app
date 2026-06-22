"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import { checkAnswer, generateMCQOptions, calculateAccuracy, type WordItem } from "@/lib/word-engine";

type Mode = "flashcard" | "typing" | "mcq";

interface ChapterInfo {
  id: number;
  titleDe: string;
  titleEn: string;
}

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();

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
      .then((chapters) => {
        const ch = chapters.find((c: { slug: string }) => c.slug === slug);
        if (ch) {
          setChapter({ id: ch.id, titleDe: ch.titleDe, titleEn: ch.titleEn });
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
          <h2>Session Complete!</h2>
          <div className="score-display">
            <span className="score-number">{accuracy}%</span>
            <span className="score-label">{score.correct}/{score.total} correct</span>
          </div>
          <a href="/" className="btn btn--primary">Back to Chapters</a>
        </div>
      </main>
    );
  }

  if (!currentWord) return <main className="container"><p>No words in this chapter.</p></main>;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{language === "de" ? chapter.titleDe : chapter.titleEn}</h2>
        <span className="word-counter">{current + 1}/{words.length}</span>
      </div>

      <div className="chapter-links">
        <Link href={`/verbs/${slug}`} className="btn btn--primary">
          Practice Verbs
        </Link>
        <Link href={`/grammar/${slug}`} className="btn btn--primary">
          Grammar
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
          {feedback === "correct" ? "Correct!" : `Wrong — ${currentWord.english}`}
        </div>
      )}

      {mode === "flashcard" && (
        <div className="flashcard" onClick={() => setFlipped(!flipped)} role="button" tabIndex={0}>
          <div className="flashcard__front">
            {currentWord.article && <span className="word-article">{currentWord.article}</span>}
            <span className="word-german">{currentWord.german}</span>
          </div>
          {flipped && (
            <div className="flashcard__back">
              <span className="word-english">{currentWord.english}</span>
              {currentWord.exampleDe && <p className="word-example">{currentWord.exampleDe}</p>}
            </div>
          )}
          {flipped && !feedback && (
            <div className="flashcard__actions">
              <button className="btn btn--wrong" onClick={(e) => { e.stopPropagation(); recordAnswer(false); }}>
                Wrong
              </button>
              <button className="btn btn--correct" onClick={(e) => { e.stopPropagation(); recordAnswer(true); }}>
                Correct
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
          </div>
          <form onSubmit={handleTypingSubmit}>
            <input
              className="typing-input"
              type="text"
              value={typingInput}
              onChange={(e) => setTypingInput(e.target.value)}
              placeholder="Type the English translation..."
              autoFocus
              disabled={!!feedback}
            />
            <button className="btn btn--primary" type="submit" disabled={!!feedback}>
              Check
            </button>
          </form>
        </div>
      )}

      {mode === "mcq" && (
        <div className="mcq-mode">
          <div className="mcq-prompt">
            {currentWord.article && <span className="word-article">{currentWord.article}</span>}
            <span className="word-german">{currentWord.german}</span>
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
