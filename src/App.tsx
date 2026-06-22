import {
  Archive,
  Brain,
  Check,
  ClipboardList,
  Download,
  FileText,
  Gauge,
  LayoutDashboard,
  Lock,
  Plus,
  Radar,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  UsersRound,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  addNextMoveRecord,
  addPersonRecord,
  addRelationshipNote,
  deletePersonRecord,
  deleteRelationshipNote,
  getPersonDeleteImpact,
  saveAcceptedSuggestions as saveAcceptedSuggestionsToData,
  updateLoopStatus,
  updateNextMoveStatus,
  upsertPersonRecord
} from "./lib/crm";
import { buildBrief, daysBetween, extractSuggestions, personName, radar } from "./lib/insights";
import { download, exportMarkdown, loadData, makeId, newPerson, resetData, saveData, today } from "./lib/storage";
import type {
  CrmData,
  ExtractionSuggestion,
  NextMove,
  OpenLoop,
  Person,
  RelationshipNote,
  RelationshipType,
  Sensitivity,
  Warmth
} from "./types";

type View = "people" | "radar" | "plot" | "reflection" | "settings";

const relationshipTypes: RelationshipType[] = [
  "friend",
  "collaborator",
  "mentor",
  "client",
  "family",
  "romantic",
  "ex",
  "weak_tie",
  "community",
  "other"
];

const warmthOptions: Warmth[] = ["cold", "cool", "neutral", "warm", "hot"];
const sensitivityOptions: Sensitivity[] = ["normal", "sensitive", "private"];

const navItems = [
  { id: "people" as const, label: "People", icon: UsersRound },
  { id: "radar" as const, label: "Radar", icon: Radar },
  { id: "plot" as const, label: "Plot Board", icon: LayoutDashboard },
  { id: "reflection" as const, label: "Reflection Log", icon: ClipboardList },
  { id: "settings" as const, label: "Settings", icon: Archive }
];

type PendingReview = {
  note: RelationshipNote;
  suggestions: ExtractionSuggestion[];
  acceptedIds: string[];
};

function App() {
  const [data, setData] = useState<CrmData>(() => loadData());
  const [view, setView] = useState<View>("people");
  const [selectedPersonId, setSelectedPersonId] = useState(data.people[0]?.id ?? "");
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);

  const selectedPerson = data.people.find((person) => person.id === selectedPersonId) ?? data.people[0];

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (!selectedPersonId && data.people[0]) {
      setSelectedPersonId(data.people[0].id);
    }
  }, [data.people, selectedPersonId]);

  function patchData(updater: (current: CrmData) => CrmData) {
    setData((current) => updater(current));
  }

  function upsertPerson(person: Person) {
    patchData((current) => upsertPersonRecord(current, person));
  }

  function addPerson(name: string) {
    const person = newPerson(name);
    patchData((current) => addPersonRecord(current, person));
    setSelectedPersonId(person.id);
    setView("people");
  }

  function deletePerson(personId: string) {
    patchData((current) => deletePersonRecord(current, personId));
    setSelectedPersonId(data.people.find((person) => person.id !== personId)?.id ?? "");
  }

  function deleteNote(noteId: string) {
    patchData((current) => deleteRelationshipNote(current, noteId));
  }

  function addNote(note: Omit<RelationshipNote, "id" | "createdAt">) {
    const created: RelationshipNote = {
      ...note,
      id: makeId("n"),
      createdAt: new Date().toISOString()
    };
    const suggestions = extractSuggestions(created, data.people);
    patchData((current) => addRelationshipNote(current, created));
    setPendingReview({ note: created, suggestions, acceptedIds: suggestions.map((suggestion) => suggestion.id) });
  }

  function saveAcceptedSuggestions() {
    if (!pendingReview) return;
    patchData((current) =>
      saveAcceptedSuggestionsToData(
        current,
        pendingReview.suggestions,
        pendingReview.acceptedIds,
        pendingReview.note.id
      )
    );
    setPendingReview(null);
  }

  function updateLoop(loopId: string, status: OpenLoop["status"]) {
    patchData((current) => updateLoopStatus(current, loopId, status));
  }

  function updateMove(moveId: string, status: NextMove["status"]) {
    patchData((current) => updateNextMoveStatus(current, moveId, status));
  }

  function addNextMove(move: Omit<NextMove, "id" | "status">) {
    patchData((current) => addNextMoveRecord(current, { ...move, id: makeId("x"), status: "idea" }));
  }

  function clearAndSeed() {
    const seeded = resetData();
    setData(seeded);
    setSelectedPersonId(seeded.people[0]?.id ?? "");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div>
            <strong>Friend CRM</strong>
            <span>Private desk</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "nav-item active" : "nav-item"}
                onClick={() => setView(item.id)}
                type="button"
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <QuickAddPerson onAdd={addPerson} />
      </aside>

      <main className="workspace">
        {view === "people" && (
          <PeopleView
            data={data}
            selectedPersonId={selectedPerson?.id}
            onSelect={(personId) => setSelectedPersonId(personId)}
            onPatch={upsertPerson}
          />
        )}
        {view === "radar" && (
          <RadarView
            data={data}
            onSelect={(personId) => {
              setSelectedPersonId(personId);
              setView("people");
            }}
          />
        )}
        {view === "plot" && <PlotBoard data={data} onSelect={setSelectedPersonId} onUpdateMove={updateMove} />}
        {view === "reflection" && <ReflectionLog data={data} onAddNote={addNote} onDeleteNote={deleteNote} />}
        {view === "settings" && <SettingsView data={data} onReset={clearAndSeed} />}
      </main>

      {selectedPerson && (
        <PersonRail
          data={data}
          person={selectedPerson}
          onPatch={upsertPerson}
          onDelete={deletePerson}
          onDeleteNote={deleteNote}
          onAddNote={addNote}
          onUpdateLoop={updateLoop}
          onAddNextMove={addNextMove}
        />
      )}

      {pendingReview && (
        <ReviewPanel
          pendingReview={pendingReview}
          people={data.people}
          onToggle={(id) =>
            setPendingReview((current) =>
              current
                ? {
                    ...current,
                    acceptedIds: current.acceptedIds.includes(id)
                      ? current.acceptedIds.filter((acceptedId) => acceptedId !== id)
                      : [...current.acceptedIds, id]
                  }
                : current
            )
          }
          onDismiss={() => setPendingReview(null)}
          onSave={saveAcceptedSuggestions}
        />
      )}
    </div>
  );
}

function QuickAddPerson({ onAdd }: { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  }

  return (
    <form className="quick-add" onSubmit={submit}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="New person" />
      <button type="submit" title="Add person">
        <Plus size={16} />
      </button>
    </form>
  );
}

function PeopleView({
  data,
  selectedPersonId,
  onSelect,
  onPatch
}: {
  data: CrmData;
  selectedPersonId?: string;
  onSelect: (personId: string) => void;
  onPatch: (person: Person) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | RelationshipType>("all");
  const [needsAction, setNeedsAction] = useState(false);

  const filtered = useMemo(() => {
    return data.people.filter((person) => {
      const matchesQuery =
        person.name.toLowerCase().includes(query.toLowerCase()) ||
        person.city?.toLowerCase().includes(query.toLowerCase()) ||
        person.summary?.toLowerCase().includes(query.toLowerCase());
      const matchesType = type === "all" || person.relationshipTypes.includes(type);
      const hasOpenLoop = data.openLoops.some((loop) => loop.personId === person.id && loop.status !== "done");
      return matchesQuery && matchesType && (!needsAction || hasOpenLoop || Boolean(person.nextContactAt));
    });
  }, [data, needsAction, query, type]);

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>People</h1>
          <p>{data.people.length} people, {data.openLoops.filter((loop) => loop.status !== "done").length} open loops.</p>
        </div>
        <div className="filters">
          <label className="search-field">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>
          <select value={type} onChange={(event) => setType(event.target.value as "all" | RelationshipType)}>
            <option value="all">All types</option>
            {relationshipTypes.map((option) => (
              <option key={option} value={option}>
                {label(option)}
              </option>
            ))}
          </select>
          <label className="toggle">
            <input
              type="checkbox"
              checked={needsAction}
              onChange={(event) => setNeedsAction(event.target.checked)}
            />
            Action
          </label>
        </div>
      </header>

      <div className="people-table">
        <div className="table-head">
          <span>Name</span>
          <span>Warmth</span>
          <span>Importance</span>
          <span>Last contact</span>
          <span>Open loops</span>
        </div>
        {filtered.map((person) => {
          const loops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done");
          return (
            <button
              key={person.id}
              className={person.id === selectedPersonId ? "person-row selected" : "person-row"}
              type="button"
              onClick={() => onSelect(person.id)}
            >
              <span>
                <strong>{person.name}</strong>
                <small>{person.city ?? "No city"} · {person.relationshipTypes.map(label).join(", ")}</small>
              </span>
              <WarmthChip warmth={person.warmth} />
              <ImportanceDots value={person.importance} />
              <span>{person.lastContactAt ? `${daysBetween(person.lastContactAt)}d ago` : "Never"}</span>
              <span>{loops.length || "None"}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="empty-state">Add the first person.</div>}

      {selectedPersonId && (
        <InlineProfileEditor
          person={data.people.find((person) => person.id === selectedPersonId)}
          onPatch={onPatch}
        />
      )}
    </section>
  );
}

function InlineProfileEditor({ person, onPatch }: { person?: Person; onPatch: (person: Person) => void }) {
  if (!person) return null;

  return (
    <section className="editor-band">
      <input
        value={person.name}
        onChange={(event) => onPatch({ ...person, name: event.target.value, updatedAt: new Date().toISOString() })}
        aria-label="Name"
      />
      <input
        value={person.city ?? ""}
        onChange={(event) => onPatch({ ...person, city: event.target.value, updatedAt: new Date().toISOString() })}
        placeholder="City"
        aria-label="City"
      />
      <select
        value={person.warmth}
        onChange={(event) => onPatch({ ...person, warmth: event.target.value as Warmth, updatedAt: new Date().toISOString() })}
        aria-label="Warmth"
      >
        {warmthOptions.map((option) => (
          <option key={option} value={option}>
            {label(option)}
          </option>
        ))}
      </select>
      <select
        value={person.sensitivity}
        onChange={(event) =>
          onPatch({ ...person, sensitivity: event.target.value as Sensitivity, updatedAt: new Date().toISOString() })
        }
        aria-label="Sensitivity"
      >
        {sensitivityOptions.map((option) => (
          <option key={option} value={option}>
            {label(option)}
          </option>
        ))}
      </select>
      <textarea
        value={person.summary ?? ""}
        onChange={(event) => onPatch({ ...person, summary: event.target.value, updatedAt: new Date().toISOString() })}
        placeholder="Summary"
      />
    </section>
  );
}

function RadarView({ data, onSelect }: { data: CrmData; onSelect: (personId: string) => void }) {
  const signal = radar(data);

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Radar</h1>
          <p>{signal.neglected.length} neglected, {signal.overdueLoops.length} overdue, {signal.protect.length} protected.</p>
        </div>
      </header>
      <div className="radar-grid">
        <SignalList title="Neglected" icon={<Gauge size={17} />} tone="warn">
          {signal.neglected.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{person.lastContactAt ? `${daysBetween(person.lastContactAt)}d` : "No contact"}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Upcoming" icon={<Radar size={17} />} tone="blue">
          {signal.upcoming.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{person.nextContactAt}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Overdue Promises" icon={<ClipboardList size={17} />} tone="danger">
          {signal.overdueLoops.map((loop) => (
            <button key={loop.id} className="signal-row" onClick={() => onSelect(loop.personId)} type="button">
              <strong>{loop.title}</strong>
              <span>{personName(data, loop.personId)}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Fragile" icon={<Brain size={17} />} tone="warn">
          {signal.fragile.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{label(person.warmth)}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="People To Protect" icon={<Shield size={17} />} tone="green">
          {signal.protect.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{label(person.sensitivity)}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Social Opportunities" icon={<Plus size={17} />} tone="blue">
          {signal.opportunities.slice(0, 6).map((move) => (
            <button key={move.id} className="signal-row" onClick={() => onSelect(move.personId)} type="button">
              <strong>{personName(data, move.personId)}</strong>
              <span>{label(move.type)}</span>
            </button>
          ))}
        </SignalList>
      </div>
    </section>
  );
}

function SignalList({
  title,
  icon,
  tone,
  children
}: {
  title: string;
  icon: React.ReactNode;
  tone: "blue" | "danger" | "green" | "warn";
  children: React.ReactNode;
}) {
  return (
    <section className={`signal-list ${tone}`}>
      <h2>
        {icon}
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

function PlotBoard({
  data,
  onSelect,
  onUpdateMove
}: {
  data: CrmData;
  onSelect: (personId: string) => void;
  onUpdateMove: (moveId: string, status: NextMove["status"]) => void;
}) {
  const columns: NextMove["status"][] = ["idea", "queued", "done", "dismissed"];

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Plot Board</h1>
          <p>{data.nextMoves.filter((move) => move.status !== "dismissed").length} live next moves.</p>
        </div>
      </header>
      <div className="board">
        {columns.map((status) => (
          <section key={status} className="board-column">
            <h2>{label(status)}</h2>
            {data.nextMoves
              .filter((move) => move.status === status)
              .map((move) => (
                <article key={move.id} className={`move-card risk-${move.risk}`}>
                  <button className="link-button" onClick={() => onSelect(move.personId)} type="button">
                    {personName(data, move.personId)}
                  </button>
                  <p>{move.draft}</p>
                  <small>{move.rationale}</small>
                  <div className="card-actions">
                    {columns.map((option) => (
                      <button key={option} type="button" onClick={() => onUpdateMove(move.id, option)}>
                        {option === status ? <Check size={14} /> : label(option)}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
          </section>
        ))}
      </div>
    </section>
  );
}

function ReflectionLog({
  data,
  onAddNote,
  onDeleteNote
}: {
  data: CrmData;
  onAddNote: (note: Omit<RelationshipNote, "id" | "createdAt">) => void;
  onDeleteNote: (noteId: string) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(data.people[0] ? [data.people[0].id] : []);
  const [text, setText] = useState("");
  const [sourceType, setSourceType] = useState<RelationshipNote["sourceType"]>("manual");
  const [sensitivity, setSensitivity] = useState<Sensitivity>("normal");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || selectedIds.length === 0) return;
    onAddNote({
      personIds: selectedIds,
      occurredAt: today(),
      sourceType,
      rawText: text.trim(),
      sensitivity
    });
    setText("");
  }

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Reflection Log</h1>
          <p>{data.notes.length} captured notes.</p>
        </div>
      </header>

      <form className="reflection-grid" onSubmit={submit}>
        <div className="person-picker">
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
              {["manual", "call", "dinner", "meeting", "text_summary", "memory"].map((option) => (
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
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What happened? What mattered? What was promised?"
          />
          <button className="primary-button" type="submit">
            <Brain size={16} />
            Capture and Review
          </button>
        </div>
      </form>

      <section className="timeline">
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

function SettingsView({ data, onReset }: { data: CrmData; onReset: () => void }) {
  const sensitiveNotes = data.notes.filter((note) => note.sensitivity !== "normal").length;
  const sensitiveMemories = data.memories.filter((memory) => memory.sensitivity !== "normal").length;
  const privatePeople = data.people.filter((person) => person.sensitivity === "private").length;

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Settings</h1>
          <p>{data.people.length} people, {data.notes.length} notes, {data.memories.length} memories.</p>
        </div>
      </header>
      <section className="export-warning">
        <Shield size={18} />
        <div>
          <strong>Exports include private relationship data.</strong>
          <p>
            Current data includes {privatePeople} private people, {sensitiveNotes} sensitive/private notes, and{" "}
            {sensitiveMemories} sensitive/private memories. JSON and Markdown exports preserve those labels.
          </p>
        </div>
      </section>
      <div className="settings-actions">
        <button
          className="primary-button"
          type="button"
          onClick={() => download("friend-crm-export.json", JSON.stringify(data, null, 2), "application/json")}
        >
          <Download size={16} />
          JSON
        </button>
        <button className="primary-button muted" type="button" onClick={() => download("friend-crm-export.md", exportMarkdown(data))}>
          <FileText size={16} />
          Markdown
        </button>
        <button className="danger-button" type="button" onClick={onReset}>
          <RotateCcw size={16} />
          Reset Seed
        </button>
      </div>
    </section>
  );
}

function PersonRail({
  data,
  person,
  onPatch,
  onDelete,
  onDeleteNote,
  onAddNote,
  onUpdateLoop,
  onAddNextMove
}: {
  data: CrmData;
  person: Person;
  onPatch: (person: Person) => void;
  onDelete: (personId: string) => void;
  onDeleteNote: (noteId: string) => void;
  onAddNote: (note: Omit<RelationshipNote, "id" | "createdAt">) => void;
  onUpdateLoop: (loopId: string, status: OpenLoop["status"]) => void;
  onAddNextMove: (move: Omit<NextMove, "id" | "status">) => void;
}) {
  const [note, setNote] = useState("");
  const [briefOpen, setBriefOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveDraft, setMoveDraft] = useState("");
  const personNotes = data.notes.filter((candidate) => candidate.personIds.includes(person.id));
  const memories = data.memories.filter((memory) => memory.personId === person.id && memory.confirmed);
  const loops = data.openLoops.filter((loop) => loop.personId === person.id);
  const moves = data.nextMoves.filter((move) => move.personId === person.id);
  const brief = buildBrief(data, person);
  const deleteImpact = getPersonDeleteImpact(data, person.id);

  function submitNote(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) return;
    onAddNote({
      personIds: [person.id],
      occurredAt: today(),
      sourceType: "manual",
      rawText: note.trim(),
      sensitivity: person.sensitivity
    });
    setNote("");
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
  }

  return (
    <aside className="person-rail">
      <header>
        <div className="avatar">{person.name.slice(0, 1)}</div>
        <div>
          <h2>{person.name}</h2>
          <span>{person.city ?? "No city"} · {person.relationshipTypes.map(label).join(", ")}</span>
        </div>
      </header>

      <div className="rail-stats">
        <span>
          <small>Warmth</small>
          <WarmthChip warmth={person.warmth} />
        </span>
        <span>
          <small>Trust</small>
          <ImportanceDots value={person.trust} />
        </span>
        <span>
          <small>Privacy</small>
          <SensitivityBadge sensitivity={person.sensitivity} />
        </span>
      </div>

      <div className="rail-actions">
        <button type="button" onClick={() => setBriefOpen((open) => !open)}>
          <Brain size={15} />
          Brief
        </button>
        <button className="danger-link" type="button" onClick={() => setDeleteOpen((open) => !open)}>
          <Trash2 size={15} />
          Delete
        </button>
      </div>

      {deleteOpen && (
        <section className="delete-panel">
          <h3>Delete Consequences</h3>
          <p>
            Deleting {deleteImpact.personName} removes their person record and related private context. Shared notes and
            interactions are detached, not deleted.
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
              Delete Person
            </button>
          </div>
        </section>
      )}

      {briefOpen && (
        <section className="brief-panel">
          <h3>Pre-Meeting Brief</h3>
          <BriefSection title="Snapshot" items={[brief.snapshot]} />
          <BriefSection title="Remember" items={brief.remember} />
          <BriefSection title="Open Loops" items={brief.loops} />
          <BriefSection title="Avoid" items={brief.avoid} />
          <BriefSection title="Good Next Move" items={[brief.nextMove]} />
        </section>
      )}

      <section className="rail-section">
        <h3>Summary</h3>
        <textarea
          value={person.summary ?? ""}
          onChange={(event) => onPatch({ ...person, summary: event.target.value, updatedAt: new Date().toISOString() })}
          placeholder="Source-backed context"
        />
      </section>

      <section className="rail-section">
        <h3>Memories</h3>
        {memories.slice(0, 5).map((memory) => (
          <article key={memory.id} className="memory-item">
            <p>{memory.text}</p>
            <SensitivityBadge sensitivity={memory.sensitivity} />
          </article>
        ))}
        {memories.length === 0 && <div className="empty-state small">No confirmed memories.</div>}
      </section>

      <section className="rail-section">
        <h3>Open Loops</h3>
        {loops.map((loop) => (
          <article key={loop.id} className="loop-item">
            <strong>{loop.title}</strong>
            <span>{loop.dueAt ?? "No date"}</span>
            <select value={loop.status} onChange={(event) => onUpdateLoop(loop.id, event.target.value as OpenLoop["status"])}>
              {["open", "planned", "done", "dropped"].map((status) => (
                <option key={status} value={status}>
                  {label(status)}
                </option>
              ))}
            </select>
          </article>
        ))}
        {loops.length === 0 && <div className="empty-state small">No open loops.</div>}
      </section>

      <section className="rail-section">
        <h3>Next Moves</h3>
        {moves.slice(0, 4).map((move) => (
          <article key={move.id} className={`next-move risk-${move.risk}`}>
            <p>{move.draft}</p>
            <small>{label(move.status)} · {label(move.risk)} risk</small>
          </article>
        ))}
        <form className="mini-form" onSubmit={submitMove}>
          <input value={moveDraft} onChange={(event) => setMoveDraft(event.target.value)} placeholder="Next move" />
          <button type="submit" title="Add next move">
            <Plus size={15} />
          </button>
        </form>
      </section>

      <section className="rail-section">
        <h3>Capture</h3>
        <form className="mini-form stacked" onSubmit={submitNote}>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add note" />
          <button className="primary-button" type="submit">
            <Brain size={15} />
            Review
          </button>
        </form>
      </section>

      <section className="rail-section timeline compact">
        <h3>Timeline</h3>
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
      </section>
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

function ReviewPanel({
  pendingReview,
  people,
  onToggle,
  onDismiss,
  onSave
}: {
  pendingReview: PendingReview;
  people: Person[];
  onToggle: (id: string) => void;
  onDismiss: () => void;
  onSave: () => void;
}) {
  return (
    <div className="review-overlay">
      <section className="review-panel">
        <header>
          <div>
            <h2>Review Suggestions</h2>
            <p>{pendingReview.suggestions.length} source-backed items.</p>
          </div>
          <button type="button" onClick={onDismiss} title="Close">
            <X size={17} />
          </button>
        </header>
        <div className="review-list">
          {pendingReview.suggestions.length === 0 && <div className="empty-state">Nothing extracted.</div>}
          {pendingReview.suggestions.map((suggestion) => (
            <label key={suggestion.id} className="review-item">
              <input
                type="checkbox"
                checked={pendingReview.acceptedIds.includes(suggestion.id)}
                onChange={() => onToggle(suggestion.id)}
              />
              <span>
                <strong>{suggestion.kind === "memory" ? "Memory" : "Open loop"} · {personLabel(people, suggestion.personId)}</strong>
                <p>{suggestion.body}</p>
                <small>Basis: {suggestion.basis}</small>
              </span>
              <SensitivityBadge sensitivity={suggestion.sensitivity} />
            </label>
          ))}
        </div>
        <footer>
          <button type="button" onClick={onDismiss}>
            Reject
          </button>
          <button className="primary-button" type="button" onClick={onSave}>
            <Check size={16} />
            Save Accepted
          </button>
        </footer>
      </section>
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

function personLabel(people: Person[], personId: string) {
  return people.find((person) => person.id === personId)?.name ?? "Unknown";
}

export default App;
