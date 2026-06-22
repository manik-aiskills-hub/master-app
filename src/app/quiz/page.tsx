"use client";

import { useEffect, useState, useCallback } from "react";
import { useSettings } from "@/lib/settings-context";
import { t } from "@/lib/i18n";
import { generateQuiz, quizScore, type QuizItem } from "@/lib/quiz-engine";
import { checkAnswer } from "@/lib/word-engine";

type QuizMode = "weak" | "due" | "random";

export default function QuizPage() {
  const { language } = useSettings();
  const [mode, setMode] = useState<QuizMode>("random");
  const [allItems, setAllItems] = useState<QuizItem[]>([]);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback((m: QuizMode) => {
    setLoading(true);
    fetch(`/api/quiz?mode=${m}`)
      .then((r) => r.json())
      .then((data) => setAllItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadItems(mode);
  }, [mode, loadItems]);

  const startQuiz = useCallback(() => {
    const count = Math.min(20, allItems.length);
    if (count === 0) return;
    setQuiz(generateQuiz(allItems, count, mode));
    setCurrent(0);
    setScore({ correct: 0, total: 0 });
    setStarted(true);
    setDone(false);
    setInput("");
    setFeedback(null);
  }, [allItems, mode]);

  const currentItem = quiz[current];

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentItem || feedback) return;
      const isCorrect = checkAnswer(input, currentItem.answer);
      setFeedback(isCorrect ? "correct" : "wrong");
      setCorrectAnswer(currentItem.answer);
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));

      const endpoint = currentItem.type === "word" ? "/api/words" : "/api/verbs";
      const idKey = currentItem.type === "word" ? "wordId" : "verbId";
      fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [idKey]: currentItem.id, correct: isCorrect }),
      }).catch(() => {});

      setTimeout(() => {
        setFeedback(null);
        setCorrectAnswer("");
        setInput("");
        if (current + 1 < quiz.length) {
          setCurrent((c) => c + 1);
        } else {
          setDone(true);
        }
      }, 1500);
    },
    [currentItem, input, feedback, current, quiz.length]
  );

  if (done) {
    const { percent, grade } = quizScore(score.correct, score.total);
    return (
      <main className="container">
        <div className="session-complete">
          <h2>Quiz Complete!</h2>
          <div className="score-display">
            <span className="score-number">{percent}%</span>
            <span className={`score-grade score-grade--${grade}`}>{grade.toUpperCase()}</span>
            <span className="score-label">{score.correct}/{score.total} correct</span>
          </div>
          <button className="btn btn--primary" onClick={() => { setStarted(false); setDone(false); }}>
            New Quiz
          </button>
        </div>
      </main>
    );
  }

  if (!started) {
    const weakCount = allItems.filter((i) => i.isWeak).length;
    return (
      <main className="container">
        <h1>{t(language, "nav.quiz")}</h1>

        <div className="quiz-setup">
          <div className="quiz-modes">
            {(["random", "weak", "due"] as QuizMode[]).map((m) => (
              <button
                key={m}
                className={`mode-btn${mode === m ? " mode-btn--active" : ""}`}
                onClick={() => setMode(m)}
              >
                {m === "random" ? "Random" : m === "weak" ? `Weak (${weakCount})` : "Due for Review"}
              </button>
            ))}
          </div>

          <div className="quiz-info">
            <p>{allItems.length} items available</p>
            {allItems.length === 0 && !loading && (
              <p className="empty-state">Practice some words or verbs first to build your quiz pool.</p>
            )}
          </div>

          <button
            className="btn btn--primary"
            onClick={startQuiz}
            disabled={allItems.length === 0 || loading}
            style={{ width: "100%" }}
          >
            Start Quiz ({Math.min(20, allItems.length)} questions)
          </button>
        </div>
      </main>
    );
  }

  if (!currentItem) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>Quiz</h2>
        <span className="word-counter">{current + 1}/{quiz.length}</span>
      </div>

      <div className="quiz-card">
        <span className="quiz-item-type">{currentItem.type}</span>
        <p className="quiz-question">{currentItem.question}</p>

        {feedback && (
          <div className={`feedback feedback--${feedback}`}>
            {feedback === "correct" ? "Correct!" : `Wrong — ${correctAnswer}`}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            className="typing-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type the English translation..."
            autoFocus
            disabled={!!feedback}
          />
          <button className="btn btn--primary" type="submit" disabled={!!feedback} style={{ width: "100%" }}>
            Check
          </button>
        </form>
      </div>
    </main>
  );
}
