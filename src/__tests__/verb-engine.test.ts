import {
  getConjugation,
  checkConjugation,
  getPerfekt,
  generateDrill,
  verbAccuracy,
  isVerbWeak,
  PRONOUNS,
  type VerbItem,
} from "@/lib/verb-engine";

const mockVerb: VerbItem = {
  id: 1,
  infinitive: "machen",
  english: "to make/do",
  auxiliary: "haben",
  partizipII: "gemacht",
  praeteritum: "machte",
  ichPraesens: "mache",
  duPraesens: "machst",
  erPraesens: "macht",
  wirPraesens: "machen",
  ihrPraesens: "macht",
  siePraesens: "machen",
  isIrregular: false,
};

describe("getConjugation", () => {
  it("returns correct form for each pronoun", () => {
    expect(getConjugation(mockVerb, "ich")).toBe("mache");
    expect(getConjugation(mockVerb, "du")).toBe("machst");
    expect(getConjugation(mockVerb, "er/sie/es")).toBe("macht");
    expect(getConjugation(mockVerb, "wir")).toBe("machen");
    expect(getConjugation(mockVerb, "ihr")).toBe("macht");
    expect(getConjugation(mockVerb, "sie/Sie")).toBe("machen");
  });
});

describe("checkConjugation", () => {
  it("matches case-insensitively with trimming", () => {
    expect(checkConjugation("  Mache ", "mache")).toBe(true);
  });

  it("rejects wrong answers", () => {
    expect(checkConjugation("machst", "mache")).toBe(false);
  });
});

describe("getPerfekt", () => {
  it("returns auxiliary + partizip II", () => {
    expect(getPerfekt(mockVerb)).toBe("haben + gemacht");
  });
});

describe("generateDrill", () => {
  it("returns a valid pronoun and correct conjugation", () => {
    const drill = generateDrill(mockVerb);
    expect(PRONOUNS).toContain(drill.pronoun);
    expect(drill.correct).toBe(getConjugation(mockVerb, drill.pronoun));
  });
});

describe("verbAccuracy", () => {
  it("calculates percentage", () => {
    expect(verbAccuracy(8, 10)).toBe(80);
  });

  it("returns 0 for no attempts", () => {
    expect(verbAccuracy(0, 0)).toBe(0);
  });
});

describe("isVerbWeak", () => {
  it("returns false with fewer than 3 attempts", () => {
    expect(isVerbWeak(0, 2)).toBe(false);
  });

  it("returns true when accuracy below 60%", () => {
    expect(isVerbWeak(1, 5)).toBe(true);
  });

  it("returns false when accuracy 60% or above", () => {
    expect(isVerbWeak(3, 5)).toBe(false);
  });
});
