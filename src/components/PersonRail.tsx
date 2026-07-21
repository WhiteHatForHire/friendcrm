import { Brain, Check, ExternalLink, Lock, Plus, Shield, Sparkles, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { DossierPosterLab } from "./DossierPosterLab";
import type { BriefForReview } from "../lib/aiGenerationRoute";
import type { GeneratedNextMove } from "../lib/aiGenerationSchema";
import { generateBriefViaHttp, generateNextMovesViaHttp } from "../lib/browserAiClient";
import { getPersonDeleteImpact } from "../lib/crm";
import { daysBetween } from "../lib/insights";
import { today } from "../lib/storage";
import type { CrmData, NextMove, OpenLoop, Person, RelationshipNote, Sensitivity, Warmth } from "../types";

const dailyAlibis = [
  "Do one thoughtful thing before opening another tab.",
  "No scraping today. The bureau is trying personal growth.",
  "Remembering birthdays is not a personality, but it helps.",
  "Act normal. Then write it down.",
  "Compliments are free. Weird spreadsheets cost extra."
];

export function PersonRail({
  data,
  person,
  onPatch,
  onDelete,
  onDeleteNote,
  onAddNote,
  onUpdateLoop,
  onAddNextMove,
  isMobileDrawerOpen = false,
  resetSignal = 0,
  onClose
}: {
  data: CrmData;
  person: Person;
  onPatch: (person: Person) => void;
  onDelete: (personId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddNote: (note: Omit<RelationshipNote, "id" | "createdAt">) => void | Promise<void>;
  onUpdateLoop: (loopId: string, status: OpenLoop["status"]) => void;
  onAddNextMove: (move: Omit<NextMove, "id" | "status">) => void;
  isMobileDrawerOpen?: boolean;
  resetSignal?: number;
  onClose?: () => void;
}) {
  const [note, setNote] = useState("");
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefResult, setBriefResult] = useState<BriefForReview | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveDraft, setMoveDraft] = useState("");
  const [moveObjective, setMoveObjective] = useState("");
  const [generatedMoves, setGeneratedMoves] = useState<GeneratedNextMove[]>([]);
  const [generatedMoveNote, setGeneratedMoveNote] = useState("");
  const [briefLoading, setBriefLoading] = useState(false);
  const [movesLoading, setMovesLoading] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [posterLabOpen, setPosterLabOpen] = useState(false);
  const personNotes = data.notes.filter((candidate) => candidate.personIds.includes(person.id));
  const memories = data.memories.filter((memory) => memory.personId === person.id && memory.confirmed);
  const loops = data.openLoops.filter((loop) => loop.personId === person.id);
  const moves = data.nextMoves.filter((move) => move.personId === person.id);
  const deleteImpact = getPersonDeleteImpact(data, person.id);
  const activeLoops = loops.filter((loop) => loop.status !== "done" && loop.status !== "dropped");
  const activeMoves = moves.filter((move) => move.status !== "done" && move.status !== "dismissed");
  const alibi = dailyAlibis[stableIndex(person.id, dailyAlibis.length)];

  useEffect(() => {
    setBriefResult(null);
    setBriefOpen(false);
    setDeleteOpen(false);
    setMoveDraft("");
    setMoveObjective("");
    setGeneratedMoves([]);
    setGeneratedMoveNote("");
    setActionMessage("");
    setPosterLabOpen(false);
  }, [person.id, resetSignal]);

  async function submitNote(event: FormEvent) {
    event.preventDefault();
    const trimmed = note.trim();
    if (!trimmed || noteSaving) return;

    setNoteSaving(true);
    setActionMessage("Saving the fresh intel. The text stays put until the file is safe.");

    try {
      await onAddNote({
        personIds: [person.id],
        occurredAt: today(),
        sourceType: "manual",
        rawText: trimmed,
        sensitivity: person.sensitivity
      });
      setNote("");
      setActionMessage("Fresh intel saved. If it wants to become lore, the review panel will ask nicely first.");
    } catch {
      setActionMessage("Save failed. Your draft is still here, refusing to disappear like a responsible little note.");
    } finally {
      setNoteSaving(false);
    }
  }

  function submitMove(event: FormEvent) {
    event.preventDefault();
    if (!moveDraft.trim()) return;
    onAddNextMove({
      personId: person.id,
      type: "check_in",
      draft: moveDraft.trim(),
      rationale: "Manually added from the dossier.",
      risk: person.sensitivity === "private" ? "medium" : "low"
    });
    setMoveDraft("");
    setActionMessage("Manual move added to the Plot Board. A small scheme has paperwork now.");
  }

  async function openBrief() {
    if (briefLoading) return;
    if (briefOpen) {
      setBriefOpen(false);
      return;
    }

    setBriefOpen(true);
    await refreshBrief();
  }

  async function refreshBrief() {
    if (briefLoading) return;
    setBriefLoading(true);
    setActionMessage("Pulling together the pre-meeting dossier. No memory changes are happening.");

    try {
      setBriefResult(await generateBriefViaHttp(data, person));
      setActionMessage("Brief refreshed. Still just advice, not official lore.");
    } catch {
      setActionMessage("Brief failed. Nothing changed; the old dossier stayed where it was.");
    } finally {
      setBriefLoading(false);
    }
  }

  async function generateMoves() {
    if (movesLoading) return;
    setMovesLoading(true);
    setGeneratedMoveNote("Cooking careful drafts. Nothing gets added until you press Add.");

    try {
      const result = await generateNextMovesViaHttp(
        data,
        person,
        moveObjective.trim() || "choose a thoughtful next contact"
      );
      setGeneratedMoves(result.moves.moves);
      setGeneratedMoveNote(
        result.source === "deterministic_fallback"
          ? "The fancy draft machine stumbled, so the safe local version wrote these instead."
          : result.moves.sensitivityWarning ?? "Drafts only. Do not outsource your personality."
      );
    } catch {
      setGeneratedMoveNote("Move generation failed. Nothing was added to the Plot Board.");
    } finally {
      setMovesLoading(false);
    }
  }

  function addGeneratedMove(move: GeneratedNextMove, index: number) {
    if (!move.draft.trim()) return;
    onAddNextMove({
      personId: person.id,
      type: move.type,
      draft: move.draft.trim(),
      rationale: move.rationale,
      risk: move.risk
    });
    setGeneratedMoves((current) => current.filter((_move, moveIndex) => moveIndex !== index));
    setGeneratedMoveNote("Added to the Plot Board. The scheme has paperwork now.");
    setActionMessage("Draft added to the Plot Board. Still editable, still your fault.");
  }

  function editGeneratedMove(index: number, draft: string) {
    setGeneratedMoves((current) =>
      current.map((move, moveIndex) => (moveIndex === index ? { ...move, draft } : move))
    );
  }

  return (
    <aside
      className={isMobileDrawerOpen ? "person-rail mobile-drawer-open" : "person-rail"}
      role={isMobileDrawerOpen ? "dialog" : undefined}
      aria-modal={isMobileDrawerOpen ? "true" : undefined}
      aria-label={isMobileDrawerOpen ? `${person.name} person file` : undefined}
    >
      <button className="mobile-rail-close" type="button" onClick={onClose} title="Close person file">
        <X size={16} />
        Close file
      </button>
      <header>
        <Avatar person={person} />
        <div>
          <h2>{person.name}</h2>
          <span>{person.city ?? "No city"} · {person.relationshipTypes.map(label).join(", ")}</span>
        </div>
      </header>

      <div className="rail-stats">
        <span>
          <small>Vibe</small>
          <WarmthChip warmth={person.warmth} />
        </span>
        <span>
          <small>Trust</small>
          <ImportanceDots value={person.trust} />
        </span>
        <span>
          <small>Privacy Alibi</small>
          <SensitivityBadge sensitivity={person.sensitivity} />
        </span>
      </div>

      {person.contactMethods.length > 0 && (
        <section className="rail-section contact-strip">
          <h3>Ways To Appear Normal</h3>
          <div className="contact-link-grid">
            {person.contactMethods.map((method) => {
              const href = contactHref(method.value);
              return href ? (
                <a key={`${method.type}-${method.value}`} href={href} target="_blank" rel="noreferrer">
                  <ExternalLink size={13} />
                  <span>{contactLabel(method.type)}</span>
                </a>
              ) : (
                <span key={`${method.type}-${method.value}`} className="contact-chip">
                  {contactLabel(method.type)}: {method.value}
                </span>
              );
            })}
          </div>
          <small className="review-source">User-entered only. No scraping, no syncing, no creepy robot errands.</small>
        </section>
      )}

      <section className="rail-section person-snapshot">
        <h3>Current Situation</h3>
        <div className="snapshot-grid">
          <span>
            <strong>{person.lastContactAt ? `${daysBetween(person.lastContactAt)}d` : "Never"}</strong>
            <small>Last contact</small>
          </span>
          <span>
            <strong>{loops.filter((loop) => loop.status !== "done").length}</strong>
            <small>Unfinished business</small>
          </span>
          <span>
            <strong>{memories.length}</strong>
            <small>Things remembered</small>
          </span>
        </div>
      </section>

      <section className="rail-section alibi-bulletin">
        <span className="bulletin-kicker">Normal Human Bulletin</span>
        <h3>Daily Alibi</h3>
        <p>{alibi}</p>
        <span className="classified-stamp">LOCAL ONLY</span>
      </section>

      <div className="rail-actions">
        <button type="button" onClick={() => void openBrief()} disabled={briefLoading}>
          <Brain size={15} />
          {briefLoading ? "Snooping..." : "Brief Me"}
        </button>
        <button type="button" onClick={() => setPosterLabOpen(true)}>
          <Sparkles size={15} />
          Fake Dossier Art
        </button>
        <button className="danger-link" type="button" onClick={() => setDeleteOpen((open) => !open)}>
          <Trash2 size={15} />
          Erase File
        </button>
      </div>

      {deleteOpen && (
        <section className="delete-panel">
          <h3>Erase File Consequences</h3>
          <p>
            Erasing {deleteImpact.personName} removes their person file and related private context. Shared notes and
            interactions are detached, not vaporized.
          </p>
          <ul>
            <li>{deleteImpact.notesRemoved} solo notes removed</li>
            <li>{deleteImpact.sharedNotesDetached} shared notes detached</li>
            <li>{deleteImpact.memoriesRemoved} memories removed</li>
            <li>{deleteImpact.openLoopsRemoved} open loops removed</li>
            <li>{deleteImpact.nextMovesRemoved} next moves removed</li>
            <li>{deleteImpact.interactionsRemoved} solo interactions removed</li>
            <li>{deleteImpact.sharedInteractionsDetached} shared interactions detached</li>
          </ul>
          <div className="delete-actions">
            <button type="button" onClick={() => setDeleteOpen(false)}>
              Cancel
            </button>
            <button className="danger-button" type="button" onClick={() => onDelete(person.id)}>
              <Trash2 size={15} />
              Erase Person File
            </button>
          </div>
        </section>
      )}

      {briefOpen && (
        <section className="brief-panel">
          <div className="brief-head">
            <h3>Pre-Meeting Intel</h3>
            <div className="card-actions">
              <button type="button" onClick={() => void refreshBrief()}>
                {briefLoading ? "Snooping..." : "Re-snoop"}
              </button>
              <button
                type="button"
                onClick={() => briefResult && void copyWithFeedback(formatBriefForCopy(briefResult), setActionMessage)}
                disabled={!briefResult}
              >
                Copy
              </button>
            </div>
          </div>
          {!briefResult && (
            <div className="empty-state small">
              {briefLoading ? "Assembling the social dossier." : "No brief open. Hit the button if you enjoy preparation."}
            </div>
          )}
          {briefResult && (
            <>
              <p className="review-source">
                {briefResult.source === "validated_http"
                  ? "Checked by the local AI desk. You still decide what matters."
                  : briefResult.source === "validated_provider"
                    ? "Checked by the private draft desk. Nothing permanent changed."
                    : "The fancy draft machine stumbled, so the safe local version made this brief."}
              </p>
              {briefResult.brief.sensitivityWarning && (
                <p className="sensitive-warning">{briefResult.brief.sensitivityWarning}</p>
              )}
              <BriefSection title="Snapshot" items={[briefResult.brief.snapshot]} />
              <BriefSection title="Remember" items={briefResult.brief.remember} />
              <BriefSection title="Open Loops" items={briefResult.brief.openLoops} />
              <BriefSection title="Avoid" items={briefResult.brief.avoid} />
              <BriefSection title="Good Next Move" items={[briefResult.brief.goodNextMove]} />
            </>
          )}
        </section>
      )}

      <section className="rail-section">
        <h3>Official Story</h3>
        <textarea
          value={person.summary ?? ""}
          onChange={(event) => onPatch({ ...person, summary: event.target.value, updatedAt: new Date().toISOString() })}
          placeholder="The version of events you are willing to stand behind"
        />
      </section>

      <section className="rail-section">
        <h3>Add a note</h3>
        <form className="mini-form stacked" onSubmit={submitNote}>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            disabled={noteSaving}
            placeholder="What happened? Be specific. Weird is useful."
          />
          <button className="primary-button" type="submit" disabled={!note.trim() || noteSaving}>
            <Brain size={15} />
            {noteSaving ? "Saving..." : "Save note"}
          </button>
        </form>
        {actionMessage && <p className="action-feedback" aria-live="polite">{actionMessage}</p>}
      </section>

      <details className="rail-disclosure">
        <summary>Open the full relationship file</summary>
        <div className="rail-disclosure-content">
          <section className="rail-section receipt-panel">
            <div className="receipt-head">
              <h3>Social Debt Receipt</h3>
              <span>PAY WITH ATTENTION</span>
            </div>
            <dl>
              <div>
                <dt>Unfinished business</dt>
                <dd>{activeLoops.length}</dd>
              </div>
              <div>
                <dt>Moves on desk</dt>
                <dd>{activeMoves.length}</dd>
              </div>
              <div>
                <dt>Last seen</dt>
                <dd>{person.lastContactAt ? `${daysBetween(person.lastContactAt)}d ago` : "Unknown"}</dd>
              </div>
            </dl>
          </section>

      <section className="rail-section">
        <h3>Things You Swore You'd Remember</h3>
        {memories.slice(0, 5).map((memory) => (
          <article key={memory.id} className="memory-item">
            <p>{memory.text}</p>
            <small>Receipt: {sourceNoteLabel(data, memory.sourceNoteId)}</small>
            <SensitivityBadge sensitivity={memory.sensitivity} />
          </article>
        ))}
        {memories.length === 0 && (
          <div className="empty-state small classified-empty">
            <span className="classified-kicker">Archive Notice</span>
            <strong>CLASSIFIED: No Memories Filed</strong>
            <p>The archive is innocent, for now.</p>
            <span className="classified-stamp">NO LORE</span>
          </div>
        )}
      </section>

      <section className="rail-section">
        <h3>Unfinished Business</h3>
        {loops.map((loop) => (
          <article key={loop.id} className="loop-item">
            <strong>{loop.title}</strong>
            <span>{loop.dueAt ?? "No date. Very convenient."}</span>
            {loop.sourceNoteId && <small>Receipt: {sourceNoteLabel(data, loop.sourceNoteId)}</small>}
            <SensitivityBadge sensitivity={loop.sensitivity} />
            <select value={loop.status} onChange={(event) => onUpdateLoop(loop.id, event.target.value as OpenLoop["status"])}>
              {["open", "planned", "done", "dropped"].map((status) => (
                <option key={status} value={status}>
                  {label(status)}
                </option>
              ))}
            </select>
          </article>
        ))}
        {loops.length === 0 && (
          <div className="empty-state small classified-empty">
            <span className="classified-kicker">Public Notice</span>
            <strong>No Unfinished Business</strong>
            <p>Suspiciously clean. Somebody notify the auditors.</p>
            <span className="classified-stamp">TOO CLEAN</span>
          </div>
        )}
      </section>

      <section className="rail-section">
        <h3>Tiny Social Maneuvers</h3>
        {moves.slice(0, 4).map((move) => (
          <article key={move.id} className={`next-move risk-${move.risk}`}>
            <p>{move.draft}</p>
            <small>{label(move.status)} · {label(move.risk)} risk</small>
          </article>
        ))}
        <form className="mini-form" onSubmit={submitMove}>
          <input value={moveDraft} onChange={(event) => setMoveDraft(event.target.value)} placeholder="What's the move?" />
          <button type="submit" title="Add next move">
            <Plus size={15} />
          </button>
        </form>
        <div className="move-generator">
          <input
            value={moveObjective}
            onChange={(event) => setMoveObjective(event.target.value)}
            placeholder="What are we trying to pull off?"
          />
          <button type="button" onClick={() => void generateMoves()} disabled={movesLoading}>
            <Brain size={15} />
            {movesLoading ? "Cooking..." : "Cook Something Up"}
          </button>
        </div>
        {generatedMoveNote && <small className="review-source">{generatedMoveNote}</small>}
        {generatedMoves.map((move, index) => (
          <article key={`${move.type}-${index}`} className={`next-move generated risk-${move.risk}`}>
            <textarea
              className="generated-move-draft"
              value={move.draft}
              onChange={(event) => editGeneratedMove(index, event.target.value)}
              aria-label={`Edit generated move ${index + 1}`}
            />
            <small>
              {label(move.type)} · {label(move.risk)} risk · {move.riskReason}
            </small>
            <small>Alibi: {move.rationale}</small>
            <div className="card-actions">
              <button type="button" onClick={() => void copyWithFeedback(move.draft, setActionMessage)}>
                Copy
              </button>
              <button type="button" onClick={() => addGeneratedMove(move, index)} disabled={!move.draft.trim()}>
                Add
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="rail-section timeline compact">
        <h3>Paper Trail</h3>
        {personNotes.slice(0, 5).map((item) => (
          <article key={item.id} className="timeline-item">
            <div className="note-head">
              <span>{item.occurredAt}</span>
              <button
                className="icon-button danger-icon"
                type="button"
                title="Delete note and source-backed records"
                onClick={() => {
                  if (window.confirm("Delete this note and any memories or open loops sourced from it?")) {
                    onDeleteNote(item.id);
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p>{item.rawText}</p>
            <SensitivityBadge sensitivity={item.sensitivity} />
          </article>
        ))}
        {personNotes.length === 0 && (
          <div className="empty-state small classified-empty">
            <span className="classified-kicker">Evidence Desk</span>
            <strong>No Notes Entered</strong>
            <p>Nothing has been entered into evidence.</p>
            <span className="classified-stamp">OPEN FILE</span>
          </div>
        )}
      </section>
        </div>
      </details>

      {posterLabOpen && <DossierPosterLab data={data} person={person} onClose={() => setPosterLabOpen(false)} />}
    </aside>
  );
}

function BriefSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <strong>{title}</strong>
      {items.length ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>None.</p>
      )}
    </div>
  );
}

function WarmthChip({ warmth }: { warmth: Warmth }) {
  return <span className={`warmth warmth-${warmth}`}>{label(warmth)}</span>;
}

function ImportanceDots({ value }: { value: number }) {
  return (
    <span className="dots" aria-label={`${value} of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < value ? "filled" : ""} />
      ))}
    </span>
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

function contactLabel(value: string) {
  if (value === "x" || value === "twitter") return "X / Twitter";
  return label(value);
}

function contactHref(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }
  if (value.includes("@") && !value.startsWith("@")) return `mailto:${value}`;
  return undefined;
}

function sourceNoteLabel(data: CrmData, noteId: string) {
  const note = data.notes.find((candidate) => candidate.id === noteId);
  return note ? `${note.occurredAt} ${label(note.sourceType)}` : "missing note";
}

function formatBriefForCopy(result: BriefForReview) {
  const brief = result.brief;
  return [
    "# Pre-Meeting Brief",
    "",
    `Trust note: ${briefSourceForCopy(result)}`,
    brief.sensitivityWarning ? `Warning: ${brief.sensitivityWarning}` : undefined,
    "",
    "## Snapshot",
    brief.snapshot,
    "",
    "## Remember",
    listForCopy(brief.remember),
    "",
    "## Open Loops",
    listForCopy(brief.openLoops),
    "",
    "## Avoid",
    listForCopy(brief.avoid),
    "",
    "## Good Next Move",
    brief.goodNextMove
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n");
}

function listForCopy(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "None.";
}

function briefSourceForCopy(result: BriefForReview) {
  if (result.source === "validated_http") return "Checked by the local AI desk; review before using.";
  if (result.source === "validated_provider") return "Checked by the private draft desk; review before using.";
  return "Made with the safe local fallback after the draft check stumbled.";
}

function stableIndex(value: string, size: number) {
  return Array.from(value).reduce((sum, character) => sum + character.charCodeAt(0), 0) % size;
}

async function copyWithFeedback(text: string, setMessage: (message: string) => void) {
  if (!text.trim()) {
    setMessage("Nothing to copy. The clipboard remains unbothered.");
    return;
  }

  if (!navigator.clipboard) {
    setMessage("Copy failed. This browser is hiding the clipboard.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setMessage("Copied. The clipboard has joined the conspiracy.");
  } catch {
    setMessage("Copy failed. The clipboard refused to testify.");
  }
}
