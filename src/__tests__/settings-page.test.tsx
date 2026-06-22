import { render, screen } from "@testing-library/react";
import SettingsPage from "@/app/settings/page";

const mockSetTheme = jest.fn();
const mockSetLanguage = jest.fn();
const mockSetExamDate = jest.fn();

jest.mock("@/lib/settings-context", () => ({
  useSettings: () => ({
    theme: "light" as const,
    language: "en" as const,
    examDate: "2026-07-22",
    setTheme: mockSetTheme,
    setLanguage: mockSetLanguage,
    setExamDate: mockSetExamDate,
    loading: false,
  }),
}));

describe("SettingsPage", () => {
  it("renders the settings title", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders theme toggle buttons", () => {
    render(<SettingsPage />);
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("renders language toggle buttons", () => {
    render(<SettingsPage />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("DE")).toBeInTheDocument();
  });

  it("renders exam date input", () => {
    render(<SettingsPage />);
    const dateInput = screen.getByDisplayValue("2026-07-22");
    expect(dateInput).toBeInTheDocument();
  });

  it("shows pace badge when exam date is set", () => {
    render(<SettingsPage />);
    expect(screen.getByText(/days left/)).toBeInTheDocument();
  });
});
