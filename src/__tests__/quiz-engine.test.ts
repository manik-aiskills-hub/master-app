import {
  calculateNextReview,
  isDueForReview,
  selectWeakItems,
  selectDueItems,
  generateQuiz,
  quizScore,
  type QuizItem,
} from "@/lib/quiz-engine";

const now = new Date("2026-06-22T12:00:00Z");

const mockItems: QuizItem[] = [
  { id: 1, type: "word", question: "Haus", answer: "house", isWeak: true, lastSeen: "2026-06-21", nextReview: "2026-06-22", seenCount: 3, correctCount: 1 },
  { id: 2, type: "word", question: "Schule", answer: "school", isWeak: false, lastSeen: "2026-06-20", nextReview: "2026-06-25", seenCount: 5, correctCount: 4 },
  { id: 3, type: "verb", question: "machen", answer: "to do", isWeak: true, lastSeen: "2026-06-19", nextReview: "2026-06-21", seenCount: 4, correctCount: 1 },
  { id: 4, type: "word", question: "Buch", answer: "book", isWeak: false, lastSeen: null, nextReview: null, seenCount: 0, correctCount: 0 },
];

describe("calculateNextReview", () => {
  it("returns 1 day for first correct answer", () => {
    const next = calculateNextReview(true, 0, now);
    expect(next.getDate() - now.getDate()).toBe(1);
  });

  it("returns 3 days for second correct answer", () => {
    const next = calculateNextReview(true, 1, now);
    expect(next.getDate() - now.getDate()).toBe(3);
  });

  it("resets to 1 day on wrong answer", () => {
    const next = calculateNextReview(false, 3, now);
    expect(next.getDate() - now.getDate()).toBe(1);
  });
});

describe("isDueForReview", () => {
  it("returns true when nextReview is null", () => {
    expect(isDueForReview(null, now)).toBe(true);
  });

  it("returns true when nextReview is in the past", () => {
    expect(isDueForReview("2026-06-21", now)).toBe(true);
  });

  it("returns false when nextReview is in the future", () => {
    expect(isDueForReview("2026-06-25", now)).toBe(false);
  });
});

describe("selectWeakItems", () => {
  it("returns only weak items", () => {
    const weak = selectWeakItems(mockItems);
    expect(weak).toHaveLength(2);
    expect(weak.every((i) => i.isWeak)).toBe(true);
  });
});

describe("selectDueItems", () => {
  it("returns items due for review", () => {
    const due = selectDueItems(mockItems, now);
    expect(due).toHaveLength(3);
  });
});

describe("generateQuiz", () => {
  it("returns requested number of items in random mode", () => {
    const quiz = generateQuiz(mockItems, 2, "random");
    expect(quiz).toHaveLength(2);
  });

  it("returns only weak items in weak mode", () => {
    const quiz = generateQuiz(mockItems, 10, "weak");
    expect(quiz.every((i) => i.isWeak)).toBe(true);
  });

  it("returns only due items in due mode", () => {
    const quiz = generateQuiz(mockItems, 10, "due");
    expect(quiz.every((i) => isDueForReview(i.nextReview, now))).toBe(true);
  });
});

describe("quizScore", () => {
  it("returns excellent for 90%+", () => {
    expect(quizScore(9, 10)).toEqual({ percent: 90, grade: "excellent" });
  });

  it("returns good for 70-89%", () => {
    expect(quizScore(7, 10)).toEqual({ percent: 70, grade: "good" });
  });

  it("returns fair for 50-69%", () => {
    expect(quizScore(5, 10)).toEqual({ percent: 50, grade: "fair" });
  });

  it("returns poor for below 50%", () => {
    expect(quizScore(3, 10)).toEqual({ percent: 30, grade: "poor" });
  });
});
