"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import {
  checkFillIn,
  checkSentence,
  type GrammarRuleItem,
  type ExerciseItem,
} from "@/lib/grammar-engine";

type Phase = "rule" | "exercise";

export default function GrammarPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();

  const [chapterTitle, setChapterTitle] = useState("");
  const [rules, setRules] = useState<(GrammarRuleItem & { exercises: ExerciseItem[] })[]>([]);
  const [ruleIdx, setRuleIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("rule");
  const [exIdx, setExIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ correct: boolean; errors: string[] } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((chapters) => {
        const ch = chapters.find((c: { slug: string }) => c.slug === slug);
        if (ch) {
          setChapterTitle(language === "de" ? ch.titleDe : ch.titleEn);
          return fetch(`/api/grammar?chapterId=${ch.id}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => {
        if (data) setRules(data);
      })
      .catch(() => {});
  }, [slug, language]);

  const currentRule = rules[ruleIdx];
  const exercises = currentRule?.exercises ?? [];
  const currentEx = exercises[exIdx];

  const recordAnswer = useCallback(
    (exerciseId: number, isCorrect: boolean) => {
      fetch("/api/grammar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId, isCorrect }),
      }).catch(() => {});
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentEx || feedback?.correct) return;

      let result: { correct: boolean; errors: string[] };

      if (currentEx.type === "fill_in") {
        const isCorrect = checkFillIn(input, currentEx.answer);
        result = {
          correct: isCorrect,
          errors: isCorrect ? [] : [`Expected: "${currentEx.answer}"`],
        };
      } else {
        result = checkSentence(input, currentEx.answer);
      }

      setFeedback(result);
      if (result.correct) {
        setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
        recordAnswer(currentEx.id, true);
      } else {
        setScore((s) => ({ ...s, total: s.total + 1 }));
        recordAnswer(currentEx.id, false);
      }
    },
    [currentEx, input, feedback, recordAnswer]
  );

  const handleNext = useCallback(() => {
    setInput("");
    setFeedback(null);
    if (exIdx + 1 < exercises.length) {
      setExIdx(exIdx + 1);
    } else if (ruleIdx + 1 < rules.length) {
      setRuleIdx(ruleIdx + 1);
      setExIdx(0);
      setPhase("rule");
    } else {
      setDone(true);
    }
  }, [exIdx, exercises.length, ruleIdx, rules.length]);

  if (done) {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    return (
      <main className="container">
        <div className="session-complete">
          <h2>Grammar Complete!</h2>
          <div className="score-display">
            <span className="score-number">{accuracy}%</span>
            <span className="score-label">{score.correct}/{score.total} correct</span>
          </div>
          <a href="/" className="btn btn--primary">Back to Chapters</a>
        </div>
      </main>
    );
  }

  if (!currentRule) return <main className="container"><p>Loading grammar...</p></main>;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{chapterTitle} — Grammar</h2>
        <span className="word-counter">Rule {ruleIdx + 1}/{rules.length}</span>
      </div>

      {phase === "rule" && (
        <div className="grammar-card">
          <h3 className="grammar-title">
            {language === "de" ? currentRule.titleDe : currentRule.titleEn}
          </h3>
          <div className="grammar-formula">{currentRule.formula}</div>
          <p className="grammar-explanation">
            {language === "de" ? currentRule.explanationDe : currentRule.explanationEn}
          </p>
          <div className="grammar-examples">
            <div className="grammar-example">
              <span className="example-de">{currentRule.example1De}</span>
              <span className="example-en">{currentRule.example1En}</span>
            </div>
            <div className="grammar-example">
              <span className="example-de">{currentRule.example2De}</span>
              <span className="example-en">{currentRule.example2En}</span>
            </div>
          </div>
          <button className="btn btn--primary" onClick={() => setPhase("exercise")} style={{ width: "100%" }}>
            Start Exercises
          </button>
        </div>
      )}

      {phase === "exercise" && currentEx && (
        <div className="exercise-card">
          <span className="exercise-type">
            {currentEx.type === "fill_in" ? "Fill in the blank" : "Write the sentence"}
          </span>
          <p className="exercise-prompt">{currentEx.promptDe}</p>
          {currentEx.promptEn && (
            <p className="exercise-prompt-en">{currentEx.promptEn}</p>
          )}
          {currentEx.hint && (
            <p className="exercise-hint">Hint: {currentEx.hint}</p>
          )}

          {feedback && (
            <div className={`feedback feedback--${feedback.correct ? "correct" : "wrong"}`}>
              {feedback.correct ? "Correct!" : feedback.errors.join(" | ")}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="typing-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentEx.type === "fill_in" ? "Type the missing word..." : "Write the full sentence..."}
              autoFocus
              disabled={!!feedback?.correct}
            />
            {!feedback?.correct ? (
              <button className="btn btn--primary" type="submit" style={{ width: "100%" }}>
                Check
              </button>
            ) : (
              <button className="btn btn--primary" type="button" onClick={handleNext} style={{ width: "100%" }}>
                Next
              </button>
            )}
          </form>

          {feedback && !feedback.correct && (
            <p className="exercise-retry">Fix the errors and try again.</p>
          )}
        </div>
      )}
    </main>
  );
}
