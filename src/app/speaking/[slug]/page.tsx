"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import {
  parseKeyPhrases,
  getSpeakingTypeLabel,
  checkKeyPhraseUsage,
  calculatePhraseScore,
  formatDuration,
  type SpeakingPromptData,
} from "@/lib/speaking-engine";

interface PromptRaw {
  id: number;
  type: string;
  promptDe: string;
  promptEn: string;
  keyPhrases: string;
  modelAnswer: string;
  timeLimitSeconds: number;
  chapterId: number;
}

export default function SpeakingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();
  const [prompts, setPrompts] = useState<SpeakingPromptData[]>([]);
  const [current, setCurrent] = useState<SpeakingPromptData | null>(null);
  const [phase, setPhase] = useState<"prep" | "speak" | "review">("prep");
  const [timeLeft, setTimeLeft] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [showModel, setShowModel] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`/api/speaking?chapterId=${slug}`)
      .then((r) => r.json())
      .then((data: PromptRaw[]) =>
        setPrompts(
          data.map((p) => ({ ...p, keyPhrases: parseKeyPhrases(p.keyPhrases) }))
        )
      )
      .catch(() => {});
  }, [slug]);

  const startSpeaking = useCallback((prompt: SpeakingPromptData) => {
    setCurrent(prompt);
    setPhase("prep");
    setTranscript("");
    setShowModel(false);
  }, []);

  const beginTimer = useCallback(() => {
    if (!current) return;
    setPhase("speak");
    setTimeLeft(current.timeLimitSeconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setPhase("review");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [current]);

  const finishSpeaking = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("review");
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (!current) {
    return (
      <main className="container">
        <h1>{language === "de" ? "Sprechen" : "Speaking"}</h1>
        {prompts.length === 0 && (
          <p className="empty-state">
            {language === "de"
              ? "Keine Sprechübungen vorhanden."
              : "No speaking prompts yet. Run the seed script."}
          </p>
        )}
        {prompts.map((p) => (
          <button
            key={p.id}
            className="listening-card"
            onClick={() => startSpeaking(p)}
            style={{ cursor: "pointer", width: "100%", textAlign: "left", border: "1px solid var(--border)" }}
          >
            <h3 className="listening-card-title">
              {getSpeakingTypeLabel(p.type, language)}
            </h3>
            <p className="listening-card-meta">
              {formatDuration(p.timeLimitSeconds)} | {p.keyPhrases.length} {language === "de" ? "Schlüsselphrasen" : "key phrases"}
            </p>
          </button>
        ))}
        <a href="/" className="btn btn--secondary" style={{ marginTop: "1rem", display: "block", textAlign: "center" }}>
          ← {language === "de" ? "Zurück" : "Back"}
        </a>
      </main>
    );
  }

  const phraseUsage = phase === "review" ? checkKeyPhraseUsage(transcript, current.keyPhrases) : [];
  const phraseScore = phase === "review" ? calculatePhraseScore(phraseUsage) : null;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{getSpeakingTypeLabel(current.type, language)}</h2>
        {phase === "speak" && (
          <span className={`timer${timeLeft <= 30 ? " timer--warning" : ""}`}>
            {formatDuration(timeLeft)}
          </span>
        )}
      </div>

      <div className="writing-prompt-card">
        <p>{language === "de" ? current.promptDe : current.promptEn}</p>
      </div>

      {phase === "prep" && (
        <div className="speaking-prep">
          <h3>{language === "de" ? "Schlüsselphrasen zum Üben" : "Key Phrases to Practice"}</h3>
          <ul className="speaking-phrases">
            {current.keyPhrases.map((phrase, i) => (
              <li key={i} className="speaking-phrase">{phrase}</li>
            ))}
          </ul>
          <button className="btn btn--primary" onClick={beginTimer} style={{ width: "100%" }}>
            {language === "de" ? "Sprechen starten" : "Start Speaking"} ({formatDuration(current.timeLimitSeconds)})
          </button>
        </div>
      )}

      {phase === "speak" && (
        <div className="speaking-active">
          <p className="speaking-instruction">
            {language === "de"
              ? "Sprich jetzt! Verwende die Schlüsselphrasen. Schreibe danach auf, was du gesagt hast."
              : "Speak now! Use the key phrases. Write down what you said afterwards."}
          </p>
          <textarea
            className="writing-textarea"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={language === "de" ? "Schreibe hier, was du gesagt hast..." : "Write what you said here..."}
            rows={6}
          />
          <button className="btn btn--primary" onClick={finishSpeaking} style={{ width: "100%" }}>
            {language === "de" ? "Fertig" : "Done"}
          </button>
        </div>
      )}

      {phase === "review" && (
        <div className="speaking-review">
          <h3>{language === "de" ? "Auswertung" : "Review"}</h3>

          {transcript.trim().length > 0 && phraseScore && (
            <div className="score-display">
              <span className="score-number">{phraseScore.percent}%</span>
              <span className="score-label">
                {phraseScore.used}/{phraseScore.total} {language === "de" ? "Phrasen verwendet" : "phrases used"}
              </span>
            </div>
          )}

          <div className="writing-checklist">
            {current.keyPhrases.map((phrase, i) => (
              <div key={i} className={`checklist-item${phraseUsage[i] ? " checklist-item--done" : ""}`}>
                <span className="checklist-icon">{phraseUsage[i] ? "✓" : "✗"}</span>
                <span>{phrase}</span>
              </div>
            ))}
          </div>

          <button className="btn btn--secondary" onClick={() => setShowModel(!showModel)} style={{ width: "100%", marginTop: "0.5rem" }}>
            {showModel
              ? (language === "de" ? "Musterantwort verbergen" : "Hide Model Answer")
              : (language === "de" ? "Musterantwort zeigen" : "Show Model Answer")}
          </button>

          {showModel && (
            <div className="writing-model-answer">
              <h3>{language === "de" ? "Musterantwort" : "Model Answer"}</h3>
              <p>{current.modelAnswer}</p>
            </div>
          )}

          <button className="btn btn--secondary" onClick={() => setCurrent(null)} style={{ width: "100%", marginTop: "0.5rem" }}>
            ← {language === "de" ? "Zurück" : "Back"}
          </button>
        </div>
      )}
    </main>
  );
}
