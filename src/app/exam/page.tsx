"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import {
  parseQuestions,
  calculateReadingScore,
  formatTime,
  type ReadingPassageData,
  type ReadingQuestion,
} from "@/lib/reading-engine";

type ExamSection = "select" | "reading";

interface PassageRaw {
  id: number;
  titleDe: string;
  titleEn: string;
  contentDe: string;
  questions: string;
  timeLimitSeconds: number;
}

export default function ExamPage() {
  const { language } = useSettings();
  const [section, setSection] = useState<ExamSection>("select");
  const [passages, setPassages] = useState<ReadingPassageData[]>([]);
  const [currentPassage, setCurrentPassage] = useState<ReadingPassageData | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/reading")
      .then((r) => r.json())
      .then((data: PassageRaw[]) =>
        setPassages(
          data.map((p) => ({
            ...p,
            questions: parseQuestions(p.questions),
          }))
        )
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (section === "reading" && timeLeft > 0 && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setSubmitted(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [section, submitted, timeLeft]);

  const startReading = useCallback((passage: ReadingPassageData) => {
    setCurrentPassage(passage);
    setAnswers(new Array(passage.questions.length).fill(null));
    setTimeLeft(passage.timeLimitSeconds);
    setSubmitted(false);
    setSection("reading");
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
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
  }, []);

  if (section === "select") {
    return (
      <main className="container">
        <h1>{t(language, "nav.exam")}</h1>

        <section className="exam-section-list">
          <h2 className="exam-section-title">Lesen (Reading)</h2>
          {passages.length === 0 && (
            <p className="empty-state">No reading passages yet. Run the seed script.</p>
          )}
          {passages.map((p) => (
            <button
              key={p.id}
              className="exam-passage-card"
              onClick={() => startReading(p)}
            >
              <span className="exam-passage-title">
                {language === "de" ? p.titleDe : p.titleEn}
              </span>
              <span className="exam-passage-meta">
                {p.questions.length} questions | {formatTime(p.timeLimitSeconds)}
              </span>
            </button>
          ))}
        </section>
      </main>
    );
  }

  if (!currentPassage) return <main className="container"><p>Loading...</p></main>;

  const score = submitted
    ? calculateReadingScore(answers, currentPassage.questions)
    : null;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{language === "de" ? currentPassage.titleDe : currentPassage.titleEn}</h2>
        <span className={`timer${timeLeft <= 60 ? " timer--warning" : ""}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="reading-content">
        {currentPassage.contentDe.split("\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <div className="reading-questions">
        {currentPassage.questions.map((q, qIdx) => (
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
          Submit Answers
        </button>
      ) : (
        <div className="reading-result">
          <div className="score-display">
            <span className="score-number">{score!.percent}%</span>
            <span className="score-label">{score!.correct}/{score!.total} correct</span>
          </div>
          <button className="btn btn--primary" onClick={() => setSection("select")} style={{ width: "100%" }}>
            Back to Exam Sections
          </button>
        </div>
      )}
    </main>
  );
}
