describe("Database Schema", () => {
  it("should have the correct table models defined", () => {
    const expectedModels = [
      "UserSettings",
      "Chapter",
      "Word",
      "WordProgress",
      "Verb",
      "VerbProgress",
      "GrammarRule",
      "SentenceExercise",
      "SentenceProgress",
      "ReadingPassage",
      "ListeningExercise",
      "WritingPrompt",
      "SpeakingPrompt",
      "Recording",
      "MockTest",
      "DailyLog",
    ];

    const fs = require("fs");
    const schema = fs.readFileSync("prisma/schema.prisma", "utf-8");

    expectedModels.forEach((model) => {
      expect(schema).toContain(`model ${model}`);
    });
  });
});
