import { checkFillIn, checkSentence, exerciseProgress } from "@/lib/grammar-engine";

describe("checkFillIn", () => {
  it("matches case-insensitively with trimming", () => {
    expect(checkFillIn("  Den ", "den")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(checkFillIn("der", "den")).toBe(false);
  });
});

describe("checkSentence", () => {
  it("marks exact match as correct", () => {
    const result = checkSentence("Ich gehe in die Schule.", "Ich gehe in die Schule.");
    expect(result.correct).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("detects capitalization errors", () => {
    const result = checkSentence("ich gehe in die schule.", "Ich gehe in die Schule.");
    expect(result.correct).toBe(false);
    expect(result.errors[0]).toContain("Check capitalization");
  });

  it("detects missing punctuation", () => {
    const result = checkSentence("Ich gehe in die Schule", "Ich gehe in die Schule.");
    expect(result.correct).toBe(false);
    expect(result.errors).toContain("Missing punctuation at end");
  });

  it("detects wrong words", () => {
    const result = checkSentence("Ich gehe in der Schule.", "Ich gehe in die Schule.");
    expect(result.correct).toBe(false);
    expect(result.errors.some((e) => e.includes("der"))).toBe(true);
  });

  it("detects word count mismatch", () => {
    const result = checkSentence("Ich gehe.", "Ich gehe in die Schule.");
    expect(result.correct).toBe(false);
    expect(result.errors.some((e) => e.includes("words"))).toBe(true);
  });
});

describe("exerciseProgress", () => {
  it("calculates percentage", () => {
    expect(exerciseProgress(10, 5)).toEqual({ percent: 50, done: false });
  });

  it("marks done at 100%", () => {
    expect(exerciseProgress(10, 10)).toEqual({ percent: 100, done: true });
  });

  it("handles empty set", () => {
    expect(exerciseProgress(0, 0)).toEqual({ percent: 0, done: false });
  });
});
