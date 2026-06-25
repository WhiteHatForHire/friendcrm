import { Check, Lock, Shield, X } from "lucide-react";
import { useEffect } from "react";
import type { ExtractorValidationError } from "../lib/aiExtractorSchema";
import type { ExtractionSuggestion, Person, Sensitivity } from "../types";

export type PendingReview = {
  suggestions: ExtractionSuggestion[];
  acceptedIds: string[];
  source: "validated_http" | "validated_mock" | "deterministic_fallback";
  errors: ExtractorValidationError[];
};

const sensitivityOptions: Sensitivity[] = ["normal", "sensitive", "private"];

export function ReviewPanel({
  pendingReview,
  people,
  onToggle,
  onAcceptAll,
  onRejectAll,
  onDismiss,
  onEdit,
  onSave
}: {
  pendingReview: PendingReview;
  people: Person[];
  onToggle: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onDismiss: () => void;
  onEdit: (id: string, patch: Partial<ExtractionSuggestion>) => void;
  onSave: () => void;
}) {
  const acceptedCount = pendingReview.acceptedIds.length;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss();
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        onSave();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss, onSave]);

  return (
    <div className="review-overlay">
      <section className="review-panel">
        <header>
          <div>
            <h2>Before This Becomes Lore</h2>
            <p>
              The note is saved. {acceptedCount} of {pendingReview.suggestions.length} source-backed records are trying
              to become official memory.
            </p>
            <p className="review-source">
              {pendingReview.source === "validated_http"
                ? "Checked by the local AI desk. You still choose what becomes memory."
                : pendingReview.source === "validated_mock"
                  ? "Checked by the safe local review desk."
                  : "The fancy review machine stumbled, so the safe local version made these suggestions."}
            </p>
            <p className="review-source">
              The note is already saved. Nothing below becomes memory until you approve it. Esc keeps the note only.
              Cmd/Ctrl+Enter makes selected lore official.
            </p>
          </div>
          <button type="button" onClick={onDismiss} title="Close">
            <X size={17} />
          </button>
        </header>
        <div className="review-toolbar">
          <button type="button" onClick={onAcceptAll}>
            Trust the Machine
          </button>
          <button type="button" onClick={onRejectAll}>
            Absolutely Not
          </button>
        </div>
        <div className="review-list">
          {pendingReview.suggestions.length === 0 && (
            <div className="empty-state">
              The note was saved. No durable records extracted. Either it was chill, vague, or the machine kept its mouth shut.
            </div>
          )}
          {pendingReview.suggestions.map((suggestion) => (
            <article key={suggestion.id} className="review-item">
              <label className="review-check">
                <input
                  type="checkbox"
                  checked={pendingReview.acceptedIds.includes(suggestion.id)}
                  onChange={() => onToggle(suggestion.id)}
                />
                <span>
                  <strong>
                    {suggestion.kind === "memory" ? "Memory Attempt" : "Unfinished Business"} ·{" "}
                    {personLabel(people, suggestion.personId)}
                  </strong>
                  <small>
                    {pendingReview.acceptedIds.includes(suggestion.id)
                      ? "Will become canon"
                      : "Will stay out of the permanent file"}
                  </small>
                </span>
              </label>
              <div className="review-fields">
                {suggestion.kind === "openLoop" && (
                  <input
                    value={suggestion.title}
                    onChange={(event) => onEdit(suggestion.id, { title: event.target.value })}
                    aria-label="Open loop title"
                  />
                )}
                <textarea
                  value={suggestion.body}
                  onChange={(event) => onEdit(suggestion.id, { body: event.target.value })}
                  aria-label={suggestion.kind === "memory" ? "Memory text" : "Open loop description"}
                />
                <div className="review-meta">
                  {suggestion.kind === "memory" && (
                    <select
                      value={suggestion.category ?? "other"}
                      onChange={(event) =>
                        onEdit(suggestion.id, { category: event.target.value as NonNullable<ExtractionSuggestion["category"]> })
                      }
                    >
                      {["preference", "life_context", "boundary", "history", "interest", "risk", "other"].map((category) => (
                        <option key={category} value={category}>
                          {label(category)}
                        </option>
                      ))}
                    </select>
                  )}
                  {suggestion.kind === "openLoop" && (
                    <input
                      type="date"
                      value={suggestion.dueAt ?? ""}
                      onChange={(event) => onEdit(suggestion.id, { dueAt: event.target.value || undefined })}
                      aria-label="Open loop due date"
                    />
                  )}
                  <select
                    value={suggestion.sensitivity}
                    onChange={(event) => onEdit(suggestion.id, { sensitivity: event.target.value as Sensitivity })}
                  >
                    {sensitivityOptions.map((option) => (
                      <option key={option} value={option}>
                        {label(option)}
                      </option>
                    ))}
                  </select>
                </div>
                <small className="basis">Receipt: {suggestion.basis}</small>
              </div>
              <SensitivityBadge sensitivity={suggestion.sensitivity} />
            </article>
          ))}
        </div>
        <footer>
          <button type="button" onClick={onDismiss}>
            Keep Note, Kill Lore
          </button>
          <button className="primary-button" type="button" onClick={onSave} disabled={pendingReview.suggestions.length === 0}>
            <Check size={16} />
            Make It Canon
          </button>
        </footer>
      </section>
    </div>
  );
}

function SensitivityBadge({ sensitivity }: { sensitivity: Sensitivity }) {
  const Icon = sensitivity === "normal" ? Check : sensitivity === "sensitive" ? Shield : Lock;
  return (
    <span className={`sensitivity ${sensitivity}`}>
      <Icon size={12} />
      {label(sensitivity)}
    </span>
  );
}

function personLabel(people: Person[], personId: string) {
  return people.find((person) => person.id === personId)?.name ?? "Unknown";
}

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
