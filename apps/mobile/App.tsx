import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { acceptSuggestion, buildBrief, daysBetween, extractSuggestions, personName } from "./src/core/insights";
import {
  clearLocalData,
  exportJson,
  importJson,
  loadData,
  makeId,
  newPerson,
  resetToDemoData,
  saveData,
  today
} from "./src/core/storage";
import type {
  CrmData,
  ExtractionSuggestion,
  Memory,
  NextMove,
  OpenLoop,
  Person,
  RelationshipNote,
  Sensitivity,
  Warmth
} from "./src/core/types";

type Tab = "people" | "dossier" | "debrief" | "plot" | "evidence";
type ReviewDraft = ExtractionSuggestion & { approved: boolean };

const tabLabels: Record<Tab, string> = {
  people: "People",
  dossier: "Dossier",
  debrief: "Debrief",
  plot: "Plot",
  evidence: "Evidence"
};

const warmthOptions: Warmth[] = ["cold", "cool", "neutral", "warm", "hot"];
const sensitivityOptions: Sensitivity[] = ["normal", "sensitive", "private"];
const moveStatuses: NextMove["status"][] = ["idea", "queued", "done", "dismissed"];
const moveRisks: NextMove["risk"][] = ["low", "medium", "high"];
const moveStatusLabels: Record<NextMove["status"], string> = {
  idea: "Bad Idea?",
  queued: "Loaded",
  done: "Handled",
  dismissed: "Never Mind"
};
const plotColumnHelp: Record<NextMove["status"], string> = {
  idea: "Raw idea. Maybe brilliant, maybe a paperwork problem for future-you.",
  queued: "Chosen next moves. These are the ones future-you is actually meant to do.",
  done: "Handled. Applause, but keep it tasteful.",
  dismissed: "Retired schemes. Sometimes restraint is the whole personality."
};

const emptyData: CrmData = {
  people: [],
  notes: [],
  memories: [],
  openLoops: [],
  nextMoves: [],
  interactions: []
};

export default function App() {
  const [data, setData] = useState<CrmData | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("people");
  const [search, setSearch] = useState("");
  const [newPersonName, setNewPersonName] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteSensitivity, setNoteSensitivity] = useState<Sensitivity>("normal");
  const [notePersonIds, setNotePersonIds] = useState<string[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<ReviewDraft[]>([]);
  const [reviewSourceNoteId, setReviewSourceNoteId] = useState<string | null>(null);
  const [importText, setImportText] = useState("");
  const [plotPersonId, setPlotPersonId] = useState<string | null>(null);
  const [plotDraft, setPlotDraft] = useState("");
  const [plotRationale, setPlotRationale] = useState("");
  const [plotRisk, setPlotRisk] = useState<NextMove["risk"]>("low");
  const [notice, setNotice] = useState("Demo bureau ready. Fake data only.");
  const noticeOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData()
      .then((loaded) => {
        const firstPersonId = loaded.people[0]?.id ?? null;
        setData(loaded);
        setSelectedPersonId(firstPersonId);
        setPlotPersonId(firstPersonId);
        setNotePersonIds(firstPersonId ? [firstPersonId] : []);
      })
      .catch(() => {
        setData(emptyData);
        setSelectedPersonId(null);
        setPlotPersonId(null);
        setNotePersonIds([]);
        setNotice("Local storage failed to load, so the bureau opened an empty desk.");
      });
  }, []);

  useEffect(() => {
    if (data) {
      void saveData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!notice) return;

    noticeOpacity.setValue(1);
    const timer = setTimeout(() => {
      Animated.timing(noticeOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start(({ finished }) => {
        if (finished) setNotice("");
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      noticeOpacity.stopAnimation();
    };
  }, [notice, noticeOpacity]);

  useEffect(() => {
    if (!data) return;
    const firstPersonId = data.people[0]?.id ?? null;

    if (selectedPersonId && !data.people.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(firstPersonId);
    }

    if (plotPersonId && !data.people.some((person) => person.id === plotPersonId)) {
      setPlotPersonId(firstPersonId);
    }

    if (!plotPersonId && firstPersonId) {
      setPlotPersonId(firstPersonId);
    }
  }, [data, plotPersonId, selectedPersonId]);

  const selectedPerson = useMemo(() => data?.people.find((person) => person.id === selectedPersonId) ?? data?.people[0], [data, selectedPersonId]);

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <Text style={styles.brandKicker}>FRIEND CRM 3000</Text>
          <Text style={styles.title}>Loading private bureau...</Text>
          <StatusBar style="light" />
        </View>
      </SafeAreaView>
    );
  }

  function updateData(updater: (current: CrmData) => CrmData) {
    setData((current) => (current ? updater(current) : current));
  }

  function choosePerson(personId: string, nextTab: Tab = "dossier") {
    setSelectedPersonId(personId);
    setPlotPersonId(personId);
    setNotePersonIds((current) => (current.length ? current : [personId]));
    setActiveTab(nextTab);
  }

  function patchSelectedPerson(patch: Partial<Person>) {
    if (!selectedPerson) return;
    updateData((current) => ({
      ...current,
      people: current.people.map((person) =>
        person.id === selectedPerson.id ? { ...person, ...patch, updatedAt: new Date().toISOString() } : person
      )
    }));
  }

  function addPerson() {
    const name = newPersonName.trim();
    if (!name) return;
    Keyboard.dismiss();
    const person = newPerson(name);
    updateData((current) => ({ ...current, people: [person, ...current.people] }));
    setNewPersonName("");
    choosePerson(person.id);
    setNotice(`${person.name} added. The bureau is trying not to act weird.`);
  }

  function openDebriefForPerson(personId: string) {
    setSelectedPersonId(personId);
    setPlotPersonId(personId);
    setNotePersonIds([personId]);
    setActiveTab("debrief");
  }

  function addManualMemory(personId: string, text: string, sensitivity: Sensitivity) {
    const trimmed = text.trim();
    if (!trimmed) {
      Alert.alert("Memory needs words", "Write the thing future-you is allowed to remember.");
      return false;
    }

    Keyboard.dismiss();
    const note: RelationshipNote = {
      id: makeId("n"),
      personIds: [personId],
      occurredAt: today(),
      sourceType: "memory",
      rawText: `Manual memory: ${trimmed}`,
      sensitivity,
      createdAt: new Date().toISOString()
    };
    const memory: Memory = {
      id: makeId("m"),
      personId,
      sourceNoteId: note.id,
      text: trimmed,
      category: "other",
      confidence: "high",
      sensitivity,
      confirmed: true
    };

    updateData((current) => ({ ...current, notes: [note, ...current.notes], memories: [memory, ...current.memories] }));
    setNotice("Memory made official. Future-you has one fewer excuse.");
    return true;
  }

  function addManualOpenLoop(personId: string, title: string, description: string, sensitivity: Sensitivity) {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle) {
      Alert.alert("Loose thread needs a title", "Name the unfinished business before filing it.");
      return false;
    }

    Keyboard.dismiss();
    const note: RelationshipNote = {
      id: makeId("n"),
      personIds: [personId],
      occurredAt: today(),
      sourceType: "memory",
      rawText: `Loose thread: ${trimmedTitle}${trimmedDescription ? ` - ${trimmedDescription}` : ""}`,
      sensitivity,
      createdAt: new Date().toISOString()
    };
    const loop: OpenLoop = {
      id: makeId("o"),
      personId,
      sourceNoteId: note.id,
      title: trimmedTitle,
      description: trimmedDescription || undefined,
      sensitivity,
      status: "open"
    };

    updateData((current) => ({ ...current, notes: [note, ...current.notes], openLoops: [loop, ...current.openLoops] }));
    setNotice("Loose thread filed. The bureau will now pretend this is under control.");
    return true;
  }

  function addManualNextMove(personId: string, draft: string, rationale: string, risk: NextMove["risk"]) {
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) {
      Alert.alert("Next move needs a move", "Write the actual thing you might do.");
      return false;
    }

    Keyboard.dismiss();
    const move: NextMove = {
      id: makeId("x"),
      personId,
      type: "check_in",
      draft: trimmedDraft,
      rationale: rationale.trim() || "Manually added from the Dossier.",
      risk,
      status: "queued"
    };

    updateData((current) => ({ ...current, nextMoves: [move, ...current.nextMoves] }));
    setNotice("Next move filed. Smooth, normal, definitely not over-managed.");
    return true;
  }

  function addPlotMove() {
    const draft = plotDraft.trim();
    const personId = plotPersonId ?? data?.people[0]?.id;
    if (!data || !personId || !draft) {
      Alert.alert("Plot Board needs a person", "Open a person file and write the move before filing the card.");
      return;
    }

    Keyboard.dismiss();
    const move: NextMove = {
      id: makeId("x"),
      personId,
      type: "check_in",
      draft,
      rationale: plotRationale.trim() || "Manually added from the mobile Plot Board.",
      risk: plotRisk,
      status: "idea"
    };

    updateData((current) => ({ ...current, nextMoves: [move, ...current.nextMoves] }));
    setPlotDraft("");
    setPlotRationale("");
    setPlotRisk("low");
    setNotice("New move card filed under Bad Idea? until future-you promotes it.");
  }

  function toggleNotePerson(personId: string) {
    setNotePersonIds((current) =>
      current.includes(personId) ? current.filter((id) => id !== personId) : [...current, personId]
    );
  }

  function captureNote() {
    if (!data) return;
    const trimmedNote = noteText.trim();
    const primaryPersonId = notePersonIds[0];
    if (!trimmedNote || !primaryPersonId) {
      Alert.alert("The bureau needs something to work with", "Pick at least one person and write a note first.");
      return;
    }

    Keyboard.dismiss();
    const note: RelationshipNote = {
      id: makeId("n"),
      personIds: notePersonIds,
      occurredAt: today(),
      sourceType: "manual",
      rawText: trimmedNote,
      sensitivity: noteSensitivity,
      createdAt: new Date().toISOString()
    };

    const suggestions = extractSuggestions(note, data.people).map((suggestion) => ({ ...suggestion, approved: true }));
    const nextData = { ...data, notes: [note, ...data.notes] };
    setData(nextData);
    void saveData(nextData);
    setSelectedPersonId(primaryPersonId);
    setPlotPersonId(primaryPersonId);
    setReviewSourceNoteId(note.id);
    setReviewDrafts(suggestions);
    setNoteText("");
    setActiveTab("dossier");
    setNotice(
      suggestions.length
        ? "Debrief saved to the person file. Review cards are waiting in Debrief when you want to make them official."
        : "Debrief saved to the person file. No official records detected, but the note is in the dossier."
    );
  }

  function updateReviewDraft(id: string, patch: Partial<ReviewDraft>) {
    setReviewDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)));
  }

  function confirmReview() {
    if (!reviewSourceNoteId) return;
    Keyboard.dismiss();
    const approved = reviewDrafts.filter((draft) => draft.approved);
    const accepted = approved.map((draft) => acceptSuggestion(draft, reviewSourceNoteId));

    updateData((current) => ({
      ...current,
      memories: [...accepted.filter((item) => "confirmed" in item), ...current.memories],
      openLoops: [...accepted.filter((item) => "status" in item), ...current.openLoops]
    }));

    setReviewDrafts([]);
    setReviewSourceNoteId(null);
    setNotice(`${approved.length} reviewed record${approved.length === 1 ? "" : "s"} made official.`);
    setActiveTab("dossier");
  }

  function updateMoveStatus(moveId: string, status: NextMove["status"]) {
    updateData((current) => ({
      ...current,
      nextMoves: current.nextMoves.map((move) => (move.id === moveId ? { ...move, status } : move))
    }));
    setNotice(`Plot Board card moved to ${moveStatusLabels[status]}.`);
  }

  async function resetDemo() {
    const fresh = await resetToDemoData();
    const firstPersonId = fresh.people[0]?.id ?? null;
    setData(fresh);
    setSelectedPersonId(firstPersonId);
    setPlotPersonId(firstPersonId);
    setNotePersonIds(firstPersonId ? [firstPersonId] : []);
    setReviewDrafts([]);
    setReviewSourceNoteId(null);
    setNotice("Fresh fake friends loaded. Zero real evidence harmed.");
  }

  async function clearData() {
    Alert.alert(
      "Clear local demo data?",
      "This removes local mobile data on this device. Evidence keeps the reset, import, and export controls.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            void clearLocalData()
              .then(() => {
                setData(emptyData);
                setSelectedPersonId(null);
                setPlotPersonId(null);
                setNotePersonIds([]);
                setReviewDrafts([]);
                setReviewSourceNoteId(null);
                setNotice("Local data cleared. The People desk is empty on purpose. Evidence has reset controls when you need them.");
              })
              .catch(() => {
                Alert.alert("Clear failed", "Local storage refused the paperwork. Try again or reinstall the build.");
              });
          }
        }
      ]
    );
  }

  async function shareExport() {
    if (!data) return;
    try {
      const result = await Share.share({ title: "Friend CRM Mobile Export", message: exportJson(data) });
      if (result.action === Share.dismissedAction) {
        setNotice("Export share sheet dismissed. No cloud backup was made.");
        return;
      }
      setNotice("Local JSON export shared or copied. Still local; still your problem, beautifully.");
    } catch {
      setNotice("Export failed. The evidence locker jammed. Nothing was deleted.");
      Alert.alert("Export failed", "Could not open the local share sheet.");
    }
  }

  function importBackup() {
    try {
      Keyboard.dismiss();
      const imported = importJson(importText);
      const firstPersonId = imported.people[0]?.id ?? null;
      setData(imported);
      setSelectedPersonId(firstPersonId);
      setPlotPersonId(firstPersonId);
      setNotePersonIds(firstPersonId ? [firstPersonId] : []);
      setImportText("");
      setNotice("Backup imported locally. Please act normal.");
    } catch (error) {
      Alert.alert("Import failed", error instanceof Error ? error.message : "Could not import that JSON.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.appShell} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brandKicker}>FRIEND CRM 3000</Text>
            <Text style={styles.brandTitle}>Private Friend Bureau</Text>
          </View>
        </View>

        <Animated.View style={[styles.notice, { opacity: noticeOpacity }]}>
          <Text style={styles.noticeText}>{notice}</Text>
        </Animated.View>

        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.screenContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
        {activeTab === "people" ? (
          <PeopleScreen
            data={data}
            search={search}
            setSearch={setSearch}
            newPersonName={newPersonName}
            setNewPersonName={setNewPersonName}
            addPerson={addPerson}
            choosePerson={choosePerson}
            clearData={clearData}
          />
        ) : null}

        {activeTab === "dossier" ? (
          selectedPerson ? (
            <DossierScreen
              data={data}
              person={selectedPerson}
              patchPerson={patchSelectedPerson}
              openDebriefForPerson={openDebriefForPerson}
              addManualMemory={addManualMemory}
              addManualOpenLoop={addManualOpenLoop}
              addManualNextMove={addManualNextMove}
            />
          ) : (
            <EmptyBureauScreen />
          )
        ) : null}

        {activeTab === "debrief" ? (
          <DebriefScreen
            data={data}
            noteText={noteText}
            setNoteText={setNoteText}
            noteSensitivity={noteSensitivity}
            setNoteSensitivity={setNoteSensitivity}
            notePersonIds={notePersonIds}
            toggleNotePerson={toggleNotePerson}
            captureNote={captureNote}
            reviewDrafts={reviewDrafts}
            updateReviewDraft={updateReviewDraft}
            confirmReview={confirmReview}
          />
        ) : null}

        {activeTab === "plot" ? (
          <PlotScreen
            data={data}
            choosePerson={choosePerson}
            updateMoveStatus={updateMoveStatus}
            plotPersonId={plotPersonId}
            setPlotPersonId={setPlotPersonId}
            plotDraft={plotDraft}
            setPlotDraft={setPlotDraft}
            plotRationale={plotRationale}
            setPlotRationale={setPlotRationale}
            plotRisk={plotRisk}
            setPlotRisk={setPlotRisk}
            addPlotMove={addPlotMove}
          />
        ) : null}

        {activeTab === "evidence" ? (
          <EvidenceScreen
            data={data}
            resetDemo={resetDemo}
            clearData={clearData}
            shareExport={shareExport}
            importText={importText}
            setImportText={setImportText}
            importBackup={importBackup}
          />
        ) : null}
        </ScrollView>

        <View style={styles.tabBar}>
          {(Object.keys(tabLabels) as Tab[]).map((tab) => (
            <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tabLabels[tab]}</Text>
            </Pressable>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PeopleScreen({
  data,
  search,
  setSearch,
  newPersonName,
  setNewPersonName,
  addPerson,
  choosePerson,
  clearData
}: {
  data: CrmData;
  search: string;
  setSearch: (value: string) => void;
  newPersonName: string;
  setNewPersonName: (value: string) => void;
  addPerson: () => void;
  choosePerson: (personId: string) => void;
  clearData: () => void;
}) {
  const filtered = data.people.filter((person) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [person.name, person.city, person.summary, person.relationshipTypes.join(" ")].join(" ").toLowerCase().includes(query);
  });
  const hasLocalData = Boolean(
    data.people.length ||
      data.notes.length ||
      data.memories.length ||
      data.openLoops.length ||
      data.nextMoves.length ||
      data.interactions.length
  );

  return (
    <View style={styles.stack}>
      <HeroTitle title="People Files" subtitle={`${data.people.length} people, ${data.openLoops.filter((loop) => loop.status !== "done").length} unfinished threads.`} />
      {hasLocalData ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clear Demo Data</Text>
          <Text style={styles.bodyText}>Want a clean desk? Clear the local demo files here. Reset, import, and export live in Evidence.</Text>
          <Pressable style={styles.dangerButton} onPress={clearData}>
            <Text style={styles.dangerButtonText}>Clear Demo Data</Text>
          </Pressable>
        </View>
      ) : null}
      <TextInput value={search} onChangeText={setSearch} placeholder="Search the social files" placeholderTextColor="#6b7280" style={styles.input} />
      <View style={styles.addRow}>
        <TextInput
          value={newPersonName}
          onChangeText={setNewPersonName}
          placeholder="Open a new file"
          placeholderTextColor="#6b7280"
          returnKeyType="done"
          onSubmitEditing={addPerson}
          style={[styles.input, styles.addInput]}
        />
        <Pressable style={styles.squareButton} onPress={addPerson}>
          <Text style={styles.squareButtonText}>+</Text>
        </Pressable>
      </View>
      <KeyboardDoneButton />
      {!data.people.length ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.cardTitle}>Empty Desk Confirmed</Text>
          <Text style={styles.bodyText}>Local data is clear. Open a new file above, or use Evidence when you want to reload the fake demo bureau.</Text>
        </View>
      ) : null}
      {data.people.length > 0 && !filtered.length ? <Empty text="No people match that search." /> : null}
      {filtered.map((person) => (
        <PersonCard key={person.id} data={data} person={person} onPress={() => choosePerson(person.id)} />
      ))}
    </View>
  );
}

function EmptyBureauScreen() {
  return (
    <View style={styles.stack}>
      <HeroTitle title="Empty Bureau" subtitle="The files are gone on purpose. The loading screen is not invited." />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>No Person Selected</Text>
        <Text style={styles.bodyText}>Local data was cleared, so there is no dossier to open. Open a person file from People Files, or use Evidence for reset and restore controls.</Text>
      </View>
    </View>
  );
}

function DossierScreen({
  data,
  person,
  patchPerson,
  openDebriefForPerson,
  addManualMemory,
  addManualOpenLoop,
  addManualNextMove
}: {
  data: CrmData;
  person: Person;
  patchPerson: (patch: Partial<Person>) => void;
  openDebriefForPerson: (personId: string) => void;
  addManualMemory: (personId: string, text: string, sensitivity: Sensitivity) => boolean;
  addManualOpenLoop: (personId: string, title: string, description: string, sensitivity: Sensitivity) => boolean;
  addManualNextMove: (personId: string, draft: string, rationale: string, risk: NextMove["risk"]) => boolean;
}) {
  const memories = data.memories.filter((memory) => memory.personId === person.id && memory.confirmed);
  const loops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done");
  const moves = data.nextMoves.filter((move) => move.personId === person.id && move.status !== "dismissed");
  const recentNotes = data.notes
    .filter((note) => note.personIds.includes(person.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const brief = buildBrief(data, person);
  const hasContext = Boolean(person.summary || memories.length || loops.length || moves.length || data.notes.some((note) => note.personIds.includes(person.id)));
  const recommendedApproach = hasContext ? brief.nextMove : "Add one note, memory, or loose thread first. The bureau refuses to freestyle a friendship strategy from thin air.";

  return (
    <View style={styles.stack}>
      <HeroTitle title={person.name} subtitle={`${person.city ?? "Unknown city"} / ${person.relationshipTypes.join(", ") || "classified"}`} />
      <View style={styles.statGrid}>
        <Stat label="Vibe" value={person.warmth} />
        <Stat label="Trust" value={`${person.trust}/5`} />
        <Stat label="Privacy" value={person.sensitivity} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Official Story</Text>
        <TextInput
          value={person.summary ?? ""}
          onChangeText={(summary) => patchPerson({ summary })}
          multiline
          placeholder="What should future-you remember?"
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.textArea]}
        />
        <TextInput
          value={person.city ?? ""}
          onChangeText={(city) => patchPerson({ city })}
          placeholder="City"
          placeholderTextColor="#6b7280"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          style={styles.input}
        />
        <KeyboardDoneButton />
        <Text style={styles.label}>Vibe</Text>
        <OptionRow options={warmthOptions} value={person.warmth} onChange={(warmth) => patchPerson({ warmth })} />
        <Text style={styles.label}>Privacy</Text>
        <OptionRow options={sensitivityOptions} value={person.sensitivity} onChange={(sensitivity) => patchPerson({ sensitivity })} />
      </View>

      {!hasContext ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.cardTitle}>New File Needs Receipts</Text>
          <Text style={styles.bodyText}>
            This person exists, but the bureau has no receipts yet. Capture a debrief or quick-add one remembered fact, loose thread, or next move below.
          </Text>
          <Pressable style={styles.secondaryButton} onPress={() => openDebriefForPerson(person.id)}>
            <Text style={styles.secondaryButtonText}>Capture Debrief</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pre-Meeting Brief</Text>
        <Text style={styles.bodyText}>{brief.snapshot}</Text>
        <Text style={styles.sectionLabel}>Remember</Text>
        {brief.remember.length ? (
          brief.remember.map((item) => <Bullet key={item} text={item} />)
        ) : (
          <ActionEmpty text="No confirmed memories yet. Add one below or capture a debrief so the file has a source." actionLabel="Capture Debrief" onAction={() => openDebriefForPerson(person.id)} />
        )}
        <Text style={styles.sectionLabel}>Loose Threads</Text>
        {brief.loops.length ? (
          brief.loops.map((item) => <Bullet key={item} text={item} />)
        ) : (
          <ActionEmpty text="No open loops. File unfinished business below if future-you owes them something." actionLabel="Add Below" />
        )}
        <Text style={styles.sectionLabel}>Recommended Approach</Text>
        <Text style={styles.bodyText}>{recommendedApproach}</Text>
      </View>

      <QuickAddRecords
        person={person}
        addManualMemory={addManualMemory}
        addManualOpenLoop={addManualOpenLoop}
        addManualNextMove={addManualNextMove}
      />

      <RecordList title="Recent Debriefs" empty="No debriefs saved yet. Capture one from the Debrief Booth." items={recentNotes.map((note) => `${note.occurredAt}: ${note.rawText}`)} />
      <RecordList title="Things Remembered" empty="No confirmed memories yet. Use Quick Add above to make one official." items={memories.map((memory) => memory.text)} />
      <RecordList title="Unfinished Business" empty="No loose threads yet. Add one above before it becomes social archaeology." items={loops.map((loop) => loop.title)} />
      <RecordList title="Next Moves" empty="No next moves yet. Plan one above or from the Plot Board." items={moves.map((move) => move.draft)} />
    </View>
  );
}

function QuickAddRecords({
  person,
  addManualMemory,
  addManualOpenLoop,
  addManualNextMove
}: {
  person: Person;
  addManualMemory: (personId: string, text: string, sensitivity: Sensitivity) => boolean;
  addManualOpenLoop: (personId: string, title: string, description: string, sensitivity: Sensitivity) => boolean;
  addManualNextMove: (personId: string, draft: string, rationale: string, risk: NextMove["risk"]) => boolean;
}) {
  const [memoryText, setMemoryText] = useState("");
  const [memorySensitivity, setMemorySensitivity] = useState<Sensitivity>(person.sensitivity);
  const [loopTitle, setLoopTitle] = useState("");
  const [loopDescription, setLoopDescription] = useState("");
  const [loopSensitivity, setLoopSensitivity] = useState<Sensitivity>(person.sensitivity);
  const [moveDraft, setMoveDraft] = useState("");
  const [moveRationale, setMoveRationale] = useState("");
  const [moveRisk, setMoveRisk] = useState<NextMove["risk"]>("low");

  useEffect(() => {
    setMemorySensitivity(person.sensitivity);
    setLoopSensitivity(person.sensitivity);
  }, [person.id, person.sensitivity]);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Quick File</Text>
      <Text style={styles.bodyText}>Add one remembered thing, loose thread, or next move. No mind-reading, no scraping, just user-entered receipts.</Text>

      <View style={styles.quickAddBox}>
        <Text style={styles.sectionLabel}>Remembered Thing</Text>
        <TextInput
          value={memoryText}
          onChangeText={setMemoryText}
          multiline
          placeholder="Example: Loves short voice notes, hates calendar ambushes."
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.textArea]}
        />
        <Text style={styles.label}>Privacy</Text>
        <OptionRow options={sensitivityOptions} value={memorySensitivity} onChange={setMemorySensitivity} />
        <KeyboardDoneButton />
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            if (addManualMemory(person.id, memoryText, memorySensitivity)) setMemoryText("");
          }}
        >
          <Text style={styles.secondaryButtonText}>Add Memory</Text>
        </Pressable>
      </View>

      <View style={styles.quickAddBox}>
        <Text style={styles.sectionLabel}>Loose Thread</Text>
        <TextInput
          value={loopTitle}
          onChangeText={setLoopTitle}
          placeholder="Example: Send article, ask about project, apologize like an adult."
          placeholderTextColor="#6b7280"
          style={styles.input}
        />
        <TextInput
          value={loopDescription}
          onChangeText={setLoopDescription}
          multiline
          placeholder="Optional details, because vague guilt is not a system."
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.textArea]}
        />
        <Text style={styles.label}>Privacy</Text>
        <OptionRow options={sensitivityOptions} value={loopSensitivity} onChange={setLoopSensitivity} />
        <KeyboardDoneButton />
        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            if (addManualOpenLoop(person.id, loopTitle, loopDescription, loopSensitivity)) {
              setLoopTitle("");
              setLoopDescription("");
            }
          }}
        >
          <Text style={styles.secondaryButtonText}>Add Loose Thread</Text>
        </Pressable>
      </View>

      <View style={styles.quickAddBox}>
        <Text style={styles.sectionLabel}>My Next Move</Text>
        <TextInput
          value={moveDraft}
          onChangeText={setMoveDraft}
          multiline
          placeholder="Example: Text Johnny a tiny check-in, not a TED Talk."
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.textArea]}
        />
        <TextInput
          value={moveRationale}
          onChangeText={setMoveRationale}
          placeholder="Why? Optional receipt for future-you."
          placeholderTextColor="#6b7280"
          style={styles.input}
        />
        <Text style={styles.label}>Fumble Risk</Text>
        <OptionRow options={moveRisks} value={moveRisk} onChange={setMoveRisk} />
        <KeyboardDoneButton />
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (addManualNextMove(person.id, moveDraft, moveRationale, moveRisk)) {
              setMoveDraft("");
              setMoveRationale("");
              setMoveRisk("low");
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Add Next Move</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DebriefScreen({
  data,
  noteText,
  setNoteText,
  noteSensitivity,
  setNoteSensitivity,
  notePersonIds,
  toggleNotePerson,
  captureNote,
  reviewDrafts,
  updateReviewDraft,
  confirmReview
}: {
  data: CrmData;
  noteText: string;
  setNoteText: (value: string) => void;
  noteSensitivity: Sensitivity;
  setNoteSensitivity: (value: Sensitivity) => void;
  notePersonIds: string[];
  toggleNotePerson: (personId: string) => void;
  captureNote: () => void;
  reviewDrafts: ReviewDraft[];
  updateReviewDraft: (id: string, patch: Partial<ReviewDraft>) => void;
  confirmReview: () => void;
}) {
  return (
    <View style={styles.stack}>
      <HeroTitle title="Debrief Booth" subtitle="Write it down before future-you starts improvising." />
      {!data.people.length ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.cardTitle}>No One To Debrief</Text>
          <Text style={styles.bodyText}>The bureau has no people yet. Add a person before capturing notes, otherwise the memo just screams into the municipal void.</Text>
        </View>
      ) : null}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Who Was Involved?</Text>
        <View style={styles.wrapRow}>
          {data.people.map((person) => (
            <Pressable
              key={person.id}
              onPress={() => toggleNotePerson(person.id)}
              style={[styles.chip, notePersonIds.includes(person.id) && styles.chipActive]}
            >
              <Text style={[styles.chipText, notePersonIds.includes(person.id) && styles.chipTextActive]}>{person.name.split(" ")[0]}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>Privacy</Text>
        <OptionRow options={sensitivityOptions} value={noteSensitivity} onChange={setNoteSensitivity} />
        <TextInput
          value={noteText}
          onChangeText={setNoteText}
          multiline
          placeholder="What happened? What mattered? What did you promise before thinking?"
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.largeTextArea]}
        />
        <KeyboardDoneButton />
        <Pressable style={styles.primaryButton} onPress={captureNote}>
          <Text style={styles.primaryButtonText}>Save Debrief</Text>
        </Pressable>
      </View>

      {reviewDrafts.length ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Review Before It Becomes Official</Text>
          <Text style={styles.bodyText}>Note saved. Nothing becomes memory or unfinished business until you approve it.</Text>
          {reviewDrafts.map((draft) => (
            <View key={draft.id} style={styles.reviewCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.sectionLabel}>{draft.kind === "memory" ? "Possible Memory" : "Possible Unfinished Business"}</Text>
                <Pressable
                  style={[styles.miniButton, draft.approved && styles.miniButtonActive]}
                  onPress={() => updateReviewDraft(draft.id, { approved: !draft.approved })}
                >
                  <Text style={[styles.miniButtonText, draft.approved && styles.miniButtonTextActive]}>{draft.approved ? "Approve" : "Reject"}</Text>
                </Pressable>
              </View>
              <TextInput
                value={draft.body}
                onChangeText={(body) => updateReviewDraft(draft.id, { body })}
                multiline
                style={[styles.input, styles.textArea]}
              />
              <Text style={styles.finePrint}>Source: {draft.basis}</Text>
            </View>
          ))}
          <Pressable style={styles.primaryButton} onPress={confirmReview}>
            <Text style={styles.primaryButtonText}>Make Approved Records Official</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.emptyPanel}>
          <Text style={styles.cardTitle}>No Review Cards Waiting</Text>
          <Text style={styles.bodyText}>Capture a note with promises, preferences, boundaries, or follow-ups. If the bureau finds nothing, use Dossier quick-add to make the important bits official.</Text>
        </View>
      )}
    </View>
  );
}

function PlotScreen({
  data,
  choosePerson,
  updateMoveStatus,
  plotPersonId,
  setPlotPersonId,
  plotDraft,
  setPlotDraft,
  plotRationale,
  setPlotRationale,
  plotRisk,
  setPlotRisk,
  addPlotMove
}: {
  data: CrmData;
  choosePerson: (personId: string, nextTab?: Tab) => void;
  updateMoveStatus: (moveId: string, status: NextMove["status"]) => void;
  plotPersonId: string | null;
  setPlotPersonId: (personId: string) => void;
  plotDraft: string;
  setPlotDraft: (value: string) => void;
  plotRationale: string;
  setPlotRationale: (value: string) => void;
  plotRisk: NextMove["risk"];
  setPlotRisk: (risk: NextMove["risk"]) => void;
  addPlotMove: () => void;
}) {
  const liveMoves = data.nextMoves.filter((move) => move.status !== "dismissed").length;

  return (
    <View style={styles.stack}>
      <HeroTitle title="Plot Board" subtitle={`${liveMoves} live moves. Create one, then move it from Bad Idea? to Loaded to Handled.`} />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>File A New Move</Text>
        <Text style={styles.bodyText}>Mobile skips dragging. Use the buttons. Very official.</Text>
        {data.people.length ? (
          <>
            <Text style={styles.label}>Person File</Text>
            <View style={styles.wrapRow}>
              {data.people.map((person) => (
                <Pressable
                  key={person.id}
                  onPress={() => setPlotPersonId(person.id)}
                  style={[styles.chip, plotPersonId === person.id && styles.chipActive]}
                >
                  <Text style={[styles.chipText, plotPersonId === person.id && styles.chipTextActive]}>{person.name.split(" ")[0]}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={plotDraft}
              onChangeText={setPlotDraft}
              multiline
              placeholder="Example: Send Ada the two founder intros before this becomes folklore."
              placeholderTextColor="#6b7280"
              style={[styles.input, styles.textArea]}
            />
            <TextInput
              value={plotRationale}
              onChangeText={setPlotRationale}
              placeholder="Why this move? Optional, but future-you likes receipts."
              placeholderTextColor="#6b7280"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              style={styles.input}
            />
            <Text style={styles.label}>Fumble Risk</Text>
            <OptionRow options={moveRisks} value={plotRisk} onChange={setPlotRisk} />
            <KeyboardDoneButton />
            <Pressable style={styles.primaryButton} onPress={addPlotMove}>
              <Text style={styles.primaryButtonText}>Add To Bad Idea?</Text>
            </Pressable>
          </>
        ) : (
          <Empty text="No people yet. Open a file before planning thoughtful nonsense." />
        )}
      </View>
      {moveStatuses.map((status) => {
        const moves = data.nextMoves.filter((move) => move.status === status);
        return (
          <View key={status} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{moveStatusLabels[status]}</Text>
              <Text style={styles.countPill}>{moves.length}</Text>
            </View>
            <Text style={styles.finePrint}>{plotColumnHelp[status]}</Text>
            {moves.length ? (
              moves.map((move) => (
                <View key={move.id} style={styles.moveCard}>
                  <Pressable onPress={() => choosePerson(move.personId, "dossier")}>
                    <Text style={styles.movePerson}>{personName(data, move.personId)}</Text>
                  </Pressable>
                  <Text style={styles.bodyText}>{move.draft}</Text>
                  <Text style={styles.finePrint}>{move.rationale}</Text>
                  <Badge text={`${move.risk} risk`} tone={move.risk === "high" ? "hot" : move.risk === "medium" ? "cool" : undefined} />
                  <Text style={styles.sectionLabel}>Move card to</Text>
                  <View style={styles.wrapRow}>
                    {moveStatuses.map((nextStatus) => (
                      <Pressable
                        key={nextStatus}
                        onPress={() => updateMoveStatus(move.id, nextStatus)}
                        style={[styles.chip, move.status === nextStatus && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, move.status === nextStatus && styles.chipTextActive]}>{moveStatusLabels[nextStatus]}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Empty text="No cards here. Suspiciously peaceful." />
            )}
          </View>
        );
      })}
    </View>
  );
}

function EvidenceScreen({
  data,
  resetDemo,
  clearData,
  shareExport,
  importText,
  setImportText,
  importBackup
}: {
  data: CrmData;
  resetDemo: () => void;
  clearData: () => void;
  shareExport: () => void;
  importText: string;
  setImportText: (value: string) => void;
  importBackup: () => void;
}) {
  return (
    <View style={styles.stack}>
      <HeroTitle title="Evidence Locker" subtitle="Fake data, local storage, visible exits." />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy Boundary</Text>
        <Text style={styles.bodyText}>
          Friend CRM stores user-entered relationship notes on this device. It does not scrape messages, contacts, social accounts, or send outreach for you.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Demo Readiness</Text>
        <View style={styles.statGrid}>
          <Stat label="People" value={String(data.people.length)} />
          <Stat label="Notes" value={String(data.notes.length)} />
          <Stat label="Memories" value={String(data.memories.length)} />
        </View>
        <Text style={styles.bodyText}>This mobile build stores data on this device through AsyncStorage. No Supabase, no provider calls, no real secrets.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Local Controls</Text>
        <Text style={styles.bodyText}>Reset, export, import, and full local clearing live here so the People screen can stay focused on people.</Text>
        <Pressable style={styles.primaryButton} onPress={resetDemo}>
          <Text style={styles.primaryButtonText}>Restore Fake Demo Friends</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={shareExport}>
          <Text style={styles.secondaryButtonText}>Share Local JSON Export</Text>
        </Pressable>
        <Pressable style={styles.dangerButton} onPress={clearData}>
          <Text style={styles.dangerButtonText}>Clear Local Data</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Paste Backup JSON</Text>
        <TextInput
          value={importText}
          onChangeText={setImportText}
          multiline
          placeholder="Paste a Friend CRM mobile export here."
          placeholderTextColor="#6b7280"
          style={[styles.input, styles.largeTextArea]}
        />
        <KeyboardDoneButton />
        <Pressable style={styles.secondaryButton} onPress={importBackup}>
          <Text style={styles.secondaryButtonText}>Import Local Backup</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PersonCard({ data, person, onPress }: { data: CrmData; person: Person; onPress: () => void }) {
  const loops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done");
  const days = person.lastContactAt ? `${daysBetween(person.lastContactAt)}d` : "Never";

  return (
    <Pressable style={styles.personCard} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{person.name.slice(0, 1)}</Text>
      </View>
      <View style={styles.personBody}>
        <Text style={styles.personName}>{person.name}</Text>
        <Text style={styles.personMeta}>{[person.city, person.relationshipTypes.join(", ")].filter(Boolean).join(" / ")}</Text>
        <View style={styles.wrapRow}>
          <Badge text={person.warmth} tone={person.warmth} />
          <Badge text={`${person.trust}/5 trust`} />
          <Badge text={person.sensitivity} />
          <Badge text={`${loops.length} loose`} />
          <Badge text={`${days} last contact`} />
        </View>
      </View>
    </Pressable>
  );
}

function HeroTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Badge({ text, tone }: { text: string; tone?: string }) {
  return (
    <View style={[styles.badge, tone === "hot" && styles.badgeHot, tone === "warm" && styles.badgeWarm, tone === "cool" && styles.badgeCool]}>
      <Text style={styles.badgeText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>
        {text}
      </Text>
    </View>
  );
}

function OptionRow<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (value: T) => void }) {
  return (
    <View style={styles.wrapRow}>
      {options.map((option) => (
        <Pressable key={option} onPress={() => onChange(option)} style={[styles.chip, value === option && styles.chipActive]}>
          <Text style={[styles.chipText, value === option && styles.chipTextActive]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function RecordList({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.length ? items.map((item) => <Bullet key={item} text={item} />) : <Empty text={empty} />}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>-</Text>
      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

function Empty({ text }: { text: string }) {
  return <Text style={styles.emptyText}>{text}</Text>;
}

function ActionEmpty({ text, actionLabel, onAction }: { text: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.actionEmpty}>
      <Text style={styles.emptyText}>{text}</Text>
      {actionLabel ? (
        <Pressable style={styles.inlineButton} onPress={onAction ?? (() => Keyboard.dismiss())}>
          <Text style={styles.inlineButtonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function KeyboardDoneButton() {
  return (
    <Pressable style={styles.keyboardButton} onPress={() => Keyboard.dismiss()}>
      <Text style={styles.keyboardButtonText}>Done Typing</Text>
    </Pressable>
  );
}

const colors = {
  ink: "#07111f",
  navy: "#071734",
  blue: "#1463ff",
  cyan: "#00c9ff",
  yellow: "#ffd21f",
  magenta: "#ff4aa2",
  paper: "#fffdf3",
  panel: "#f7fbff",
  line: "#111827",
  muted: "#64748b",
  green: "#bbf7d0",
  red: "#dc2626"
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.navy
  },
  appShell: {
    flex: 1
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 4,
    borderColor: colors.yellow,
    backgroundColor: colors.ink
  },
  brandKicker: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.yellow,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  brandTitle: {
    marginTop: 6,
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900"
  },
  notice: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.magenta
  },
  noticeText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  screen: {
    flex: 1,
    backgroundColor: "#eaf3ff"
  },
  screenContent: {
    padding: 14,
    paddingBottom: 126
  },
  stack: {
    gap: 12
  },
  hero: {
    borderWidth: 3,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.yellow,
    shadowColor: colors.cyan,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 5, height: 5 }
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  subtitle: {
    marginTop: 4,
    color: "#334155",
    fontSize: 15,
    fontWeight: "800"
  },
  card: {
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.paper,
    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
    gap: 10
  },
  quickAddBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    gap: 8
  },
  emptyPanel: {
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#e0f2fe",
    gap: 8
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  bodyText: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    flexShrink: 1
  },
  finePrint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700"
  },
  sectionLabel: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  label: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  input: {
    minHeight: 46,
    borderWidth: 2,
    borderColor: "#b7c5e3",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  textArea: {
    minHeight: 86,
    textAlignVertical: "top"
  },
  largeTextArea: {
    minHeight: 140,
    textAlignVertical: "top"
  },
  addRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  addInput: {
    flex: 1
  },
  squareButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    backgroundColor: colors.blue
  },
  squareButtonText: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "900"
  },
  primaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.yellow,
    shadowColor: colors.ink,
    shadowOpacity: 0.22,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 }
  },
  primaryButtonText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  secondaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    shadowColor: colors.ink,
    shadowOpacity: 0.14,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 2 }
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  dangerButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.red
  },
  dangerButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  personCard: {
    flexDirection: "row",
    gap: 10,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.panel
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 8,
    backgroundColor: colors.blue,
    shadowColor: colors.yellow,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 }
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 18
  },
  personBody: {
    flex: 1,
    gap: 5
  },
  personName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: "900"
  },
  personMeta: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700"
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7
  },
  badge: {
    minWidth: 70,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#eef2ff"
  },
  badgeWarm: {
    backgroundColor: colors.green
  },
  badgeHot: {
    backgroundColor: "#fecaca"
  },
  badgeCool: {
    backgroundColor: "#dbeafe"
  },
  badgeText: {
    color: "#243244",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center"
  },
  chip: {
    minWidth: 78,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#ffffff"
  },
  chipActive: {
    borderColor: colors.line,
    backgroundColor: colors.blue
  },
  chipText: {
    color: "#334155",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center"
  },
  chipTextActive: {
    color: "#ffffff"
  },
  statGrid: {
    flexDirection: "row",
    gap: 8
  },
  stat: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#93c5fd",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#dbeafe",
    minWidth: 0
  },
  statValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900"
  },
  statLabel: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "800"
  },
  bulletRow: {
    flexDirection: "row",
    gap: 8
  },
  bulletDot: {
    color: colors.blue,
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "800",
    fontStyle: "italic"
  },
  actionEmpty: {
    gap: 8,
    alignItems: "flex-start"
  },
  inlineButton: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.yellow
  },
  inlineButtonText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  keyboardButton: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: "#eff6ff"
  },
  keyboardButtonText: {
    color: "#1e3a8a",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    gap: 8,
    backgroundColor: "#ffffff"
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  countPill: {
    minWidth: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    backgroundColor: colors.yellow,
    color: colors.ink,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center"
  },
  miniButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f8fafc"
  },
  miniButtonActive: {
    borderColor: colors.line,
    backgroundColor: colors.yellow
  },
  miniButtonText: {
    color: "#475569",
    fontWeight: "900"
  },
  miniButtonTextActive: {
    color: colors.ink
  },
  moveCard: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    gap: 8,
    backgroundColor: "#ffffff"
  },
  movePerson: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  tabBar: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopWidth: 3,
    borderColor: colors.yellow,
    backgroundColor: colors.ink
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 9,
    backgroundColor: "#111827"
  },
  tabButtonActive: {
    borderColor: colors.yellow,
    backgroundColor: colors.blue
  },
  tabText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "900"
  },
  tabTextActive: {
    color: "#ffffff"
  }
});
