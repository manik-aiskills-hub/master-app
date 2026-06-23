"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import {
  parseListeningQuestions,
  getEmbedUrl,
  calculateListeningScore,
  type ListeningExerciseData,
  type ListeningQuestion,
} from "@/lib/listening-engine";

type Mode = "passive" | "active";

interface ExerciseRaw {
  id: number;
  titleDe: string;
  titleEn: string;
  youtubeUrl: string;
  questions: string;
  chapterId: number;
}

export default function ListeningPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();
  const [exercises, setExercises] = useState<ListeningExerciseData[]>([]);
  const [current, setCurrent] = useState<ListeningExerciseData | null>(null);
  const [mode, setMode] = useState<Mode>("active");
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/listening?chapterId=${slug}`)
      .then((r) => r.json())
      .then((data: ExerciseRaw[]) =>
        setExercises(
          data.map((e) => ({
            ...e,
            questions: parseListeningQuestions(e.questions),
          }))
        )
      )
      .catch(() => {});
  }, [slug]);

  const startExercise = useCallback((ex: ListeningExerciseData, m: Mode) => {
    setCurrent(ex);
    setMode(m);
    setAnswers(new Array(ex.questions.length).fill(null));
    setSubmitted(false);
  }, []);

  const selectAnswer = useCallback((qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  }, [submitted]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  if (!current) {
    return (
      <main className="container">
        <h1>{language === "de" ? "Hören" : "Listening"}</h1>
        {exercises.length === 0 && (
          <p className="empty-state">
            {language === "de"
              ? "Keine Hörübungen vorhanden. Seed-Skript ausführen."
              : "No listening exercises yet. Run the seed script."}
          </p>
        )}
        {exercises.map((ex) => (
          <div key={ex.id} className="listening-card">
            <h3 className="listening-card-title">
              {language === "de" ? ex.titleDe : ex.titleEn}
            </h3>
            <p className="listening-card-meta">
              {ex.questions.length} {language === "de" ? "Fragen" : "questions"}
            </p>
            <div className="listening-card-actions">
              <button
                className="btn btn--primary"
                onClick={() => startExercise(ex, "active")}
              >
                {language === "de" ? "Aktiv üben" : "Active Practice"}
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => startExercise(ex, "passive")}
              >
                {language === "de" ? "Passiv hören" : "Listen & Learn"}
              </button>
            </div>
          </div>
        ))}
        <a href="/" className="btn btn--secondary" style={{ marginTop: "1rem", display: "block", textAlign: "center" }}>
          ← {language === "de" ? "Zurück" : "Back"}
        </a>
      </main>
    );
  }

  const embedUrl = getEmbedUrl(current.youtubeUrl);
  const score = submitted ? calculateListeningScore(answers, current.questions) : null;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{language === "de" ? current.titleDe : current.titleEn}</h2>
        <span className="listening-mode-badge">
          {mode === "passive"
            ? language === "de" ? "Passiv" : "Passive"
            : language === "de" ? "Aktiv" : "Active"}
        </span>
      </div>

      {embedUrl && (
        <div className="listening-video">
          <iframe
            src={embedUrl}
            title={current.titleDe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {!embedUrl && (
        <div className="listening-link">
          <a href={current.youtubeUrl} target="_blank" rel="noopener noreferrer">
            {language === "de" ? "Video auf YouTube öffnen" : "Open video on YouTube"} ↗
          </a>
        </div>
      )}

      {mode === "passive" && (
        <div className="listening-passive-info">
          <p>
            {language === "de"
              ? "Höre das Video und folge dem Gespräch. Kein Test — einfach zuhören und lernen!"
              : "Listen to the video and follow along. No test — just listen and learn!"}
          </p>
          <button className="btn btn--secondary" onClick={() => setCurrent(null)} style={{ width: "100%" }}>
            ← {language === "de" ? "Zurück zu Übungen" : "Back to exercises"}
          </button>
        </div>
      )}

      {mode === "active" && (
        <>
          <h3 className="listening-section-title">
            {language === "de" ? "Fragen zum Hörverstehen" : "Comprehension Questions"}
          </h3>
          <div className="reading-questions">
            {current.questions.map((q, qIdx) => (
              <div key={qIdx} className="reading-question">
                <p className="reading-q-text">{qIdx + 1}. {q.question}</p>
                <div className="reading-options">
                  {q.options.map((opt, optIdx) => {
                    let className = "reading-option";
                    if (answers[qIdx] === optIdx) className += " reading-option--selected";
                    if (submitted) {
                      if (optIdx === q.correctIndex) className += " reading-option--correct";
                      else if (answers[qIdx] === optIdx) className += " reading-option--wrong";
                    }
                    return (
                      <button
                        key={optIdx}
                        className={className}
                        onClick={() => selectAnswer(qIdx, optIdx)}
                        disabled={submitted}
                      >
                        {String.fromCharCode(65 + optIdx)}) {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <button className="btn btn--primary" onClick={handleSubmit} style={{ width: "100%" }}>
              {language === "de" ? "Antworten prüfen" : "Check Answers"}
            </button>
          ) : (
            <div className="reading-result">
              <div className="score-display">
                <span className="score-number">{score!.percent}%</span>
                <span className="score-label">{score!.correct}/{score!.total} {language === "de" ? "richtig" : "correct"}</span>
              </div>
              <button className="btn btn--secondary" onClick={() => setCurrent(null)} style={{ width: "100%" }}>
                ← {language === "de" ? "Zurück zu Übungen" : "Back to exercises"}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
