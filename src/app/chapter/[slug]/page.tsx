"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSettings } from "@/lib/settings-context";
import { checkAnswer, generateMCQOptions, calculateAccuracy, type WordItem } from "@/lib/word-engine";
import WordImage from "@/components/WordImage";

type Section = "words" | "grammar" | "writing" | "practice" | "quiz" | "notes";
type PracticeMode = "flashcard" | "typing" | "mcq" | "spelling" | "article";

interface ChapterInfo {
  id: number;
  slug: string;
  titleDe: string;
  titleEn: string;
  dayNumber: number;
}

interface VerbData {
  id: number;
  infinitive: string;
  english: string;
  ichPraesens: string;
  duPraesens: string;
  erPraesens: string;
  wirPraesens: string;
  ihrPraesens: string;
  siePraesens: string;
  partizipII: string;
  auxiliary: string;
  praeteritum: string | null;
  isIrregular: boolean;
}

interface GrammarData {
  id: number;
  titleDe: string;
  titleEn: string;
  formula: string;
  explanationDe: string;
  explanationEn: string;
  example1De: string;
  example1En: string;
  example2De: string;
  example2En: string;
}

interface WritingData {
  id: number;
  type: string;
  promptDe: string;
  promptEn: string;
  modelAnswer: string;
  checklist: string;
}

function speak(text: string, lang = "de-DE") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const deVoice = voices.find((v) => v.lang.startsWith("de"));
  if (deVoice) u.voice = deVoice;
  window.speechSynthesis.speak(u);
}

function SpeakBtn({ text, lang = "de-DE" }: { text: string; lang?: string }) {
  return (
    <button
      className="speak-btn"
      onClick={(e) => { e.stopPropagation(); speak(text, lang); }}
      aria-label={`Listen to "${text}"`}
      type="button"
    >
      🔊
    </button>
  );
}

export default function ChapterPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useSettings();
  const de = language === "de";

  const [chapters, setChapters] = useState<ChapterInfo[]>([]);
  const [chapter, setChapter] = useState<ChapterInfo | null>(null);
  const [words, setWords] = useState<WordItem[]>([]);
  const [verbs, setVerbs] = useState<VerbData[]>([]);
  const [grammar, setGrammar] = useState<GrammarData[]>([]);
  const [writing, setWriting] = useState<WritingData[]>([]);
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(["words"]));

  // Practice state
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("flashcard");
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [typingInput, setTypingInput] = useState("");
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<WordItem[]>([]);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizInput, setQuizInput] = useState("");
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizFeedback, setQuizFeedback] = useState<{ type: "correct" | "wrong"; answer: string } | null>(null);
  const [quizDone, setQuizDone] = useState(false);

  // Writing state
  const [writingText, setWritingText] = useState("");
  const [writingSubmitted, setWritingSubmitted] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Notes state
  const [notes, setNotes] = useState("");

  // Spelling state
  const [spellingInput, setSpellingInput] = useState("");
  const [spellingRevealed, setSpellingRevealed] = useState(false);

  // Article practice state
  const [articleIdx, setArticleIdx] = useState(0);
  const [articleFeedback, setArticleFeedback] = useState<{ correct: boolean; answer: string } | null>(null);

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((all: ChapterInfo[]) => {
        setChapters(all);
        const ch = all.find((c) => c.slug === slug);
        if (ch) {
          setChapter(ch);
          Promise.all([
            fetch(`/api/words?chapterId=${ch.id}`).then((r) => r.json()),
            fetch(`/api/verbs?chapterId=${ch.id}`).then((r) => r.json()).catch(() => []),
            fetch(`/api/grammar?chapterId=${ch.id}`).then((r) => r.json()).catch(() => []),
            fetch(`/api/writing?chapterId=${ch.id}`).then((r) => r.json()).catch(() => []),
          ]).then(([w, v, g, wr]) => {
            setWords(w);
            setVerbs(v);
            setGrammar(g);
            setWriting(wr);
          });
        }
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    const saved = localStorage.getItem(`notes-${slug}`);
    if (saved) setNotes(saved);
  }, [slug]);

  const saveNotes = useCallback((text: string) => {
    setNotes(text);
    localStorage.setItem(`notes-${slug}`, text);
  }, [slug]);

  const chapterIdx = chapters.findIndex((c) => c.slug === slug);
  const prevChapter = chapterIdx > 0 ? chapters[chapterIdx - 1] : null;
  const nextChapter = chapterIdx < chapters.length - 1 ? chapters[chapterIdx + 1] : null;

  const nouns = useMemo(() => words.filter((w) => !w.wordType || w.wordType === "noun"), [words]);
  const adjectives = useMemo(() => words.filter((w) => w.wordType === "adjective"), [words]);
  const adverbs = useMemo(() => words.filter((w) => w.wordType === "adverb"), [words]);
  const conjunctions = useMemo(() => words.filter((w) => w.wordType === "conjunction"), [words]);

  const toggleSection = useCallback((s: Section) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  }, []);

  // Practice logic
  const practiceWord = words[practiceIdx];

  useEffect(() => {
    if (practiceWord && practiceMode === "mcq") {
      setMcqOptions(generateMCQOptions(practiceWord, words));
    }
  }, [practiceIdx, practiceMode, practiceWord, words]);

  const practiceAnswer = useCallback((correct: boolean) => {
    if (!practiceWord) return;
    setFeedback(correct ? "correct" : "wrong");
    fetch("/api/words", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId: practiceWord.id, correct }),
    }).catch(() => {});
    if (correct) {
      setTimeout(() => {
        setFeedback(null);
        setFlipped(false);
        setTypingInput("");
        if (practiceIdx + 1 < words.length) setPracticeIdx((i) => i + 1);
        else setPracticeIdx(0);
      }, 1000);
    }
  }, [practiceWord, practiceIdx, words.length]);

  const dismissFeedback = useCallback(() => {
    setFeedback(null);
    setFlipped(false);
    setTypingInput("");
    setSpellingInput("");
    setSpellingRevealed(false);
    if (practiceIdx + 1 < words.length) setPracticeIdx((i) => i + 1);
    else setPracticeIdx(0);
  }, [practiceIdx, words.length]);

  const handlePracticeTyping = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!practiceWord) return;
    practiceAnswer(checkAnswer(typingInput, practiceWord.english));
  }, [practiceWord, typingInput, practiceAnswer]);

  // Quiz logic
  const startQuiz = useCallback(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 20);
    setQuizQuestions(shuffled);
    setQuizIdx(0);
    setQuizScore({ correct: 0, total: 0 });
    setQuizInput("");
    setQuizFeedback(null);
    setQuizDone(false);
    setQuizStarted(true);
  }, [words]);

  const quizWord = quizQuestions[quizIdx];

  const submitQuizAnswer = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!quizWord || quizFeedback) return;
    const correct = checkAnswer(quizInput, quizWord.english);
    setQuizScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setQuizFeedback({ type: correct ? "correct" : "wrong", answer: quizWord.english });
    fetch("/api/words", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId: quizWord.id, correct }),
    }).catch(() => {});
  }, [quizWord, quizInput, quizFeedback]);

  const nextQuizQuestion = useCallback(() => {
    setQuizFeedback(null);
    setQuizInput("");
    if (quizIdx + 1 < quizQuestions.length) setQuizIdx((i) => i + 1);
    else setQuizDone(true);
  }, [quizIdx, quizQuestions.length]);

  if (!chapter) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      {/* Navigation Bar */}
      <nav className="chapter-nav-bar">
        <Link href="/" className="chapter-nav-back">← {de ? "Startseite" : "Home"}</Link>
        <div className="chapter-nav-arrows">
          {prevChapter ? (
            <Link href={`/chapter/${prevChapter.slug}`} className="chapter-nav-arrow">‹ {de ? "Zurück" : "Prev"}</Link>
          ) : <span className="chapter-nav-arrow chapter-nav-arrow--disabled">‹ {de ? "Zurück" : "Prev"}</span>}
          {nextChapter ? (
            <Link href={`/chapter/${nextChapter.slug}`} className="chapter-nav-arrow">{de ? "Weiter" : "Next"} ›</Link>
          ) : <span className="chapter-nav-arrow chapter-nav-arrow--disabled">{de ? "Weiter" : "Next"} ›</span>}
        </div>
      </nav>

      {/* Day Header */}
      <div className="day-header">
        <span className="chapter-day-badge">{de ? "Tag" : "Day"} {chapter.dayNumber}</span>
        <h1 className="day-title">{de ? chapter.titleDe : chapter.titleEn}</h1>
        <p className="day-summary">
          {words.length} {de ? "Wörter" : "words"} · {verbs.length} {de ? "Verben" : "verbs"} · {grammar.length} {de ? "Regeln" : "rules"} · {writing.length} {de ? "Schreibübung" : "writing"}
        </p>
      </div>

      {/* === SECTION: Words === */}
      <div className="accordion">
        <button className={`accordion-header${openSections.has("words") ? " accordion-header--open" : ""}`} onClick={() => toggleSection("words")}>
          <span className="accordion-icon">{openSections.has("words") ? "▼" : "▶"}</span>
          <span className="accordion-title">📖 {de ? "Wörter & Sätze" : "Words & Sentences"}</span>
          <span className="accordion-count">{words.length}</span>
        </button>
        {openSections.has("words") && (
          <div className="accordion-body">
            <button
              className="btn btn--secondary listen-all-btn"
              onClick={() => {
                const allTexts = words.map((w) => w.article ? `${w.article} ${w.german}` : w.german);
                let i = 0;
                const speakNext = () => {
                  if (i < allTexts.length) { speak(allTexts[i]); i++; setTimeout(speakNext, 1500); }
                };
                speakNext();
              }}
            >
              🔊 {de ? "Alle anhören" : "Listen All"}
            </button>
            {/* Nouns */}
            {nouns.length > 0 && (
              <>
                <h3 className="word-group-title">{de ? "Nomen" : "Nouns"}</h3>
                <div className="word-list">
                  {nouns.map((w) => (
                    <div key={w.id} className="word-row">
                      <WordImage word={w.english} />
                      <div className="word-row-de">
                        <SpeakBtn text={w.article ? `${w.article} ${w.german}` : w.german} />
                        {w.article && <span className="word-article">{w.article}</span>}
                        <span className="word-row-text">{w.german}</span>
                      </div>
                      <span className="word-row-en">{w.english}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {/* Adjectives */}
            {adjectives.length > 0 && (
              <>
                <h3 className="word-group-title">
                  <span className="word-type-badge word-type-badge--adjective">{de ? "Adjektive" : "Adjectives"}</span>
                </h3>
                <div className="word-list">
                  {adjectives.map((w) => (
                      <div key={w.id} className="word-row">
                        <WordImage word={w.english} />
                        <div className="word-row-de">
                          <SpeakBtn text={w.german} />
                          <span className="word-row-text">{w.german}</span>
                        </div>
                        <span className="word-row-en">{w.english}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
            {/* Adverbs */}
            {adverbs.length > 0 && (
              <>
                <h3 className="word-group-title">
                  <span className="word-type-badge word-type-badge--adverb">{de ? "Adverbien" : "Adverbs"}</span>
                </h3>
                <div className="word-list">
                  {adverbs.map((w) => (
                      <div key={w.id} className="word-row">
                        <WordImage word={w.english} />
                        <div className="word-row-de">
                          <SpeakBtn text={w.german} />
                          <span className="word-row-text">{w.german}</span>
                        </div>
                        <span className="word-row-en">{w.english}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
            {/* Conjunctions */}
            {conjunctions.length > 0 && (
              <>
                <h3 className="word-group-title">
                  <span className="word-type-badge word-type-badge--conjunction">{de ? "Konjunktionen" : "Conjunctions"}</span>
                </h3>
                <div className="word-list">
                  {conjunctions.map((w) => (
                      <div key={w.id} className="word-row">
                        <WordImage word={w.english} />
                        <div className="word-row-de">
                          <SpeakBtn text={w.german} />
                          <span className="word-row-text">{w.german}</span>
                        </div>
                        <span className="word-row-en">{w.english}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* === SECTION: Grammar (Verbs + Rules) === */}
      <div className="accordion">
        <button className={`accordion-header${openSections.has("grammar") ? " accordion-header--open" : ""}`} onClick={() => toggleSection("grammar")}>
          <span className="accordion-icon">{openSections.has("grammar") ? "▼" : "▶"}</span>
          <span className="accordion-title">📐 {de ? "Grammatik & Verben" : "Grammar & Verbs"}</span>
          <span className="accordion-count">{verbs.length + grammar.length}</span>
        </button>
        {openSections.has("grammar") && (
          <div className="accordion-body">
            {/* Verbs */}
            {verbs.length > 0 && (
              <>
                <h3 className="word-group-title">{de ? "Verben" : "Verbs"}</h3>
                {verbs.map((v) => (
                  <div key={v.id} className="verb-card-mini">
                    <div className="verb-card-header">
                      <WordImage word={v.english} size={32} />
                      <SpeakBtn text={v.infinitive} />
                      <strong>{v.infinitive}</strong>
                      <span className="verb-card-en">{v.english}</span>
                      {v.isIrregular && <span className="verb-irregular-tag">{de ? "unregelmäßig" : "irregular"}</span>}
                    </div>
                    <div className="verb-conj-grid">
                      <span>ich <strong>{v.ichPraesens}</strong></span>
                      <span>du <strong>{v.duPraesens}</strong></span>
                      <span>er/sie <strong>{v.erPraesens}</strong></span>
                      <span>wir <strong>{v.wirPraesens}</strong></span>
                      <span>ihr <strong>{v.ihrPraesens}</strong></span>
                      <span>sie/Sie <strong>{v.siePraesens}</strong></span>
                    </div>
                    <div className="verb-perfekt">
                      <span>Perfekt: <strong>{v.auxiliary} {v.partizipII}</strong></span>
                      {v.praeteritum && <span>Präteritum: <strong>{v.praeteritum}</strong></span>}
                    </div>
                  </div>
                ))}
              </>
            )}
            {verbs.length === 0 && <p className="empty-hint">{de ? "Keine Verben für diesen Tag" : "No verbs for this day"}</p>}

            {/* Grammar Rules */}
            {grammar.length > 0 && (
              <>
                <h3 className="word-group-title" style={{ marginTop: "1rem" }}>{de ? "Grammatikregeln" : "Grammar Rules"}</h3>
                {grammar.map((g) => (
                  <div key={g.id} className="grammar-card-mini">
                    <h4>{de ? g.titleDe : g.titleEn}</h4>
                    <div className="grammar-formula-mini">{g.formula}</div>
                    <p className="grammar-explain">{de ? g.explanationDe : g.explanationEn}</p>
                    <div className="grammar-examples">
                      <p>→ {g.example1De} <span className="grammar-ex-en">({g.example1En})</span></p>
                      <p>→ {g.example2De} <span className="grammar-ex-en">({g.example2En})</span></p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* === SECTION: Writing === */}
      <div className="accordion">
        <button className={`accordion-header${openSections.has("writing") ? " accordion-header--open" : ""}`} onClick={() => toggleSection("writing")}>
          <span className="accordion-icon">{openSections.has("writing") ? "▼" : "▶"}</span>
          <span className="accordion-title">✍️ {de ? "Schreiben" : "Writing"}</span>
          <span className="accordion-count">{writing.length}</span>
        </button>
        {openSections.has("writing") && (
          <div className="accordion-body">
            {writing.length === 0 && <p className="empty-hint">{de ? "Keine Schreibübung für diesen Tag" : "No writing exercise for this day"}</p>}
            {writing.map((w) => {
              const checklist = (() => { try { return JSON.parse(w.checklist) as { label: string; hint: string }[]; } catch { return []; } })();
              return (
                <div key={w.id}>
                  <div className="writing-prompt-card">
                    <p>{de ? w.promptDe : w.promptEn}</p>
                  </div>
                  <div className="writing-checklist">
                    <h4>{de ? "Checkliste" : "Checklist"}</h4>
                    {checklist.map((item, i) => (
                      <div key={i} className={`checklist-item${writingSubmitted && writingText.toLowerCase().includes(item.label.toLowerCase()) ? " checklist-item--done" : ""}`}>
                        <span className="checklist-icon">{writingSubmitted && writingText.toLowerCase().includes(item.label.toLowerCase()) ? "✓" : "○"}</span>
                        <span>{item.label}</span>
                        <span className="checklist-hint">{item.hint}</span>
                      </div>
                    ))}
                  </div>
                  <textarea
                    className="writing-textarea"
                    value={writingText}
                    onChange={(e) => setWritingText(e.target.value)}
                    placeholder={de ? "Schreibe hier..." : "Write here..."}
                    rows={6}
                    disabled={writingSubmitted}
                  />
                  {!writingSubmitted ? (
                    <button className="btn btn--primary" onClick={() => setWritingSubmitted(true)} style={{ width: "100%" }} disabled={!writingText.trim()}>
                      {de ? "Prüfen" : "Check"}
                    </button>
                  ) : (
                    <>
                      <button className="btn btn--secondary" onClick={() => setShowModelAnswer(!showModelAnswer)} style={{ width: "100%", marginTop: "0.5rem" }}>
                        {showModelAnswer ? (de ? "Musterantwort verbergen" : "Hide Model") : (de ? "Musterantwort zeigen" : "Show Model Answer")}
                      </button>
                      {showModelAnswer && (
                        <div className="writing-model-answer">
                          <p>{w.modelAnswer}</p>
                        </div>
                      )}
                      <button className="btn btn--secondary" onClick={() => { setWritingSubmitted(false); setWritingText(""); setShowModelAnswer(false); }} style={{ width: "100%", marginTop: "0.5rem" }}>
                        {de ? "Nochmal schreiben" : "Write Again"}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* === SECTION: Practice === */}
      <div className="accordion">
        <button className={`accordion-header${openSections.has("practice") ? " accordion-header--open" : ""}`} onClick={() => toggleSection("practice")}>
          <span className="accordion-icon">{openSections.has("practice") ? "▼" : "▶"}</span>
          <span className="accordion-title">🎯 {de ? "Üben" : "Practice"}</span>
          <span className="accordion-count">{words.length}</span>
        </button>
        {openSections.has("practice") && words.length > 0 && (
          <div className="accordion-body">
            <div className="mode-selector">
              {(["flashcard", "typing", "mcq", "spelling", "article"] as PracticeMode[]).map((m) => (
                <button key={m} className={`mode-btn${practiceMode === m ? " mode-btn--active" : ""}`}
                  onClick={() => { setPracticeMode(m); setFlipped(false); setTypingInput(""); setSpellingInput(""); setSpellingRevealed(false); setFeedback(null); setArticleFeedback(null); setArticleIdx(0); }}>
                  {m === "flashcard" ? (de ? "Karten" : "Flip") : m === "typing" ? (de ? "Tippen" : "Type") : m === "spelling" ? (de ? "Buchstabieren" : "Spell") : m === "article" ? "der/die/das" : "MCQ"}
                </button>
              ))}
            </div>
            <p className="practice-counter">{practiceIdx + 1} / {words.length}</p>

            {feedback && (
              <div className={`feedback feedback--${feedback}`}>
                {feedback === "correct" ? (de ? "Richtig!" : "Correct!") : `${de ? "Falsch" : "Wrong"} — ${practiceWord?.english}`}
                {feedback === "wrong" && (
                  <button className="btn btn--ok" onClick={dismissFeedback}>OK</button>
                )}
              </div>
            )}

            {practiceWord && practiceMode === "flashcard" && (
              <div className="flashcard" onClick={() => setFlipped(!flipped)} role="button" tabIndex={0}>
                <div className="flashcard__front">
                  <div className="word-side-de">
                    {practiceWord.article && <span className="word-article">{practiceWord.article}</span>}
                    <span className="word-german">{practiceWord.german}</span>
                    {practiceWord.wordType && practiceWord.wordType !== "noun" && (
                      <span className={`word-type-badge word-type-badge--${practiceWord.wordType}`}>{practiceWord.wordType}</span>
                    )}
                  </div>
                  <div className="word-side-icon">
                    {practiceWord.article === "der" ? "🔵" : practiceWord.article === "die" ? "🔴" : practiceWord.article === "das" ? "🟢" : "📝"}
                  </div>
                  <div className="word-side-en">
                    {flipped ? <span className="word-english">{practiceWord.english}</span> : <span className="word-english" style={{ opacity: 0.3 }}>?</span>}
                  </div>
                </div>
                {flipped && !feedback && (
                  <div className="flashcard__actions">
                    <button className="btn btn--wrong" onClick={(e) => { e.stopPropagation(); practiceAnswer(false); }}>{de ? "Falsch" : "Wrong"}</button>
                    <button className="btn btn--correct" onClick={(e) => { e.stopPropagation(); practiceAnswer(true); }}>{de ? "Richtig" : "Correct"}</button>
                  </div>
                )}
              </div>
            )}

            {practiceWord && practiceMode === "typing" && (
              <div className="typing-mode">
                <div className="typing-prompt">
                  {practiceWord.article && <span className="word-article">{practiceWord.article}</span>}
                  <span className="word-german">{practiceWord.german}</span>
                </div>
                <form onSubmit={handlePracticeTyping}>
                  <input className="typing-input" type="text" value={typingInput}
                    onChange={(e) => setTypingInput(e.target.value)}
                    placeholder={de ? "Englische Übersetzung..." : "English translation..."} autoFocus disabled={!!feedback} />
                  <button className="btn btn--primary" type="submit" disabled={!!feedback}>{de ? "Prüfen" : "Check"}</button>
                </form>
              </div>
            )}

            {practiceWord && practiceMode === "mcq" && (
              <div className="mcq-mode">
                <div className="mcq-prompt">
                  {practiceWord.article && <span className="word-article">{practiceWord.article}</span>}
                  <span className="word-german">{practiceWord.german}</span>
                </div>
                <div className="mcq-options">
                  {mcqOptions.map((opt) => (
                    <button key={opt} className="mcq-option" onClick={() => practiceAnswer(checkAnswer(opt, practiceWord.english))} disabled={!!feedback}>{opt}</button>
                  ))}
                </div>
              </div>
            )}

            {practiceWord && practiceMode === "spelling" && (
              <div className="spelling-mode">
                <p className="spelling-hint">{de ? "Höre zu und schreibe das deutsche Wort:" : "Listen and spell the German word:"}</p>
                <div className="spelling-english">{practiceWord.english}</div>
                <button className="btn btn--secondary spelling-play-btn" type="button"
                  onClick={() => speak(practiceWord.article ? `${practiceWord.article} ${practiceWord.german}` : practiceWord.german)}>
                  🔊 {de ? "Anhören" : "Play"}
                </button>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (spellingRevealed) return;
                  const target = practiceWord.article ? `${practiceWord.article} ${practiceWord.german}` : practiceWord.german;
                  const correct = spellingInput.trim().toLowerCase() === target.toLowerCase();
                  setSpellingRevealed(true);
                  setFeedback(correct ? "correct" : "wrong");
                  fetch("/api/words", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wordId: practiceWord.id, correct }) }).catch(() => {});
                  if (correct) {
                    setTimeout(() => {
                      setFeedback(null); setSpellingInput(""); setSpellingRevealed(false);
                      if (practiceIdx + 1 < words.length) setPracticeIdx((i) => i + 1); else setPracticeIdx(0);
                    }, 1000);
                  }
                }}>
                  <input className="typing-input" type="text" value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    placeholder={de ? "Deutsche Schreibweise..." : "German spelling..."} autoFocus disabled={spellingRevealed} />
                  <button className="btn btn--primary" type="submit" disabled={spellingRevealed}>{de ? "Prüfen" : "Check"}</button>
                </form>
                {spellingRevealed && feedback === "wrong" && (
                  <div className="spelling-correct-answer">
                    {de ? "Richtig:" : "Correct:"} <strong>{practiceWord.article ? `${practiceWord.article} ${practiceWord.german}` : practiceWord.german}</strong>
                  </div>
                )}
              </div>
            )}

            {practiceMode === "article" && (() => {
              const articleWords = nouns.filter((w) => w.article);
              const aw = articleWords[articleIdx];
              if (!aw) return <p className="empty-hint">{de ? "Keine Nomen mit Artikel" : "No nouns with articles"}</p>;
              return (
                <div className="article-mode">
                  <p className="practice-counter">{articleIdx + 1} / {articleWords.length}</p>
                  <div className="article-prompt">
                    <WordImage word={aw.english} size={80} />
                    <span className="article-word">{aw.german}</span>
                    <span className="article-en">{aw.english}</span>
                  </div>
                  {articleFeedback && (
                    <div className={`feedback feedback--${articleFeedback.correct ? "correct" : "wrong"}`}>
                      {articleFeedback.correct ? (de ? "Richtig!" : "Correct!") : `${de ? "Falsch" : "Wrong"} — ${articleFeedback.answer}`}
                      {!articleFeedback.correct && (
                        <button className="btn btn--ok" onClick={() => {
                          setArticleFeedback(null);
                          if (articleIdx + 1 < articleWords.length) setArticleIdx((i) => i + 1); else setArticleIdx(0);
                        }}>OK</button>
                      )}
                    </div>
                  )}
                  {!articleFeedback && (
                    <div className="article-buttons">
                      {["der", "die", "das"].map((a) => (
                        <button key={a} className={`btn article-btn article-btn--${a}`} onClick={() => {
                          const correct = a === aw.article;
                          setArticleFeedback({ correct, answer: `${aw.article} ${aw.german}` });
                          if (correct) {
                            setTimeout(() => {
                              setArticleFeedback(null);
                              if (articleIdx + 1 < articleWords.length) setArticleIdx((i) => i + 1); else setArticleIdx(0);
                            }, 1000);
                          }
                        }}>{a}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* === SECTION: Quiz === */}
      <div className="accordion">
        <button className={`accordion-header${openSections.has("quiz") ? " accordion-header--open" : ""}`} onClick={() => toggleSection("quiz")}>
          <span className="accordion-icon">{openSections.has("quiz") ? "▼" : "▶"}</span>
          <span className="accordion-title">❓ Quiz</span>
          <span className="accordion-count">20</span>
        </button>
        {openSections.has("quiz") && (
          <div className="accordion-body">
            {!quizStarted && (
              <div className="quiz-start">
                <p>{de ? "Teste dein Wissen mit 20 zufälligen Fragen aus diesem Kapitel." : "Test your knowledge with 20 random questions from this chapter."}</p>
                <button className="btn btn--primary" onClick={startQuiz} style={{ width: "100%" }} disabled={words.length === 0}>
                  {de ? "Quiz starten" : "Start Quiz"}
                </button>
              </div>
            )}

            {quizStarted && !quizDone && quizWord && (
              <div className="quiz-active">
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${((quizIdx + 1) / quizQuestions.length) * 100}%` }} />
                </div>
                <p className="quiz-counter">{de ? "Frage" : "Question"} {quizIdx + 1}/{quizQuestions.length}</p>

                <div className="quiz-question-card">
                  {quizWord.article && <span className="word-article">{quizWord.article}</span>}
                  <span className="word-german">{quizWord.german}</span>
                  {quizWord.wordType && quizWord.wordType !== "noun" && (
                    <span className={`word-type-badge word-type-badge--${quizWord.wordType}`}>{quizWord.wordType}</span>
                  )}
                </div>

                {quizFeedback && (
                  <div className={`feedback feedback--${quizFeedback.type}`}>
                    {quizFeedback.type === "correct"
                      ? (de ? "Richtig!" : "Correct!")
                      : `${de ? "Falsch" : "Wrong"} — ${quizFeedback.answer}`}
                  </div>
                )}

                {!quizFeedback ? (
                  <form onSubmit={submitQuizAnswer}>
                    <input className="typing-input" type="text" value={quizInput}
                      onChange={(e) => setQuizInput(e.target.value)}
                      placeholder={de ? "Antwort eingeben..." : "Type your answer..."} autoFocus />
                    <button className="btn btn--primary" type="submit" style={{ width: "100%" }}>{de ? "Antworten" : "Answer"}</button>
                  </form>
                ) : (
                  <button className="btn btn--primary" onClick={nextQuizQuestion} style={{ width: "100%" }}>
                    {quizIdx + 1 < quizQuestions.length ? (de ? "Nächste Frage" : "Next Question") : (de ? "Ergebnis zeigen" : "Show Results")} →
                  </button>
                )}
              </div>
            )}

            {quizDone && (
              <div className="quiz-result">
                <div className="score-display">
                  <span className="score-number">{calculateAccuracy(quizScore.correct, quizScore.total)}%</span>
                  <span className="score-label">{quizScore.correct}/{quizScore.total} {de ? "richtig" : "correct"}</span>
                </div>
                <div className="quiz-grade">
                  {quizScore.correct / quizScore.total >= 0.9 ? "⭐ Excellent!" :
                   quizScore.correct / quizScore.total >= 0.7 ? "👍 Good!" :
                   quizScore.correct / quizScore.total >= 0.5 ? "📚 Fair" : "💪 Keep practicing!"}
                </div>
                <button className="btn btn--primary" onClick={startQuiz} style={{ width: "100%" }}>
                  {de ? "Nochmal versuchen" : "Try Again"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* === SECTION: Notes === */}
      <div className="accordion">
        <button className={`accordion-header${openSections.has("notes") ? " accordion-header--open" : ""}`} onClick={() => toggleSection("notes")}>
          <span className="accordion-icon">{openSections.has("notes") ? "▼" : "▶"}</span>
          <span className="accordion-title">📝 {de ? "Meine Notizen" : "My Notes"}</span>
          {notes.trim() && <span className="accordion-count">✓</span>}
        </button>
        {openSections.has("notes") && (
          <div className="accordion-body">
            <p className="notes-hint">{de ? "Schreibe deine Beobachtungen und Lernerfahrungen auf:" : "Write down your observations and learnings:"}</p>
            <textarea
              className="notes-textarea"
              value={notes}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder={de
                ? "z.B. Der Unterschied zwischen als und wenn ist mir jetzt klar..."
                : "e.g. I noticed that der/die/das patterns for -ung words are always die..."}
              rows={8}
            />
            {notes.trim() && (
              <p className="notes-saved">{de ? "Automatisch gespeichert" : "Auto-saved"}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
