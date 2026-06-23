"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import {
  parseSections,
  getTestType,
  calculateMockScore,
  type MockTestData,
} from "@/lib/mock-test-engine";

interface TestRaw {
  id: number;
  dayNumber: number;
  type: string;
  sections: string;
  score: number | null;
  maxScore: number | null;
  completedAt: string | null;
}

export default function MockTestPage() {
  const { language } = useSettings();
  const [tests, setTests] = useState<MockTestData[]>([]);

  useEffect(() => {
    fetch("/api/mock-test")
      .then((r) => r.json())
      .then((data: TestRaw[]) =>
        setTests(
          data.map((t) => ({
            ...t,
            type: t.type as "mini" | "full",
            sections: parseSections(t.sections),
          }))
        )
      )
      .catch(() => {});
  }, []);

  return (
    <main className="container">
      <h1>{language === "de" ? "Probetests" : "Mock Tests"}</h1>
      <p className="text-secondary">
        {language === "de"
          ? "Probetests alle 5 Tage + voller Test an den letzten 3 Tagen"
          : "Mock tests every 5 days + full test in final 3 days"}
      </p>

      {tests.length === 0 && (
        <p className="empty-state">
          {language === "de"
            ? "Keine Probetests vorhanden. Seed-Skript ausführen."
            : "No mock tests yet. Run the seed script."}
        </p>
      )}

      {tests.map((test) => {
        const score = test.score !== null && test.maxScore !== null
          ? calculateMockScore(test.score, test.maxScore)
          : null;

        return (
          <div key={test.id} className="mock-test-card">
            <div className="mock-test-header">
              <h3>
                {language === "de" ? "Tag" : "Day"} {test.dayNumber} —{" "}
                {test.type === "full"
                  ? (language === "de" ? "Vollständiger Test" : "Full Test")
                  : (language === "de" ? "Mini-Test" : "Mini Test")}
              </h3>
              {score && (
                <span className={`mock-test-badge ${score.passed ? "mock-test-badge--pass" : "mock-test-badge--fail"}`}>
                  {score.percent}% {score.passed ? "✓" : "✗"}
                </span>
              )}
            </div>
            <div className="mock-test-sections">
              {test.sections.map((s, i) => (
                <span key={i} className="mock-test-section-tag">{s.name}</span>
              ))}
            </div>
            {test.completedAt && (
              <p className="mock-test-date">
                {language === "de" ? "Abgeschlossen:" : "Completed:"}{" "}
                {new Date(test.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </main>
  );
}
