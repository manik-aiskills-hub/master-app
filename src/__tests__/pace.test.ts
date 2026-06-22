import { calculateDaysLeft, calculatePace, getWordsPerDay, getVerbsPerDay } from "@/lib/pace";

describe("calculateDaysLeft", () => {
  it("returns positive days when exam is in the future", () => {
    const now = new Date("2026-06-01");
    const exam = new Date("2026-06-30");
    expect(calculateDaysLeft(exam, now)).toBe(29);
  });

  it("returns 0 when exam date has passed", () => {
    const now = new Date("2026-07-01");
    const exam = new Date("2026-06-30");
    expect(calculateDaysLeft(exam, now)).toBe(0);
  });

  it("returns 0 on the exam day", () => {
    const now = new Date("2026-06-30");
    const exam = new Date("2026-06-30");
    expect(calculateDaysLeft(exam, now)).toBe(0);
  });
});

describe("calculatePace", () => {
  it("returns relaxed when more than 25 days left", () => {
    expect(calculatePace(30)).toBe("relaxed");
  });

  it("returns normal when 15-25 days left", () => {
    expect(calculatePace(20)).toBe("normal");
  });

  it("returns intense when 8-14 days left", () => {
    expect(calculatePace(10)).toBe("intense");
  });

  it("returns cramming when 7 or fewer days left", () => {
    expect(calculatePace(5)).toBe("cramming");
  });
});

describe("getWordsPerDay", () => {
  it("returns 20 for early phase (>20 days)", () => {
    expect(getWordsPerDay(25)).toBe(20);
  });

  it("returns 15 for mid phase (11-20 days)", () => {
    expect(getWordsPerDay(15)).toBe(15);
  });

  it("returns 10 for final phase (<=10 days)", () => {
    expect(getWordsPerDay(7)).toBe(10);
  });
});

describe("getVerbsPerDay", () => {
  it("returns 10 for early phase (>20 days)", () => {
    expect(getVerbsPerDay(25)).toBe(10);
  });

  it("returns 8 for mid phase (11-20 days)", () => {
    expect(getVerbsPerDay(15)).toBe(8);
  });

  it("returns 5 for final phase (<=10 days)", () => {
    expect(getVerbsPerDay(7)).toBe(5);
  });
});
