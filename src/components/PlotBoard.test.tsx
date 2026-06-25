// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { seedData } from "../data/seed";
import { PlotBoard } from "./PlotBoard";

afterEach(() => {
  cleanup();
});

describe("PlotBoard", () => {
  it("updates a move through the keyboard-friendly status select", () => {
    const onSelect = vi.fn();
    const onUpdateMove = vi.fn();

    render(<PlotBoard data={seedData} onSelect={onSelect} onUpdateMove={onUpdateMove} />);

    fireEvent.change(screen.getByLabelText("Move Jules Moreno next move to"), {
      target: { value: "queued" }
    });

    expect(onUpdateMove).toHaveBeenCalledWith("x-jules-1", "queued");
  });

  it("selects the related person from a move card", () => {
    const onSelect = vi.fn();
    const onUpdateMove = vi.fn();

    render(<PlotBoard data={seedData} onSelect={onSelect} onUpdateMove={onUpdateMove} />);

    fireEvent.click(screen.getByRole("button", { name: "Jules Moreno" }));

    expect(onSelect).toHaveBeenCalledWith("p-jules");
  });
});
