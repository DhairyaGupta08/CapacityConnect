import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { SkipLink } from "@/components/layout/SkipLink";

describe("Frontend Core Components Smoke Test", () => {
  it("renders Button component with label and proper attributes", () => {
    render(<Button variant="primary">Test Action</Button>);
    const btn = screen.getByRole("button", { name: /test action/i });
    expect(btn).toBeDefined();
    expect(btn.className).toContain("bg-[#0077B6]");
  });

  it("renders SkipLink component for accessibility", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("#main-content");
  });
});
