"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
import {
  parseChecklist,
  getWritingTypeLabel,
  evaluateWriting,
  type WritingPromptData,
} from "@/lib/writing-engine";

interface PromptRaw {
  id: number;
  type: string;
  promptDe: string;
  promptEn: string;
  modelAnswer: string;
  checklist: string;
  chapterId: number;
}

export default function WritingPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();
  const [prompts, setPrompts] = useState<WritingPromptData[]>([]);
  const [current, setCurrent] = useState<WritingPromptData | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    fetch(`/api/writing?chapterId=${slug}`)
      .then((r) => r.json())
      .then((data: PromptRaw[]) =>
        setPrompts(
          data.map((p) => ({ ...p, checklist: parseChecklist(p.checklist) }))
        )
      )
      .catch(() => {});
  }, [slug]);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  if (!current) {
    return (
      <main className="container">
        <h1>{language === "de" ? "Schreiben" : "Writing"}</h1>
        {prompts.length === 0 && (
          <p className="empty-state">
            {language === "de"
              ? "Keine Schreibübungen vorhanden."
              : "No writing prompts yet. Run the seed script."}
          </p>
        )}
        {prompts.map((p) => (
          <button
            key={p.id}
            className="listening-card"
            onClick={() => { setCurrent(p); setText(""); setSubmitted(false); setShowModel(false); }}
            style={{ cursor: "pointer", width: "100%", textAlign: "left", border: "1px solid var(--border)" }}
          >
            <h3 className="listening-card-title">
              {getWritingTypeLabel(p.type, language)}: {language === "de" ? p.promptDe.slice(0, 60) : p.promptEn.slice(0, 60)}...
            </h3>
            <p className="listening-card-meta">{p.checklist.length} checklist items</p>
          </button>
        ))}
        <a href="/" className="btn btn--secondary" style={{ marginTop: "1rem", display: "block", textAlign: "center" }}>
          ← {language === "de" ? "Zurück" : "Back"}
        </a>
      </main>
    );
  }

  const evaluation = submitted ? evaluateWriting(text, current.checklist) : null;

  return (
    <main className="container">
      <div className="chapter-header">
        <h2>{getWritingTypeLabel(current.type, language)}</h2>
        <span className="listening-mode-badge">{language === "de" ? "Schreiben" : "Writing"}</span>
      </div>

      <div className="writing-prompt-card">
        <p>{language === "de" ? current.promptDe : current.promptEn}</p>
      </div>

      <div className="writing-checklist">
        <h3>{language === "de" ? "Checkliste" : "Checklist"}</h3>
        {current.checklist.map((item, i) => (
          <div key={i} className={`checklist-item${evaluation?.checklistResults[i] ? " checklist-item--done" : ""}`}>
            <span className="checklist-icon">{evaluation?.checklistResults[i] ? "✓" : "○"}</span>
            <span>{item.label}</span>
            <span className="checklist-hint">{item.hint}</span>
          </div>
        ))}
      </div>

      <textarea
        className="writing-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={language === "de" ? "Schreibe deinen Text hier..." : "Write your text here..."}
        rows={10}
        disabled={submitted}
      />

      {!submitted ? (
        <button className="btn btn--primary" onClick={handleSubmit} style={{ width: "100%" }}
          disabled={text.trim().length === 0}>
          {language === "de" ? "Prüfen" : "Check"}
        </button>
      ) : (
        <div className="writing-result">
          <div className="writing-stats">
            <span>{language === "de" ? "Wörter" : "Words"}: {evaluation!.wordCount}</span>
            <span>{language === "de" ? "Anrede" : "Greeting"}: {evaluation!.hasGreeting ? "✓" : "✗"}</span>
            <span>{language === "de" ? "Schluss" : "Closing"}: {evaluation!.hasClosing ? "✓" : "✗"}</span>
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
