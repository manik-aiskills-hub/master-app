import { t, translations } from "@/lib/i18n";

describe("i18n", () => {
  it("returns English translations", () => {
    expect(t("en", "nav.learn")).toBe("Learn");
    expect(t("en", "settings.title")).toBe("Settings");
  });

  it("returns German translations", () => {
    expect(t("de", "nav.learn")).toBe("Lernen");
    expect(t("de", "settings.title")).toBe("Einstellungen");
  });

  it("has matching keys in both languages", () => {
    const enKeys = Object.keys(translations.en).sort();
    const deKeys = Object.keys(translations.de).sort();
    expect(enKeys).toEqual(deKeys);
  });
});
