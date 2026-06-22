import {
  parseQuestions,
  checkReadingAnswer,
  calculateReadingScore,
  formatTime,
  isTimeUp,
  type ReadingQuestion,
} from "@/lib/reading-engine";

const mockQuestions: ReadingQuestion[] = [
  { question: "What is the topic?", options: ["A", "B", "C"], correctIndex: 1 },
  { question: "Where does it happen?", options: ["X", "Y", "Z"], correctIndex: 0 },
  { question: "Who is mentioned?", options: ["P", "Q", "R"], correctIndex: 2 },
];

describe("parseQuestions", () => {
  it("parses valid JSON", () => {
    const json = JSON.stringify(mockQuestions);
    const result = parseQuestions(json);
    expect(result).toHaveLength(3);
    expect(result[0].question).toBe("What is the topic?");
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseQuestions("invalid")).toEqual([]);
  });
});

describe("checkReadingAnswer", () => {
  it("returns true for correct selection", () => {
    expect(checkReadingAnswer(1, 1)).toBe(true);
  });

  it("returns false for wrong selection", () => {
    expect(checkReadingAnswer(0, 1)).toBe(false);
  });
});

describe("calculateReadingScore", () => {
  it("counts correct answers", () => {
    const result = calculateReadingScore([1, 0, 2], mockQuestions);
    expect(result).toEqual({ correct: 3, total: 3, percent: 100 });
  });

  it("handles wrong answers", () => {
    const result = calculateReadingScore([0, 1, 0], mockQuestions);
    expect(result).toEqual({ correct: 0, total: 3, percent: 0 });
  });

  it("handles null (unanswered)", () => {
    const result = calculateReadingScore([1, null, 2], mockQuestions);
    expect(result).toEqual({ correct: 2, total: 3, percent: 67 });
  });
});

describe("formatTime", () => {
  it("formats minutes and seconds", () => {
    expect(formatTime(125)).toBe("2:05");
  });

  it("formats zero", () => {
    expect(formatTime(0)).toBe("0:00");
  });
});

describe("isTimeUp", () => {
  it("returns true when remaining is 0", () => {
    expect(isTimeUp(0)).toBe(true);
  });

  it("returns false when time remains", () => {
    expect(isTimeUp(60)).toBe(false);
  });
});
