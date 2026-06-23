import {
  parseKeyPhrases,
  getSpeakingTypeLabel,
  checkKeyPhraseUsage,
  calculatePhraseScore,
  formatDuration,
  isRecordingSupported,
} from "@/lib/speaking-engine";

describe("parseKeyPhrases", () => {
  it("parses valid JSON array", () => {
    expect(parseKeyPhrases('["Hallo","Tschüss"]')).toEqual(["Hallo", "Tschüss"]);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseKeyPhrases("bad")).toEqual([]);
  });
});

describe("getSpeakingTypeLabel", () => {
  it("returns German label", () => {
    expect(getSpeakingTypeLabel("monologue", "de")).toBe("Monolog");
    expect(getSpeakingTypeLabel("dialogue", "de")).toBe("Dialog");
  });

  it("returns English label", () => {
    expect(getSpeakingTypeLabel("picture_description", "en")).toBe("Picture Description");
  });

  it("falls back for unknown type", () => {
    expect(getSpeakingTypeLabel("quiz", "en")).toBe("quiz");
  });
});

describe("checkKeyPhraseUsage", () => {
  it("detects used phrases (case-insensitive)", () => {
    const text = "Ich möchte gerne einen Kaffee bestellen.";
    const result = checkKeyPhraseUsage(text, ["möchte gerne", "bestellen", "bezahlen"]);
    expect(result).toEqual([true, true, false]);
  });

  it("handles empty text", () => {
    expect(checkKeyPhraseUsage("", ["Hallo"])).toEqual([false]);
  });
});

describe("calculatePhraseScore", () => {
  it("calculates score", () => {
    expect(calculatePhraseScore([true, true, false])).toEqual({ used: 2, total: 3, percent: 67 });
  });

  it("handles all correct", () => {
    expect(calculatePhraseScore([true, true])).toEqual({ used: 2, total: 2, percent: 100 });
  });

  it("handles empty", () => {
    expect(calculatePhraseScore([])).toEqual({ used: 0, total: 0, percent: 0 });
  });
});

describe("formatDuration", () => {
  it("formats seconds", () => {
    expect(formatDuration(125)).toBe("2:05");
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(60)).toBe("1:00");
  });
});

describe("isRecordingSupported", () => {
  it("returns false in Node/test environment", () => {
    expect(isRecordingSupported()).toBe(false);
  });
});
