// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { seedData } from "../data/seed";
import { PersonRail } from "./PersonRail";

const person = seedData.people[0];

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined)
    }
  });
});

describe("PersonRail", () => {
  it("opens BuddyScan Poster Lab, expands context, copies text, and closes without saving data", async () => {
    const onPatch = vi.fn();
    const onDelete = vi.fn();
    const onDeleteNote = vi.fn();
    const onAddNote = vi.fn();
    const onUpdateLoop = vi.fn();
    const onAddNextMove = vi.fn();

    render(
      <PersonRail
        data={seedData}
        person={person}
        onPatch={onPatch}
        onDelete={onDelete}
        onDeleteNote={onDeleteNote}
        onAddNote={onAddNote}
        onUpdateLoop={onUpdateLoop}
        onAddNextMove={onAddNextMove}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Fake Dossier Art" }));

    const dialog = screen.getByRole("dialog", { name: "Poster Lab" });
    expect(within(dialog).getByText("BuddyScan 3000 Office Edition")).toBeTruthy();
    expect(within(dialog).getAllByText("Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence.").length).toBeGreaterThan(1);

    const contextButton = within(dialog).getByRole("button", { name: "Context Receipt" });
    expect(contextButton.getAttribute("aria-expanded")).toBe("false");
    expect(within(dialog).queryByText("No notes, contact values, social scraping, or private summaries are used.")).toBeNull();

    fireEvent.click(contextButton);

    expect(contextButton.getAttribute("aria-expanded")).toBe("true");
    expect(within(dialog).getByText("No notes, contact values, social scraping, or private summaries are used.")).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "Shuffle Bureau Nonsense" }));

    expect(within(dialog).getByText("Bureau nonsense shuffled. Facts untouched, dignity negotiable.")).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "Copy Poster Text" }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("BuddyScan 3000 Office Edition"));

    fireEvent.click(within(dialog).getByRole("button", { name: "Close Poster Lab" }));

    expect(screen.queryByRole("dialog", { name: "Poster Lab" })).toBeNull();
    expect(onPatch).not.toHaveBeenCalled();
    expect(onAddNote).not.toHaveBeenCalled();
    expect(onAddNextMove).not.toHaveBeenCalled();
  });
});
