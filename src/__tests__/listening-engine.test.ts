import {
  parseListeningQuestions,
  extractYoutubeId,
  getEmbedUrl,
  checkListeningAnswer,
  calculateListeningScore,
  isPassiveMode,
  type ListeningQuestion,
} from "@/lib/listening-engine";

const mockQuestions: ListeningQuestion[] = [
  { question: "Was bestellt der Mann?", options: ["Kaffee", "Tee", "Wasser"], correctIndex: 0 },
  { question: "Wo findet das Gespräch statt?", options: ["Büro", "Café", "Bahnhof"], correctIndex: 1 },
  { question: "Wann kommt der Zug?", options: ["10 Uhr", "12 Uhr", "14 Uhr"], correctIndex: 2 },
];

describe("parseListeningQuestions", () => {
  it("parses valid JSON", () => {
    const json = JSON.stringify(mockQuestions);
    const result = parseListeningQuestions(json);
    expect(result).toHaveLength(3);
    expect(result[0].question).toBe("Was bestellt der Mann?");
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseListeningQuestions("broken")).toEqual([]);
  });
});

describe("extractYoutubeId", () => {
  it("extracts from standard watch URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts from short URL", () => {
    expect(extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts from embed URL", () => {
    expect(extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for invalid URL", () => {
    expect(extractYoutubeId("https://example.com/video")).toBeNull();
  });
});

describe("getEmbedUrl", () => {
  it("converts watch URL to embed URL", () => {
    expect(getEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ"))
      .toBe("https://www.youtube.com/embed/dQw4w9WgXcQ");
  });

  it("returns null for invalid URL", () => {
    expect(getEmbedUrl("not-a-url")).toBeNull();
  });
});

describe("checkListeningAnswer", () => {
  it("returns true for correct answer", () => {
    expect(checkListeningAnswer(0, 0)).toBe(true);
  });

  it("returns false for wrong answer", () => {
    expect(checkListeningAnswer(1, 0)).toBe(false);
  });
});

describe("calculateListeningScore", () => {
  it("scores all correct", () => {
    const result = calculateListeningScore([0, 1, 2], mockQuestions);
    expect(result).toEqual({ correct: 3, total: 3, percent: 100 });
  });

  it("scores all wrong", () => {
    const result = calculateListeningScore([2, 0, 1], mockQuestions);
    expect(result).toEqual({ correct: 0, total: 3, percent: 0 });
  });

  it("handles unanswered (null)", () => {
    const result = calculateListeningScore([0, null, 2], mockQuestions);
    expect(result).toEqual({ correct: 2, total: 3, percent: 67 });
  });

  it("handles empty questions", () => {
    expect(calculateListeningScore([], [])).toEqual({ correct: 0, total: 0, percent: 0 });
  });
});

describe("isPassiveMode", () => {
  it("returns true for passive", () => {
    expect(isPassiveMode("passive")).toBe(true);
  });

  it("returns false for active", () => {
    expect(isPassiveMode("active")).toBe(false);
  });
});
