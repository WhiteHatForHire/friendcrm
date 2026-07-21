import { Brain, Check, Lock, Shield, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { personName } from "../lib/insights";
import { today } from "../lib/storage";
import type { CrmData, RelationshipNote, Sensitivity } from "../types";

const sourceTypes: RelationshipNote["sourceType"][] = ["manual", "call", "dinner", "meeting", "text_summary", "memory"];
const sensitivityOptions: Sensitivity[] = ["normal", "sensitive", "private"];

export function ReflectionLog({
  data,
  focusSignal,
  onAddNote,
  onDeleteNote
}: {
  data: CrmData;
  focusSignal?: number;
  onAddNote: (note: Omit<RelationshipNote, "id" | "createdAt">) => void | Promise<void>;
  onDeleteNote: (noteId: string) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(data.people[0] ? [data.people[0].id] : []);
  const [text, setText] = useState("");
  const [sourceType, setSourceType] = useState<RelationshipNote["sourceType"]>("manual");
  const [sensitivity, setSensitivity] = useState<Sensitivity>("normal");
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState("The note gets saved first. Permanent memory still needs your explicit blessing.");
  const captureRef = useRef<HTMLTextAreaElement>(null);
  const readyToCapture = text.trim().length > 0 && selectedIds.length > 0 && !isCapturing;

  useEffect(() => {
    if (focusSignal) {
      captureRef.current?.focus();
    }
  }, [focusSignal]);

  async function captureNote() {
    if (!readyToCapture) return;
    setIsCapturing(true);
    setCaptureMessage("Saving the note now. The review panel will open for anything trying to become lore.");

    try {
      await onAddNote({
        personIds: selectedIds,
        occurredAt: today(),
        sourceType,
        rawText: text.trim(),
        sensitivity
      });
      setText("");
      setCaptureMessage("Note saved. If anything wants to become permanent, you get the final say.");
    } catch {
      setCaptureMessage("Save failed. Your note stayed in the box and nothing became memory.");
    } finally {
      setIsCapturing(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void captureNote();
  }

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Debrief Booth</h1>
          <p>
            {data.notes.length} captured notes. {selectedIds.length} selected for this debrief.
          </p>
          <p className="view-guide">First move: choose who was there, then capture what actually happened.</p>
        </div>
      </header>

      <form className={`reflection-grid${isCapturing ? " is-capturing" : ""}`} onSubmit={submit} aria-busy={isCapturing}>
        <div className="person-picker">
          <div className="picker-head">
            <strong className="picker-title">Who was involved?</strong>
            <div className="picker-actions">
              <button type="button" onClick={() => setSelectedIds(data.people.map((person) => person.id))}>
                Everyone
              </button>
              <button type="button" onClick={() => setSelectedIds([])}>
                Nobody
              </button>
            </div>
          </div>
          {data.people.map((person) => (
            <label key={person.id} className="person-check">
              <input
                type="checkbox"
                checked={selectedIds.includes(person.id)}
                onChange={(event) =>
                  setSelectedIds((current) =>
                    event.target.checked ? [...current, person.id] : current.filter((id) => id !== person.id)
                  )
                }
              />
              {person.name}
            </label>
          ))}
        </div>
        <div className="composer">
          <div className="form-row">
            <select value={sourceType} onChange={(event) => setSourceType(event.target.value as RelationshipNote["sourceType"])}>
              {sourceTypes.map((option) => (
                <option key={option} value={option}>
                  {label(option)}
                </option>
              ))}
            </select>
            <select value={sensitivity} onChange={(event) => setSensitivity(event.target.value as Sensitivity)}>
              {sensitivityOptions.map((option) => (
                <option key={option} value={option}>
                  {label(option)}
                </option>
              ))}
            </select>
          </div>
          <textarea
            ref={captureRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                void captureNote();
              }
            }}
            disabled={isCapturing}
            placeholder="What happened? What did they reveal? What did you foolishly promise?"
          />
          <div className="composer-meta">
            <span>{text.trim().length} chars</span>
            <span>{selectedIds.length} people</span>
            <span>
              {isCapturing
                ? "Bagging the evidence"
                : readyToCapture
                  ? "Ready for interrogation"
                  : "Need a person and a tiny confession"}
            </span>
            <SensitivityBadge sensitivity={sensitivity} />
          </div>
          <div className={isCapturing ? "capture-status active" : "capture-status"} aria-live="polite">
            {captureMessage}
          </div>
          <button className="primary-button" type="submit" disabled={!readyToCapture}>
            <Brain size={16} />
            {isCapturing ? "Preparing the File" : "Capture & Interrogate"}
          </button>
        </div>
      </form>

      <section className="timeline">
        {data.notes.length === 0 && (
          <div className="empty-state classified-empty">
            <span className="classified-kicker">Debrief Classifieds</span>
            <strong>WANTED: One Tiny Social Red Flag</strong>
            <p>Capture an interaction, promise, preference, boundary, or oddly specific coffee order.</p>
            <span className="classified-stamp">START PAPERWORK</span>
          </div>
        )}
        {data.notes.slice(0, 12).map((note) => (
          <article key={note.id} className="timeline-item">
            <div className="note-head">
              <span>{note.occurredAt}</span>
              <button
                className="icon-button danger-icon"
                type="button"
                title="Delete note and source-backed records"
                onClick={() => {
                  if (window.confirm("Delete this note and any memories or open loops sourced from it?")) {
                    onDeleteNote(note.id);
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <strong>{note.personIds.map((id) => personName(data, id)).join(", ")}</strong>
            <p>{note.rawText}</p>
            <SensitivityBadge sensitivity={note.sensitivity} />
          </article>
        ))}
      </section>
    </section>
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

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
