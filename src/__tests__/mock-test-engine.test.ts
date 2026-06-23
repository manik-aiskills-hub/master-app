import {
  parseSections,
  getMockTestDays,
  getTestType,
  getMiniSections,
  getFullSections,
  calculateMockScore,
  isTestDay,
} from "@/lib/mock-test-engine";

describe("parseSections", () => {
  it("parses valid JSON", () => {
    const sections = [{ name: "Lesen", questionCount: 5, timeLimitSeconds: 300 }];
    expect(parseSections(JSON.stringify(sections))).toEqual(sections);
  });

  it("returns empty for invalid JSON", () => {
    expect(parseSections("bad")).toEqual([]);
  });
});

describe("getMockTestDays", () => {
  it("returns correct test days", () => {
    const days = getMockTestDays();
    expect(days).toContain(5);
    expect(days).toContain(10);
    expect(days).toContain(15);
    expect(days).toContain(28);
    expect(days).toContain(30);
    expect(days).toHaveLength(8);
  });
});

describe("getTestType", () => {
  it("returns mini for early days", () => {
    expect(getTestType(5)).toBe("mini");
    expect(getTestType(20)).toBe("mini");
  });

  it("returns full for final days", () => {
    expect(getTestType(28)).toBe("full");
    expect(getTestType(29)).toBe("full");
    expect(getTestType(30)).toBe("full");
  });
});

describe("getMiniSections", () => {
  it("returns 3 sections", () => {
    expect(getMiniSections()).toHaveLength(3);
  });
});

describe("getFullSections", () => {
  it("returns 4 sections matching telc format", () => {
    const sections = getFullSections();
    expect(sections).toHaveLength(4);
    expect(sections.map((s) => s.name)).toEqual(
      expect.arrayContaining(["Lesen", "Hören", "Schreiben"])
    );
  });
});

describe("calculateMockScore", () => {
  it("calculates passing score", () => {
    const result = calculateMockScore(8, 10);
    expect(result).toEqual({ score: 8, maxScore: 10, percent: 80, passed: true });
  });

  it("calculates failing score", () => {
    const result = calculateMockScore(5, 10);
    expect(result).toEqual({ score: 5, maxScore: 10, percent: 50, passed: false });
  });

  it("handles borderline pass at 60%", () => {
    const result = calculateMockScore(6, 10);
    expect(result.passed).toBe(true);
  });

  it("handles zero", () => {
    expect(calculateMockScore(0, 0).percent).toBe(0);
  });
});

describe("isTestDay", () => {
  it("returns true for test days", () => {
    expect(isTestDay(5)).toBe(true);
    expect(isTestDay(30)).toBe(true);
  });

  it("returns false for non-test days", () => {
    expect(isTestDay(3)).toBe(false);
    expect(isTestDay(7)).toBe(false);
  });
});
