import {
  Archive,
  Brain,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  Plus,
  Radar,
  Search,
  Shield,
  UsersRound
} from "lucide-react";
import { FormEvent, type RefObject, type SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "./components/Avatar";
import { HostedSyncPanel } from "./components/HostedSyncPanel";
import { PersonRail } from "./components/PersonRail";
import { PlotBoard } from "./components/PlotBoard";
import { ReflectionLog } from "./components/ReflectionLog";
import { ReviewPanel, type PendingReview as ReviewPanelState } from "./components/ReviewPanel";
import { SettingsView } from "./components/SettingsView";
import { extractMemorySuggestionsViaHttp } from "./lib/browserAiClient";
import {
  addNextMoveRecord,
  addPersonRecord,
  addRelationshipNote,
  deletePersonRecord,
  deleteRelationshipNote,
  saveAcceptedSuggestions as saveAcceptedSuggestionsToData,
  updateLoopStatus,
  updateNextMoveStatus,
  upsertPersonRecord
} from "./lib/crm";
import { daysBetween, personName, radar } from "./lib/insights";
import { loadData, makeId, newPerson, resetData, saveData } from "./lib/storage";
import type {
  CrmData,
  ContactMethod,
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
const ratingOptions = [1, 2, 3, 4, 5] as const;
const contactTypes: Array<{ type: ContactMethod["type"]; label: string; placeholder: string }> = [
  { type: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
  { type: "instagram", label: "Instagram", placeholder: "@handle or URL" },
  { type: "x", label: "X / Twitter", placeholder: "@handle or URL" },
  { type: "website", label: "Website", placeholder: "https://..." },
  { type: "email", label: "Email", placeholder: "name@example.com" },
  { type: "phone", label: "Phone", placeholder: "Phone number" },
  { type: "signal", label: "Signal", placeholder: "Signal name/number" },
  { type: "whatsapp", label: "WhatsApp", placeholder: "WhatsApp name/number" },
  { type: "other", label: "Other contact", placeholder: "Anything user-entered" }
];
const maxProfilePhotoBytes = 350_000;

const navItems = [
  { id: "people" as const, label: "The People", icon: UsersRound },
  { id: "radar" as const, label: "The Radar", icon: Radar },
  { id: "plot" as const, label: "Plot Board", icon: LayoutDashboard },
  { id: "reflection" as const, label: "Debrief Booth", icon: ClipboardList },
  { id: "settings" as const, label: "Evidence Locker", icon: Archive }
];

const brandTaglines = [
  "Private friend intel",
  "Definitely not weird",
  "Social debt department",
  "Feelings, filed badly",
  "Classified-ish"
];

const viewLabels: Record<View, string> = {
  people: "people files",
  radar: "attention radar",
  plot: "soft schemes",
  reflection: "debrief booth",
  settings: "evidence locker"
};

type PendingReview = ReviewPanelState & {
  note: RelationshipNote;
};

function App() {
  const [data, setData] = useState<CrmData>(() => loadData());
  const [view, setView] = useState<View>("people");
  const [selectedPersonId, setSelectedPersonId] = useState(data.people[0]?.id ?? "");
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [railResetSignal, setRailResetSignal] = useState(0);
  const [pendingReview, setPendingReview] = useState<PendingReview | null>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [reflectionFocusSignal, setReflectionFocusSignal] = useState(0);
  const quickAddRef = useRef<HTMLInputElement>(null);

  const selectedPerson = data.people.find((person) => person.id === selectedPersonId) ?? data.people[0];
  const shouldShowPersonRail = selectedPerson && view !== "settings";
  const isMobileRailActive = Boolean(isMobileViewport && mobileRailOpen && shouldShowPersonRail);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (!selectedPersonId && data.people[0]) {
      setSelectedPersonId(data.people[0].id);
    }
  }, [data.people, selectedPersonId]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 840px)");
    const updateViewport = () => setIsMobileViewport(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const shouldLock = isMobileViewport && mobileRailOpen && selectedPerson && view !== "settings";
    document.body.classList.toggle("drawer-scroll-locked", Boolean(shouldLock));
    return () => document.body.classList.remove("drawer-scroll-locked");
  }, [isMobileViewport, mobileRailOpen, selectedPerson, view]);

  useEffect(() => {
    if (!isMobileRailActive) return;

    function closeMobileRailOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMobileRailOpen(false);
    }

    document.addEventListener("keydown", closeMobileRailOnEscape, true);
    return () => document.removeEventListener("keydown", closeMobileRailOnEscape, true);
  }, [isMobileRailActive]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileViewport && mobileRailOpen) {
        event.preventDefault();
        setMobileRailOpen(false);
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey || isEditableTarget(event.target)) return;

      const shortcutViews: Record<string, View> = {
        "1": "people",
        "2": "radar",
        "3": "plot",
        "4": "reflection",
        "5": "settings"
      };

      if (shortcutViews[event.key]) {
        event.preventDefault();
        changeView(shortcutViews[event.key]);
        setMobileRailOpen(false);
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        changeView("people");
        setMobileRailOpen(false);
        window.setTimeout(() => quickAddRef.current?.focus(), 0);
        return;
      }

      if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        changeView("reflection");
        setMobileRailOpen(false);
        setReflectionFocusSignal((current) => current + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileViewport, mobileRailOpen, view]);

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
    setMobileRailOpen(true);
    setView("people");
  }

  function deletePerson(personId: string) {
    patchData((current) => deletePersonRecord(current, personId));
    setSelectedPersonId(data.people.find((person) => person.id !== personId)?.id ?? "");
    setMobileRailOpen(false);
  }

  function deleteNote(noteId: string) {
    patchData((current) => deleteRelationshipNote(current, noteId));
  }

  async function addNote(note: Omit<RelationshipNote, "id" | "createdAt">) {
    const created: RelationshipNote = {
      ...note,
      id: makeId("n"),
      createdAt: new Date().toISOString()
    };
    patchData((current) => addRelationshipNote(current, created));
    const extraction = await extractMemorySuggestionsViaHttp(created, data.people);
    setPendingReview({
      note: created,
      suggestions: extraction.suggestions,
      acceptedIds: extraction.suggestions.map((suggestion) => suggestion.id),
      source: extraction.source,
      errors: extraction.errors
    });
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

  function editPendingSuggestion(id: string, patch: Partial<ExtractionSuggestion>) {
    setPendingReview((current) =>
      current
        ? {
            ...current,
            suggestions: current.suggestions.map((suggestion) =>
              suggestion.id === id ? { ...suggestion, ...patch } : suggestion
            )
          }
        : current
    );
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
    if (
      !window.confirm(
        "Restore the built-in fake sample dataset? This replaces the current local browser data. Export first if anything here matters."
      )
    ) {
      return;
    }
    const seeded = resetData();
    setData(seeded);
    setSelectedPersonId(seeded.people[0]?.id ?? "");
    setMobileRailOpen(false);
    changeView("people");
  }

  function importData(nextData: CrmData) {
    setData(nextData);
    setSelectedPersonId(nextData.people[0]?.id ?? "");
    setMobileRailOpen(false);
    changeView("settings");
  }

  function selectPerson(personId: string, openRail = true) {
    setSelectedPersonId(personId);
    setMobileRailOpen(openRail);
  }

  function changeView(nextView: View) {
    if (nextView !== view) {
      setRailResetSignal((current) => current + 1);
    }
    setView(nextView);
    setMobileRailOpen(false);
  }

  return (
    <div className={`app-shell view-${view}`}>
      <AppChrome data={data} view={view} />
      <aside className="sidebar">
        <div className="brand">
          <button
            className="brand-mark"
            type="button"
            aria-label="Cycle classified tagline"
            onClick={() => setTaglineIndex((current) => (current + 1) % brandTaglines.length)}
          >
            <img src="/brand-logo.png" alt="Friend CRM logo" />
          </button>
          <div>
            <strong>Friend CRM</strong>
            <span>{brandTaglines[taglineIndex]}</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "nav-item active" : "nav-item"}
                onClick={() => changeView(item.id)}
                type="button"
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <QuickAddPerson inputRef={quickAddRef} onAdd={addPerson} />
      </aside>

      <main className="workspace">
        {view === "people" && (
          <PeopleView
            data={data}
            selectedPersonId={selectedPerson?.id}
            onSelect={(personId) => selectPerson(personId)}
            onPatch={upsertPerson}
          />
        )}
        {view === "radar" && (
          <RadarView
            data={data}
            onSelect={(personId) => {
              selectPerson(personId);
              changeView("people");
            }}
          />
        )}
        {view === "plot" && <PlotBoard data={data} onSelect={(personId) => selectPerson(personId)} onUpdateMove={updateMove} />}
        {view === "reflection" && (
          <ReflectionLog
            data={data}
            focusSignal={reflectionFocusSignal}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />
        )}
        {view === "settings" && (
          <SettingsView
            data={data}
            onReset={clearAndSeed}
            onImport={importData}
            hostedSyncPanel={<HostedSyncPanel data={data} onReplaceLocalData={importData} />}
          />
        )}
      </main>

      {isMobileRailActive && (
        <button
          className="person-rail-backdrop"
          type="button"
          aria-label="Close person file"
          onClick={() => setMobileRailOpen(false)}
        />
      )}

      {shouldShowPersonRail && (
        <PersonRail
          data={data}
          person={selectedPerson}
          onPatch={upsertPerson}
          onDelete={deletePerson}
          onDeleteNote={deleteNote}
          onAddNote={addNote}
          onUpdateLoop={updateLoop}
          onAddNextMove={addNextMove}
          isMobileDrawerOpen={isMobileRailActive}
          resetSignal={railResetSignal}
          onClose={() => setMobileRailOpen(false)}
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
          onAcceptAll={() =>
            setPendingReview((current) =>
              current ? { ...current, acceptedIds: current.suggestions.map((suggestion) => suggestion.id) } : current
            )
          }
          onRejectAll={() => setPendingReview((current) => (current ? { ...current, acceptedIds: [] } : current))}
          onDismiss={() => setPendingReview(null)}
          onEdit={editPendingSuggestion}
          onSave={saveAcceptedSuggestions}
        />
      )}
      <CursorTrail />
    </div>
  );
}

function QuickAddPerson({ inputRef, onAdd }: { inputRef: RefObject<HTMLInputElement>; onAdd: (name: string) => void }) {
  const [name, setName] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  }

  return (
    <form className="quick-add" onSubmit={submit}>
      <input ref={inputRef} value={name} onChange={(event) => setName(event.target.value)} placeholder="Add a suspect" />
      <button type="submit" title="Add suspect">
        <Plus size={16} />
      </button>
    </form>
  );
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
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
      return matchesQuery && matchesType && (!needsAction || needsAttention(data, person));
    });
  }, [data, needsAction, query, type]);

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>The People</h1>
          <p>
            {data.people.length} people, {data.openLoops.filter((loop) => loop.status !== "done").length} unresolved
            social debts.
          </p>
        </div>
        <div className="filters">
          <label className="search-field">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the social files" />
          </label>
          <select value={type} onChange={(event) => setType(event.target.value as "all" | RelationshipType)}>
            <option value="all">All flavors</option>
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
            Needs a little attention
          </label>
        </div>
      </header>

      <div className="people-table">
        <div className="table-head">
          <span>Person of Interest</span>
          <span>Vibe</span>
          <span>Do Not Fumble</span>
          <span>Last Seen</span>
          <span>Why Now</span>
        </div>
        {filtered.map((person) => {
          const signal = whyNowSignal(data, person);
          return (
            <button
              key={person.id}
              className={person.id === selectedPersonId ? "person-row selected" : "person-row"}
              type="button"
              onClick={() => onSelect(person.id)}
            >
              <span>
                <span className="person-name-cell">
                  <Avatar person={person} size="small" />
                  <span>
                    <strong>{person.name}</strong>
                    <small>{person.city ?? "No city"} · {person.relationshipTypes.map(label).join(", ")}</small>
                  </span>
                </span>
              </span>
              <span className="person-card-field" data-label="Vibe">
                <span className="mobile-field-label">Vibe</span>
                <WarmthChip warmth={person.warmth} />
              </span>
              <span className="person-card-field" data-label="Do Not Fumble">
                <span className="mobile-field-label">Do Not Fumble</span>
                <ImportanceDots value={person.importance} />
              </span>
              <span className="person-card-field" data-label="Last Seen">
                <span className="mobile-field-label">Last Seen</span>
                {person.lastContactAt ? `${daysBetween(person.lastContactAt)}d ago` : "Never"}
              </span>
              <span className="person-card-field" data-label="Why Now">
                <span className="mobile-field-label">Why Now</span>
                <span className={`why-now ${signal.tone}`}>{signal.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <ClassifiedEmptyState
          title={data.people.length === 0 ? "WANTED: First Person Of Interest" : "PUBLIC NOTICE: Nobody Matches"}
          copy={
            data.people.length === 0
              ? "Add one friend, collaborator, mentor, or suspiciously memorable human to begin the dossier."
              : "Either they are hiding or your filters are doing community theater."
          }
          stamp={data.people.length === 0 ? "OPEN A FILE" : "CHECK ALIBI"}
        />
      )}

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
  const latestPersonRef = useRef<Person | undefined>(person);
  const [isCompactEditor, setIsCompactEditor] = useState(false);
  const [openEditorSections, setOpenEditorSections] = useState({
    basics: true,
    timing: false,
    photo: false,
    labels: false,
    contacts: false,
    story: false
  });

  useEffect(() => {
    latestPersonRef.current = person;
  }, [person]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 840px)");
    const update = () => setIsCompactEditor(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!person) return null;
  const currentPerson = person;

  function patchPerson(patch: Partial<Person>) {
    const latestPerson = latestPersonRef.current;
    if (!latestPerson) return;
    onPatch({ ...latestPerson, ...patch, updatedAt: new Date().toISOString() });
  }

  function toggleRelationshipType(type: RelationshipType, checked: boolean) {
    const nextTypes = checked
      ? Array.from(new Set([...currentPerson.relationshipTypes, type]))
      : currentPerson.relationshipTypes.filter((candidate) => candidate !== type);

    patchPerson({ relationshipTypes: nextTypes.length ? nextTypes : ["other"] });
  }

  function contactValue(type: ContactMethod["type"]) {
    return currentPerson.contactMethods.find((method) => method.type === type)?.value ?? "";
  }

  function patchContactMethod(type: ContactMethod["type"], value: string) {
    const trimmed = value.trim();
    const withoutType = currentPerson.contactMethods.filter((method) => method.type !== type);
    patchPerson({ contactMethods: trimmed ? [...withoutType, { type, value: trimmed }] : withoutType });
  }

  function uploadProfilePhoto(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Profile photo blocked. Images only; the dossier refuses mystery files.");
      return;
    }

    if (file.size > maxProfilePhotoBytes) {
      window.alert("Profile photo blocked. Keep it under 350KB so exports do not become luggage.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        patchPerson({ profilePhotoUrl: reader.result });
      }
    });
    reader.readAsDataURL(file);
  }

  function editorSectionProps(section: keyof typeof openEditorSections) {
    return {
      open: !isCompactEditor || openEditorSections[section],
      onToggle: (event: SyntheticEvent<HTMLDetailsElement>) => {
        if (!isCompactEditor) return;
        const isOpen = event.currentTarget.open;
        setOpenEditorSections((current) => ({ ...current, [section]: isOpen }));
      }
    };
  }

  return (
    <section className="editor-band">
      <details className="editor-section" {...editorSectionProps("basics")}>
        <summary>Identity And Privacy</summary>
        <div className="editor-field">
          <span>Name</span>
          <input value={person.name} onChange={(event) => patchPerson({ name: event.target.value })} aria-label="Name" />
        </div>
        <div className="editor-field">
          <span>City</span>
          <input value={person.city ?? ""} onChange={(event) => patchPerson({ city: event.target.value })} placeholder="City" aria-label="City" />
        </div>
        <label className="editor-field">
          <span>Vibe</span>
          <select value={person.warmth} onChange={(event) => patchPerson({ warmth: event.target.value as Warmth })} aria-label="Warmth">
            {warmthOptions.map((option) => (
              <option key={option} value={option}>
                {label(option)}
              </option>
            ))}
          </select>
        </label>
        <label className="editor-field">
          <span>Privacy</span>
          <select
            value={person.sensitivity}
            onChange={(event) => patchPerson({ sensitivity: event.target.value as Sensitivity })}
            aria-label="Sensitivity"
          >
            {sensitivityOptions.map((option) => (
              <option key={option} value={option}>
                {label(option)}
              </option>
            ))}
          </select>
        </label>
        <label className="editor-field">
          <span>Importance</span>
          <select
            value={person.importance}
            onChange={(event) => patchPerson({ importance: Number(event.target.value) as Person["importance"] })}
            aria-label="Importance"
          >
            {ratingOptions.map((option) => (
              <option key={option} value={option}>
                {option} / 5
              </option>
            ))}
          </select>
        </label>
        <label className="editor-field">
          <span>Trust</span>
          <select
            value={person.trust}
            onChange={(event) => patchPerson({ trust: Number(event.target.value) as Person["trust"] })}
            aria-label="Trust"
          >
            {ratingOptions.map((option) => (
              <option key={option} value={option}>
                {option} / 5
              </option>
            ))}
          </select>
        </label>
      </details>

      <details className="editor-section" {...editorSectionProps("timing")}>
        <summary>Timing Alibis</summary>
        <label className="editor-field">
          <span>Last seen</span>
          <input
            type="date"
            value={person.lastContactAt ?? ""}
            onChange={(event) => patchPerson({ lastContactAt: event.target.value || undefined })}
            aria-label="Last contact"
          />
        </label>
        <label className="editor-field">
          <span>Next nudge</span>
          <input
            type="date"
            value={person.nextContactAt ?? ""}
            onChange={(event) => patchPerson({ nextContactAt: event.target.value || undefined })}
            aria-label="Next contact"
          />
        </label>
      </details>

      <details className="editor-section" {...editorSectionProps("photo")}>
        <summary>Mugshot Desk</summary>
        <label className="editor-field editor-field-wide">
          <span>Profile photo</span>
          <input
            value={person.profilePhotoUrl ?? ""}
            onChange={(event) => patchPerson({ profilePhotoUrl: event.target.value || undefined })}
            placeholder="Image URL or local reference"
            aria-label="Profile photo URL"
          />
        </label>
        <div className="profile-photo-tools">
          <label className="file-import-button">
            Upload tiny mugshot
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              aria-label="Upload profile photo"
              onChange={(event) => {
                uploadProfilePhoto(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <button type="button" onClick={() => patchPerson({ profilePhotoUrl: undefined })} disabled={!person.profilePhotoUrl}>
            Remove photo
          </button>
          <small>
            Local uploads are stored as data URLs in browser data and included in JSON export. Keep it under 350KB.
          </small>
        </div>
      </details>

      <details className="editor-section editor-section-wide" {...editorSectionProps("labels")}>
        <summary>Social Labels</summary>
        <fieldset className="relationship-editor">
          <legend>Social labels</legend>
          {relationshipTypes.map((option) => (
            <label key={option} className="relationship-check">
              <input
                type="checkbox"
                checked={person.relationshipTypes.includes(option)}
                onChange={(event) => toggleRelationshipType(option, event.target.checked)}
              />
              {label(option)}
            </label>
          ))}
        </fieldset>
      </details>

      <details className="editor-section editor-section-wide" {...editorSectionProps("contacts")}>
        <summary>Socials And Contacts</summary>
        <fieldset className="contact-editor">
          <legend>Socials and contacts</legend>
          {contactTypes.map((contact) => (
            <label key={contact.type} className="editor-field">
              <span>{contact.label}</span>
              <input
                value={contactValue(contact.type)}
                onChange={(event) => patchContactMethod(contact.type, event.target.value)}
                placeholder={contact.placeholder}
                aria-label={contact.label}
              />
            </label>
          ))}
        </fieldset>
      </details>

      <details className="editor-section editor-section-wide" {...editorSectionProps("story")}>
        <summary>Official Story</summary>
        <textarea
          value={person.summary ?? ""}
          onChange={(event) => patchPerson({ summary: event.target.value })}
          placeholder="Official story"
          aria-label="Summary"
        />
      </details>
    </section>
  );
}

function needsAttention(data: CrmData, person: Person) {
  const signal = whyNowSignal(data, person);
  return signal.tone !== "quiet";
}

function whyNowSignal(data: CrmData, person: Person): { label: string; tone: "danger" | "warn" | "signal" | "private" | "quiet" } {
  const activeLoops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done" && loop.status !== "dropped");
  const overdueLoop = activeLoops.find((loop) => loop.dueAt && isPastOrToday(loop.dueAt));

  if (overdueLoop) return { label: "Debt overdue", tone: "danger" };
  if (activeLoops.length > 0) return { label: `${activeLoops.length} social debt${activeLoops.length === 1 ? "" : "s"}`, tone: "warn" };
  if (person.nextContactAt && isPastOrToday(person.nextContactAt)) return { label: "Nudge due", tone: "signal" };
  if (person.nextContactAt && isWithinDays(person.nextContactAt, 7)) return { label: "Nudge soon", tone: "signal" };
  if (person.importance >= 4 && (!person.lastContactAt || daysBetween(person.lastContactAt) >= 45)) return { label: "Going cold", tone: "warn" };
  if (person.sensitivity !== "normal") return { label: "Handle gently", tone: "private" };
  if (person.importance >= 4) return { label: "Do not fumble", tone: "signal" };
  return { label: "All quiet", tone: "quiet" };
}

function isPastOrToday(date: string) {
  return date <= todayString();
}

function isWithinDays(date: string, days: number) {
  const now = new Date(todayString());
  const then = new Date(date);
  const diff = Math.ceil((then.getTime() - now.getTime()) / 86_400_000);
  return diff >= 0 && diff <= days;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function RadarView({ data, onSelect }: { data: CrmData; onSelect: (personId: string) => void }) {
  const signal = radar(data);

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>The Radar</h1>
          <p>
            {signal.neglected.length} going cold, {signal.overdueLoops.length} social debts overdue,{" "}
            {signal.protect.length} protected files.
          </p>
        </div>
      </header>
      <div className="radar-grid">
        <SignalList title="Going Cold" icon={<Gauge size={17} />} tone="warn">
          {signal.neglected.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{person.lastContactAt ? `${daysBetween(person.lastContactAt)}d` : "Vanished"}</span>
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
        <SignalList title="Promises You Shouldn't Have Made" icon={<ClipboardList size={17} />} tone="danger">
          {signal.overdueLoops.map((loop) => (
            <button key={loop.id} className="signal-row" onClick={() => onSelect(loop.personId)} type="button">
              <strong>{loop.title}</strong>
              <span>{personName(data, loop.personId)}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Handle With Gloves" icon={<Brain size={17} />} tone="warn">
          {signal.fragile.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{label(person.warmth)}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Protected Files" icon={<Shield size={17} />} tone="green">
          {signal.protect.map((person) => (
            <button key={person.id} className="signal-row" onClick={() => onSelect(person.id)} type="button">
              <strong>{person.name}</strong>
              <span>{label(person.sensitivity)}</span>
            </button>
          ))}
        </SignalList>
        <SignalList title="Openings" icon={<Plus size={17} />} tone="blue">
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

function AppChrome({ data, view }: { data: CrmData; view: View }) {
  const activeLoops = data.openLoops.filter((loop) => loop.status !== "done" && loop.status !== "dropped").length;

  return (
    <div className="app-chrome" aria-label="Local private desk status">
      <span className="chrome-badge">FRIEND CRM</span>
      <span>USER: LOCAL_OPERATOR</span>
      <span>MODE: {viewLabels[view].toUpperCase()}</span>
      <span>NO SCRAPING DETECTED</span>
      <span className="chrome-hide-sm">{activeLoops} UNFINISHED SOCIAL RECEIPTS</span>
      <span className="chrome-marquee">TODAY'S ALIBI: ACT NORMAL, THEN WRITE IT DOWN</span>
    </div>
  );
}

function ClassifiedEmptyState({ title, copy, stamp }: { title: string; copy: string; stamp: string }) {
  return (
    <div className="empty-state classified-empty">
      <span className="classified-kicker">Classified Ad Dept.</span>
      <strong>{title}</strong>
      <p>{copy}</p>
      <span className="classified-stamp">{stamp}</span>
    </div>
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

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function CursorTrail() {
  const [points, setPoints] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextPointId = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    function handlePointerMove(event: PointerEvent) {
      nextPointId.current += 1;
      setPoints((current) => [{ id: nextPointId.current, x: event.clientX, y: event.clientY }, ...current].slice(0, 9));
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  if (points.length === 0) return null;

  return (
    <div className="cursor-trail" aria-hidden="true">
      {points.map((point, index) => (
        <span
          key={`${point.id}-${index}`}
          style={{
            left: point.x,
            top: point.y,
            opacity: Math.max(0, 1 - index * 0.11),
            transform: `translate(-50%, -50%) scale(${Math.max(0.28, 1 - index * 0.08)})`
          }}
        />
      ))}
    </div>
  );
}

export default App;
