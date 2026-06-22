import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the app title", () => {
    render(<Home />);
    expect(screen.getByText("German B1 Planner")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    expect(
      screen.getByText("30-day telc B1 exam preparation")
    ).toBeInTheDocument();
  });
});
