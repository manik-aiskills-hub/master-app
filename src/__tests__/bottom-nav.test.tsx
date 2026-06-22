import { render, screen } from "@testing-library/react";
import BottomNav from "@/components/BottomNav";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const mockUseSettings = jest.fn();
jest.mock("@/lib/settings-context", () => ({
  useSettings: () => mockUseSettings(),
}));

beforeEach(() => {
  mockUseSettings.mockReturnValue({ language: "en" });
});

describe("BottomNav", () => {
  it("renders all five navigation tabs", () => {
    render(<BottomNav />);
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Exam")).toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders German labels when language is de", () => {
    mockUseSettings.mockReturnValue({ language: "de" });
    render(<BottomNav />);
    expect(screen.getByText("Lernen")).toBeInTheDocument();
    expect(screen.getByText("Einstellungen")).toBeInTheDocument();
  });

  it("marks the active tab with aria-current", () => {
    render(<BottomNav />);
    const learnLink = screen.getByText("Learn").closest("a");
    expect(learnLink).toHaveAttribute("aria-current", "page");
    const quizLink = screen.getByText("Quiz").closest("a");
    expect(quizLink).not.toHaveAttribute("aria-current");
  });
});
