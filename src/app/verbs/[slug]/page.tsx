"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import {
  checkConjugation,
  getConjugation,
  getPerfekt,
  PRONOUNS,
  type VerbItem,
  type Pronoun,
} from "@/lib/verb-engine";

type DrillMode = "table" | "fill";

export default function VerbDrillPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();

  const [chapterTitle, setChapterTitle] = useState("");
  const [verbs, setVerbs] = useState<VerbItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [mode, setMode] = useState<DrillMode>("table");
  const [drillPronoun, setDrillPronoun] = useState<Pronoun>("ich");
  const [drillInput, setDrillInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((chapters) => {
        const ch = chapters.find((c: { slug: string }) => c.slug === slug);
        if (ch) {
          setChapterTitle(language === "de" ? ch.titleDe : ch.titleEn);
          return fetch(`/api/verbs?chapterId=${ch.id}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data) setVerbs(data);
      })
      .catch(() => {});
  }, [slug, language]);

  const currentVerb = verbs[current];

  const nextDrill = useCallback(() => {
    setDrillPronoun(PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)]);
    setDrillInput("");
    setFeedback(null);
    setCorrectAnswer("");
  }, []);

  useEffect(() => {
    if (currentVerb && mode === "fill") nextDrill();
  }, [current, mode, currentVerb, nextDrill]);

  const recordAnswer = useCallback(
    (correct: boolean) => {
      if (!currentVerb) return;
      setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));

      fetch("/api/verbs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verbId: currentVerb.id, correct }),
      }).catch(() => {});
    },
    [currentVerb]
  );

  const handleFillSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentVerb || feedback) return;
      const correct = getConjugation(currentVerb, drillPronoun);
      const isCorrect = checkConjugation(drillInput, correct);
      setFeedback(isCorrect ? "correct" : "wrong");
      setCorrectAnswer(correct);
      recordAnswer(isCorrect);

      setTimeout(() => {
        if (current + 1 < verbs.length) {
          setCurrent((c) => c + 1);
        } else {
          setDone(true);
        }
      }, 1500);
    },
    [currentVerb, drillPronoun, drillInput, feedback, current, verbs.length, recordAnswer]
  );

  const handleTableNext = useCallback(() => {
    recordAnswer(true);
    if (current + 1 < verbs.length) {
      setCurrent((c) => c + 1);
    } else {
      setDone(true);
    }
  }, [current, verbs.length, recordAnswer]);

  if (done) {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <main className="container">
        <div className="session-complete">
          <h2>Verbs Complete!</h2>
          <div className="score-display">
            <span className="score-number">{accuracy}%</span>
            <span className="score-label">{score.correct}/{score.total} correct</span>
          </div>
          <a href="/" className="btn btn--primary">Back to Chapters</a>
        </div>
      </main>
    );
  }

  if (!currentVerb) return <main className="container"><p>Loading verbs...</p></main>;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{chapterTitle} — Verbs</h2>
        <span className="word-counter">{current + 1}/{verbs.length}</span>
      </div>

      <div className="mode-selector">
        <button
          className={`mode-btn${mode === "table" ? " mode-btn--active" : ""}`}
          onClick={() => setMode("table")}
        >
          Table
        </button>
        <button
          className={`mode-btn${mode === "fill" ? " mode-btn--active" : ""}`}
          onClick={() => setMode("fill")}
        >
          Fill-in
        </button>
      </div>

      {mode === "table" && (
        <div className="verb-table-card">
          <div className="verb-header">
            <span className="verb-infinitive">{currentVerb.infinitive}</span>
            <span className="verb-english">{currentVerb.english}</span>
          </div>
          <div className="verb-meta">
            <span className="verb-perfekt">Perfekt: {getPerfekt(currentVerb)}</span>
            {currentVerb.praeteritum && (
              <span className="verb-praeteritum">Präteritum: {currentVerb.praeteritum}</span>
            )}
            {currentVerb.isIrregular && <span className="verb-badge">irregular</span>}
          </div>
          <table className="conj-table">
            <tbody>
              {PRONOUNS.map((p) => (
                <tr key={p}>
                  <td className="conj-pronoun">{p}</td>
                  <td className="conj-form">{getConjugation(currentVerb, p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn--primary verb-next" onClick={handleTableNext}>
            Next
          </button>
        </div>
      )}

      {mode === "fill" && (
        <div className="verb-fill-card">
          <div className="verb-header">
            <span className="verb-infinitive">{currentVerb.infinitive}</span>
            <span className="verb-english">{currentVerb.english}</span>
          </div>

          {feedback && (
            <div className={`feedback feedback--${feedback}`}>
              {feedback === "correct" ? "Correct!" : `Wrong — ${correctAnswer}`}
            </div>
          )}

          <div className="fill-prompt">
            <span className="fill-pronoun">{drillPronoun}</span>
            <span className="fill-blank">___</span>
          </div>

          <form onSubmit={handleFillSubmit}>
            <input
              className="typing-input"
              type="text"
              value={drillInput}
              onChange={(e) => setDrillInput(e.target.value)}
              placeholder={`Conjugate "${currentVerb.infinitive}"...`}
              autoFocus
              disabled={!!feedback}
            />
            <button className="btn btn--primary" type="submit" disabled={!!feedback}>
              Check
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
