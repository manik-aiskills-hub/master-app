import {
  selectDailyWords,
  generateMCQOptions,
  checkAnswer,
  calculateAccuracy,
  isWordWeak,
  chapterProgress,
  type WordItem,
} from "@/lib/word-engine";

const mockWords: WordItem[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  german: `wort_${i + 1}`,
  english: `word_${i + 1}`,
  article: i % 2 === 0 ? "der" : "die",
  plural: null,
  exampleDe: null,
  exampleEn: null,
}));

describe("selectDailyWords", () => {
  it("returns the requested number of words", () => {
    expect(selectDailyWords(mockWords, 20)).toHaveLength(20);
  });

  it("returns all words if fewer than requested", () => {
    expect(selectDailyWords(mockWords.slice(0, 5), 20)).toHaveLength(5);
  });
});

describe("generateMCQOptions", () => {
  it("returns 4 options including the correct answer", () => {
    const options = generateMCQOptions(mockWords[0], mockWords);
    expect(options).toHaveLength(4);
    expect(options).toContain(mockWords[0].english);
  });

  it("returns fewer options when not enough words available", () => {
    const options = generateMCQOptions(mockWords[0], mockWords.slice(0, 2));
    expect(options.length).toBeLessThanOrEqual(4);
    expect(options).toContain(mockWords[0].english);
  });
});

describe("checkAnswer", () => {
  it("matches case-insensitively", () => {
    expect(checkAnswer("Hello", "hello")).toBe(true);
  });

  it("trims whitespace", () => {
    expect(checkAnswer("  hello ", "hello")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(checkAnswer("wrong", "correct")).toBe(false);
  });
});

describe("calculateAccuracy", () => {
  it("returns percentage", () => {
    expect(calculateAccuracy(7, 10)).toBe(70);
  });

  it("returns 0 for no attempts", () => {
    expect(calculateAccuracy(0, 0)).toBe(0);
  });

  it("rounds to nearest integer", () => {
    expect(calculateAccuracy(1, 3)).toBe(33);
  });
});

describe("isWordWeak", () => {
  it("returns false with fewer than 2 attempts", () => {
    expect(isWordWeak(0, 1)).toBe(false);
  });

  it("returns true when accuracy below 60%", () => {
    expect(isWordWeak(1, 5)).toBe(true);
  });

  it("returns false when accuracy 60% or above", () => {
    expect(isWordWeak(3, 5)).toBe(false);
  });
});

describe("chapterProgress", () => {
  it("calculates percentage correctly", () => {
    expect(chapterProgress(20, 10)).toEqual({ percent: 50, complete: false });
  });

  it("marks complete at 100%", () => {
    expect(chapterProgress(20, 20)).toEqual({ percent: 100, complete: true });
  });

  it("handles empty chapter", () => {
    expect(chapterProgress(0, 0)).toEqual({ percent: 0, complete: false });
  });
});
