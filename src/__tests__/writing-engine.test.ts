import {
  parseChecklist,
  getWritingTypeLabel,
  countWords,
  hasGreeting,
  hasClosing,
  evaluateWriting,
  type ChecklistItem,
} from "@/lib/writing-engine";

describe("parseChecklist", () => {
  it("parses valid JSON", () => {
    const items = [{ label: "Datum", hint: "Include a date" }];
    expect(parseChecklist(JSON.stringify(items))).toEqual(items);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseChecklist("broken")).toEqual([]);
  });
});

describe("getWritingTypeLabel", () => {
  it("returns German label", () => {
    expect(getWritingTypeLabel("email", "de")).toBe("E-Mail");
    expect(getWritingTypeLabel("letter", "de")).toBe("Brief");
  });

  it("returns English label", () => {
    expect(getWritingTypeLabel("complaint", "en")).toBe("Complaint");
  });

  it("falls back to raw type for unknown", () => {
    expect(getWritingTypeLabel("unknown_type", "en")).toBe("unknown_type");
  });
});

describe("countWords", () => {
  it("counts words in a sentence", () => {
    expect(countWords("Ich gehe in die Schule")).toBe(5);
  });

  it("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });

  it("handles multiple spaces", () => {
    expect(countWords("Hallo   Welt")).toBe(2);
  });
});

describe("hasGreeting", () => {
  it("detects German greetings", () => {
    expect(hasGreeting("Sehr geehrte Frau Müller,")).toBe(true);
    expect(hasGreeting("Liebe Anna,")).toBe(true);
  });

  it("returns false without greeting", () => {
    expect(hasGreeting("Ich möchte mich beschweren.")).toBe(false);
  });
});

describe("hasClosing", () => {
  it("detects German closings", () => {
    expect(hasClosing("Mit freundlichen Grüßen, Max")).toBe(true);
    expect(hasClosing("Viele Grüße")).toBe(true);
  });

  it("returns false without closing", () => {
    expect(hasClosing("Das ist alles.")).toBe(false);
  });
});

describe("evaluateWriting", () => {
  const checklist: ChecklistItem[] = [
    { label: "Datum", hint: "Include a date" },
    { label: "Grund", hint: "State the reason" },
  ];

  it("evaluates a complete letter", () => {
    const text = "Sehr geehrte Frau Müller,\n\nDas Datum ist heute. Der Grund ist klar.\n\nMit freundlichen Grüßen,\nMax";
    const result = evaluateWriting(text, checklist);
    expect(result.hasGreeting).toBe(true);
    expect(result.hasClosing).toBe(true);
    expect(result.checklistResults).toEqual([true, true]);
    expect(result.wordCount).toBeGreaterThan(5);
  });

  it("detects missing elements", () => {
    const text = "Ich möchte etwas sagen.";
    const result = evaluateWriting(text, checklist);
    expect(result.hasGreeting).toBe(false);
    expect(result.hasClosing).toBe(false);
    expect(result.checklistResults).toEqual([false, false]);
  });
});
