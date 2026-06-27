"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { getRecentWrongAnswers, getWeakWords, getBookmarkedWords } from "@/lib/wrong-answers";

interface DashboardData {
  totalWords: number;
  wordsLearned: number;
  totalVerbs: number;
  verbsLearned: number;
  chaptersCompleted: number;
  totalChapters: number;
}

export default function ReviewPage() {
  const { language } = useSettings();
  const de = language === "de";
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setDashboard)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!dashboard) return;

    const wrongAnswers = getRecentWrongAnswers(30);
    const weakWords = getWeakWords();
    const bookmarkedIds = new Set(getBookmarkedWords());

    const bookmarkedWrong = wrongAnswers.filter((a) => bookmarkedIds.has(a.wordId));
    const uniqueWrong = new Map<number, typeof wrongAnswers[0]>();
    for (const a of wrongAnswers) {
      if (!uniqueWrong.has(a.wordId)) uniqueWrong.set(a.wordId, a);
    }

    let text = `# German B1 Review Session\n\n`;
    text += `## My Progress\n`;
    text += `- Words learned: ${dashboard.wordsLearned}/${dashboard.totalWords}\n`;
    text += `- Verbs learned: ${dashboard.verbsLearned}/${dashboard.totalVerbs}\n`;
    text += `- Chapters completed: ${dashboard.chaptersCompleted}/${dashboard.totalChapters}\n\n`;

    if (uniqueWrong.size > 0) {
      text += `## Recent Mistakes (${uniqueWrong.size} words)\n`;
      for (const [, a] of uniqueWrong) {
        text += `- "${a.german}" → correct: "${a.correctAnswer}", I answered: "${a.userAnswer}" (${a.mode} mode)\n`;
      }
      text += `\n`;
    }

    if (weakWords.length > 0) {
      text += `## Weak Areas (words I get wrong repeatedly)\n`;
      for (const w of weakWords.slice(0, 15)) {
        text += `- ${w.article ? w.article + " " : ""}${w.german} = ${w.english}\n`;
      }
      text += `\n`;
    }

    if (bookmarkedWrong.length > 0) {
      text += `## Bookmarked for Extra Review\n`;
      for (const b of bookmarkedWrong) {
        text += `- ${b.article ? b.article + " " : ""}${b.german} = ${b.english}\n`;
      }
      text += `\n`;
    }

    text += `## What I Need Help With\n`;
    text += `Please help me review by:\n`;
    text += `1. Quiz me on my weak words and recent mistakes\n`;
    text += `2. Explain any grammar patterns I'm struggling with\n`;
    text += `3. Give me example sentences using my weak words\n`;
    text += `4. Correct any article (der/die/das) mistakes\n`;
    text += `5. Suggest study strategies for the words I keep getting wrong\n`;
    text += `\nPlease start by quizzing me on 5 of my weakest words.\n`;

    setPrompt(text);
  }, [dashboard]);

  const openClaude = () => {
    const encoded = encodeURIComponent(prompt);
    window.open(`https://claude.ai/new?q=${encoded}`, "_blank");
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wrongCount = getRecentWrongAnswers(30).length;
  const weakCount = getWeakWords().length;

  return (
    <main className="container">
      <Link href="/progress" className="chapter-nav-back">← {de ? "Zurück" : "Back"}</Link>

      <div className="review-header">
        <div className="review-icon">🤖</div>
        <h1>{de ? "Mit Claude üben" : "Review with Claude"}</h1>
        <p className="review-subtitle">
          {de
            ? "Claude erstellt eine personalisierte Übung basierend auf deinen Fehlern"
            : "Claude will create a personalized review based on your mistakes"}
        </p>
      </div>

      <div className="review-stats">
        <div className="review-stat">
          <span className="review-stat__num">{wrongCount}</span>
          <span className="review-stat__label">{de ? "Kürzliche Fehler" : "Recent mistakes"}</span>
        </div>
        <div className="review-stat">
          <span className="review-stat__num">{weakCount}</span>
          <span className="review-stat__label">{de ? "Schwache Wörter" : "Weak words"}</span>
        </div>
      </div>

      {wrongCount === 0 && weakCount === 0 ? (
        <div className="review-empty">
          <p>{de
            ? "Noch keine Fehler aufgezeichnet! Übe zuerst einige Kapitel."
            : "No mistakes recorded yet! Practice some chapters first."}</p>
          <Link href="/" className="btn btn--primary" style={{ display: "block", textAlign: "center" }}>
            {de ? "Zum Üben gehen" : "Go Practice"}
          </Link>
        </div>
      ) : (
        <>
          <div className="review-prompt-preview">
            <h3>{de ? "Generierter Prompt" : "Generated Prompt"}</h3>
            <pre className="review-prompt-text">{prompt}</pre>
          </div>

          <div className="review-actions">
            <button className="btn btn--primary review-btn" onClick={openClaude}>
              {de ? "In Claude.ai öffnen" : "Open in Claude.ai"} →
            </button>
            <button className="btn btn--secondary review-btn" onClick={copyPrompt}>
              {copied ? (de ? "Kopiert! ✓" : "Copied! ✓") : (de ? "Prompt kopieren" : "Copy Prompt")}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
