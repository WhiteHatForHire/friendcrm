import { StatusBar } from "expo-status-bar";
import { Children, cloneElement, createContext, isValidElement, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
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
  hasDemoPeople,
  importJson,
  loadDisplayMode,
  loadData,
  makeId,
  newPerson,
  resetToDemoData,
  saveDisplayMode,
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
import type { MobileDisplayMode } from "./src/core/storage";

type Tab = "people" | "dossier" | "debrief" | "plot" | "evidence";
type ReviewDraft = ExtractionSuggestion & { approved: boolean };

const tabLabels: Record<Tab, string> = {
  people: "People",
  dossier: "Dossier",
  debrief: "Debrief",
  plot: "Moves",
  evidence: "Settings"
};

const warmthOptions: Warmth[] = ["cold", "cool", "neutral", "warm", "hot"];
const sensitivityOptions: Sensitivity[] = ["normal", "sensitive", "private"];
const moveStatuses: NextMove["status"][] = ["idea", "queued", "done", "dismissed"];
const moveRisks: NextMove["risk"][] = ["low", "medium", "high"];
const moveStatusLabels: Record<NextMove["status"], string> = {
  idea: "Next",
  queued: "Later",
  done: "Complete",
  dismissed: "Archived"
};
const plotColumnHelp: Record<NextMove["status"], string> = {
  idea: "The small follow-ups you want to make next.",
  queued: "Worth doing, just not right now.",
  done: "Completed follow-ups, kept for context.",
  dismissed: "No longer relevant. Archived, not erased."
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
  const [displayMode, setDisplayMode] = useState<MobileDisplayMode>("bureau");
  const [displayModeReady, setDisplayModeReady] = useState(false);
  const [notice, setNotice] = useState("Demo bureau ready. Fake data only.");
  const noticeOpacity = useRef(new Animated.Value(1)).current;
  const modeGlowOpacity = useRef(new Animated.Value(0)).current;
  const screenScrollRef = useRef<ScrollView>(null);
  const palette = displayPalettes[displayMode];

  useEffect(() => {
    loadData()
      .then((loaded) => {
        setData(loaded);
        setSelectedPersonId(null);
        setPlotPersonId(loaded.people[0]?.id ?? null);
        setNotePersonIds([]);
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
    loadDisplayMode()
      .then((mode) => setDisplayMode(mode))
      .finally(() => setDisplayModeReady(true));
  }, []);

  useEffect(() => {
    if (displayModeReady) void saveDisplayMode(displayMode);
  }, [displayMode, displayModeReady]);

  useEffect(() => {
    modeGlowOpacity.stopAnimation();
    if (!palette.animated) {
      modeGlowOpacity.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(modeGlowOpacity, { toValue: 0.42, duration: 950, useNativeDriver: true }),
        Animated.timing(modeGlowOpacity, { toValue: 0.06, duration: 1150, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [modeGlowOpacity, palette.animated]);

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
    const timer = setTimeout(() => screenScrollRef.current?.scrollTo({ y: 0, animated: false }), 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    if (!data) return;
    if (selectedPersonId && !data.people.some((person) => person.id === selectedPersonId)) {
      setSelectedPersonId(null);
    }

    if (plotPersonId && !data.people.some((person) => person.id === plotPersonId)) {
      setPlotPersonId(data.people[0]?.id ?? null);
    }

    if (!plotPersonId && data.people[0]) {
      setPlotPersonId(data.people[0].id);
    }
  }, [data, plotPersonId, selectedPersonId]);

  const selectedPerson = useMemo(() => data?.people.find((person) => person.id === selectedPersonId), [data, selectedPersonId]);

  if (!data) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.shell }]}>
        <View style={styles.loading}>
          <Text style={styles.brandKicker}>FRIEND CRM</Text>
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
      Alert.alert("Next Moves needs a person", "Choose a person and write the follow-up before adding it.");
      return;
    }

    Keyboard.dismiss();
    const move: NextMove = {
      id: makeId("x"),
      personId,
      type: "check_in",
      draft,
      rationale: plotRationale.trim() || "Manually added from Next Moves.",
      risk: plotRisk,
      status: "idea"
    };

    updateData((current) => ({ ...current, nextMoves: [move, ...current.nextMoves] }));
    setPlotDraft("");
    setPlotRationale("");
    setPlotRisk("low");
    setNotice("New next move added. Keep it small and specific.");
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
    setNotice(`Next move changed to ${moveStatusLabels[status]}.`);
  }

  async function resetDemo() {
    const fresh = await resetToDemoData();
    setData(fresh);
    setSelectedPersonId(null);
    setPlotPersonId(fresh.people[0]?.id ?? null);
    setNotePersonIds([]);
    setReviewDrafts([]);
    setReviewSourceNoteId(null);
    setNotice("Fresh fake friends loaded. Zero real evidence harmed.");
  }

  async function clearData() {
    Alert.alert(
      "Clear local demo data?",
      "This removes local mobile data on this device. Settings keeps the reset, import, and export controls.",
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
                setNotice("Local data cleared. The People desk is empty on purpose. Settings has reset controls when you need them.");
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
      setNotice("Export failed. Nothing was deleted.");
      Alert.alert("Export failed", "Could not open the local share sheet.");
    }
  }

  function importBackup() {
    try {
      Keyboard.dismiss();
      const imported = importJson(importText);
      setData(imported);
      setSelectedPersonId(null);
      setPlotPersonId(imported.people[0]?.id ?? null);
      setNotePersonIds([]);
      setImportText("");
      setNotice("Backup imported locally. Please act normal.");
    } catch (error) {
      Alert.alert("Import failed", error instanceof Error ? error.message : "Could not import that JSON.");
    }
  }

  return (
    <DisplayModeContext.Provider value={palette}>
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.shell }]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.appShell} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.topBar, { backgroundColor: palette.header, borderColor: palette.line }]}>
          <Animated.View pointerEvents="none" style={[styles.modeGlow, { backgroundColor: palette.glow, opacity: modeGlowOpacity }]} />
          <View>
            <Text style={styles.brandKicker}>FRIEND CRM</Text>
          <Text style={[styles.brandTitle, { color: palette.headerInk }]}>Private Friend Bureau</Text>
          </View>
        </View>

        <Animated.View style={[styles.notice, { opacity: noticeOpacity }]}>
          <Text style={styles.noticeText}>{notice}</Text>
        </Animated.View>

        <ScrollView
          ref={screenScrollRef}
          style={[styles.screen, { backgroundColor: palette.canvas }]}
          contentContainerStyle={styles.screenContent}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
        <ThemeScope>
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
            hasDemoPeople={hasDemoPeople(data)}
          />
        ) : null}
        </ThemeScope>

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
          ) : <DossierPickerScreen data={data} choosePerson={choosePerson} openPeople={() => setActiveTab("people")} />
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
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
          />
        ) : null}
        </ScrollView>

        <View style={[styles.tabBar, { backgroundColor: palette.header, borderColor: palette.primary }]}>
          {(Object.keys(tabLabels) as Tab[]).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                if (tab === "dossier") setSelectedPersonId(null);
                setActiveTab(tab);
              }}
              style={[styles.tabButton, { backgroundColor: palette.shell, borderColor: palette.line }, activeTab === tab && styles.tabButtonActive, activeTab === tab && { backgroundColor: palette.primary, borderColor: palette.card }]}
            >
              <Text style={[styles.tabText, { color: palette.muted }, activeTab === tab && styles.tabTextActive, activeTab === tab && { color: palette.onPrimary }]}>{tabLabels[tab]}</Text>
            </Pressable>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </DisplayModeContext.Provider>
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
  clearData,
  hasDemoPeople
}: {
  data: CrmData;
  search: string;
  setSearch: (value: string) => void;
  newPersonName: string;
  setNewPersonName: (value: string) => void;
  addPerson: () => void;
  choosePerson: (personId: string) => void;
  clearData: () => void;
  hasDemoPeople: boolean;
}) {
  const filtered = data.people.filter((person) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [person.name, person.city, person.summary, person.relationshipTypes.join(" ")].join(" ").toLowerCase().includes(query);
  });
  return (
    <ThemeScope><View style={styles.stack}>
      <HeroTitle title="People Files" subtitle={`${data.people.length} people, ${data.openLoops.filter((loop) => loop.status !== "done").length} unfinished threads.`} />
      {hasDemoPeople ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clear Demo Data</Text>
          <Text style={styles.bodyText}>Want a clean desk? Clear the local demo files here. Reset, import, and export live in Settings.</Text>
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
          <Text style={styles.bodyText}>Local data is clear. Open a new file above, or use Settings when you want to reload the fake demo bureau.</Text>
        </View>
      ) : null}
      {data.people.length > 0 && !filtered.length ? <Empty text="No people match that search." /> : null}
      {filtered.map((person) => (
        <PersonCard key={person.id} data={data} person={person} onPress={() => choosePerson(person.id)} />
      ))}
    </View></ThemeScope>
  );
}

function DossierPickerScreen({
  data,
  choosePerson,
  openPeople
}: {
  data: CrmData;
  choosePerson: (personId: string) => void;
  openPeople: () => void;
}) {
  const recentPersonIds = data.notes
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .flatMap((note) => note.personIds)
    .filter((personId, index, values) => values.indexOf(personId) === index)
    .slice(0, 3);
  const recentPeople = recentPersonIds
    .map((personId) => data.people.find((person) => person.id === personId))
    .filter((person): person is Person => Boolean(person));

  return (
    <ThemeScope><View style={styles.stack}>
      <HeroTitle title="Dossier" subtitle="Choose a person when you want their relationship notes, remembered details, loose threads, and next move." />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>No Person Open</Text>
        <Text style={styles.bodyText}>Dossiers stay intentional. Open a person from People, Next Moves, or a recent debrief instead of carrying the last file around.</Text>
        <Text style={styles.sectionLabel}>Recent people</Text>
        {recentPeople.length ? recentPeople.map((person) => (
          <Pressable key={person.id} style={styles.secondaryButton} onPress={() => choosePerson(person.id)}>
            <Text style={styles.secondaryButtonText}>Open {person.name}</Text>
          </Pressable>
        )) : <Text style={styles.bodyText}>No recent debriefs yet. Start from People when you are ready.</Text>}
      </View>
      <View style={styles.emptyPanel}>
        <Text style={styles.cardTitle}>Start With People</Text>
        <Text style={styles.bodyText}>Choose a person to view or edit their private relationship file.</Text>
        <Pressable style={styles.primaryButton} onPress={openPeople}>
          <Text style={styles.primaryButtonText}>Open People</Text>
        </Pressable>
      </View>
    </View></ThemeScope>
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
    <ThemeScope><View style={styles.stack}>
      <HeroTitle title={person.name} subtitle={`${person.city ?? "Unknown city"} / ${person.relationshipTypes.map(displayLabel).join(", ") || "classified"}`} />
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

      <RecordList title="Recent Debriefs" empty="No debriefs saved yet. Capture one from Debrief." items={recentNotes.map((note) => `${note.occurredAt}: ${note.rawText}`)} />
      <RecordList title="Things Remembered" empty="No confirmed memories yet. Use Quick Add above to make one official." items={memories.map((memory) => memory.text)} />
      <RecordList title="Unfinished Business" empty="No loose threads yet. Add one above before it becomes social archaeology." items={loops.map((loop) => loop.title)} />
      <RecordList title="Next Moves" empty="No next moves yet. Plan one above or from Next Moves." items={moves.map((move) => move.draft)} />
    </View></ThemeScope>
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
    <ThemeScope><View style={styles.card}>
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
    </View></ThemeScope>
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
    <ThemeScope><View style={styles.stack}>
      <HeroTitle title="Debrief" subtitle="After an interaction, capture what happened while it is still fresh." />
      {!data.people.length ? (
        <View style={styles.emptyPanel}>
          <Text style={styles.cardTitle}>Add Someone First</Text>
          <Text style={styles.bodyText}>Create or choose a person before capturing a debrief, so the note has useful context.</Text>
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
          placeholder="What happened? What mattered? Is there anything to remember or follow up on?"
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
    </View></ThemeScope>
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
    <ThemeScope><View style={styles.stack}>
      <HeroTitle title="Next Moves" subtitle={`${liveMoves} active follow-ups. Add one, then keep it in Next, Later, or Complete.`} />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add A Next Move</Text>
        <Text style={styles.bodyText}>A small, specific follow-up for someone you care about. Use the status buttons to update it later.</Text>
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
            <Text style={styles.label}>How Delicate Is This?</Text>
            <OptionRow options={moveRisks} value={plotRisk} onChange={setPlotRisk} />
            <KeyboardDoneButton />
            <Pressable style={styles.primaryButton} onPress={addPlotMove}>
              <Text style={styles.primaryButtonText}>Add To Next</Text>
            </Pressable>
          </>
        ) : (
          <Empty text="No people yet. Open a file before planning thoughtful nonsense." />
        )}
      </View>
      {moveStatuses.map((status) => {
        const moves = data.nextMoves.filter((move) => move.status === status);
        return (
          <View key={status} style={[styles.card, { borderLeftWidth: 6, borderLeftColor: moveStatusAccent(status), backgroundColor: moveStatusBackground(status) }]}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{moveStatusLabels[status]}</Text>
              <Text style={styles.countPill}>{moves.length}</Text>
            </View>
            <Text style={styles.finePrint}>{plotColumnHelp[status]}</Text>
            {moves.length ? (
              moves.map((move) => (
                <View key={move.id} style={[styles.moveCard, { borderLeftWidth: 5, borderLeftColor: moveStatusAccent(status) }]}>
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
              <Empty text="Nothing here yet." />
            )}
          </View>
        );
      })}
    </View></ThemeScope>
  );
}

function EvidenceScreen({
  data,
  resetDemo,
  clearData,
  shareExport,
  importText,
  setImportText,
  importBackup,
  displayMode,
  setDisplayMode
}: {
  data: CrmData;
  resetDemo: () => void;
  clearData: () => void;
  shareExport: () => void;
  importText: string;
  setImportText: (value: string) => void;
  importBackup: () => void;
  displayMode: MobileDisplayMode;
  setDisplayMode: (mode: MobileDisplayMode) => void;
}) {
  return (
    <ThemeScope><View style={styles.stack}>
      <HeroTitle title="Settings" subtitle="Privacy, display preferences, and local data controls." />
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Color Modes</Text>
        <Text style={styles.bodyText}>Pick a field-notebook mood. These modes only change how Friend CRM looks on this device.</Text>
        <View style={styles.modeGrid}>
          {displayModeOptions.map((mode) => {
            const palette = displayPalettes[mode.id];
            const selected = displayMode === mode.id;
            return (
              <Pressable
                key={mode.id}
                accessibilityRole="button"
                testID="display-mode-preview"
                accessibilityState={{ selected }}
                onPress={() => setDisplayMode(mode.id)}
                style={[styles.modeCard, { backgroundColor: palette.card, borderColor: selected ? palette.primary : palette.line }, selected && styles.modeCardSelected]}
              >
                <View style={styles.modePreview}>
                  {palette.signal.map((color) => <View key={color} style={[styles.modePreviewSegment, { backgroundColor: color }]} />)}
                </View>
                <Text style={[styles.modeName, { color: palette.ink }]}>{mode.name}</Text>
                <Text style={[styles.modeDescription, { color: palette.muted }]}>{mode.description}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Privacy Boundary</Text>
        <Text style={styles.bodyText}>
          Friend CRM stores user-entered relationship notes on this device. It does not scrape messages, contacts, social accounts, or send outreach for you.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Local Storage</Text>
        <View style={styles.statGrid}>
          <Stat label="People" value={String(data.people.length)} />
          <Stat label="Notes" value={String(data.notes.length)} />
          <Stat label="Memories" value={String(data.memories.length)} />
        </View>
        <Text style={styles.bodyText}>This mobile build stores data on this device through AsyncStorage. No hosted sync, provider calls, or real secrets.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Local Controls</Text>
        <Text style={styles.bodyText}>Reset, export, import, and full local clearing live here so People can stay focused on people.</Text>
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
    </View></ThemeScope>
  );
}

function PersonCard({ data, person, onPress }: { data: CrmData; person: Person; onPress: () => void }) {
  const palette = useDisplayPalette();
  const loops = data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done");
  const days = person.lastContactAt ? `${daysBetween(person.lastContactAt)}d` : "Never";

  return (
    <Pressable style={[styles.personCard, { backgroundColor: palette.card, borderColor: palette.line }]} onPress={onPress}>
      <View style={[styles.avatar, { backgroundColor: personAccent(person.name) }]}>
        <Text style={styles.avatarText}>{person.name.slice(0, 1)}</Text>
      </View>
      <View style={styles.personBody}>
        <Text style={[styles.personName, { color: palette.ink }]}>{person.name}</Text>
        <Text style={[styles.personMeta, { color: palette.muted }]}>{[person.city, person.relationshipTypes.map(displayLabel).join(", ")].filter(Boolean).join(" / ")}</Text>
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
  const palette = useDisplayPalette();
  return (
    <View style={[styles.hero, { backgroundColor: palette.card, borderColor: palette.line, shadowColor: palette.primary }]}>
      <View style={styles.heroSignal} accessibilityElementsHidden>
        {palette.signal.map((color) => <View key={color} style={[styles.heroSignalSegment, { backgroundColor: color }]} />)}
      </View>
      <Text style={[styles.title, { color: palette.ink }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: palette.muted }]}>{subtitle}</Text>
    </View>
  );
}

function tabAccent(tab: Tab) {
  return ({ people: colors.blue, dossier: colors.cyan, debrief: colors.yellow, plot: colors.lime, evidence: colors.magenta } as const)[tab];
}

function moveStatusAccent(status: NextMove["status"]) {
  return ({ idea: colors.blue, queued: colors.yellow, done: "#16a34a", dismissed: "#94a3b8" } as const)[status];
}

function moveStatusBackground(status: NextMove["status"]) {
  return ({ idea: "#f4f8ff", queued: "#fff9db", done: "#f0fdf4", dismissed: "#f8fafc" } as const)[status];
}

function personAccent(name: string) {
  const accents = [colors.blue, colors.cyan, colors.magenta, "#7c3aed", "#0f9f6e"];
  const index = Array.from(name).reduce((total, character) => total + character.charCodeAt(0), 0) % accents.length;
  return accents[index];
}

function displayLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Stat({ label, value }: { label: string; value: string }) {
  const palette = useDisplayPalette();
  return (
    <View style={[styles.stat, { borderColor: palette.line, borderTopColor: statAccent(label), backgroundColor: palette.card }]}>
      <Text style={[styles.statValue, { color: palette.ink }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: palette.muted }]}>{label}</Text>
    </View>
  );
}

function statAccent(label: string) {
  return ({ Vibe: colors.magenta, Trust: colors.cyan, Privacy: colors.yellow, People: colors.blue, Notes: colors.cyan, Memories: colors.magenta } as Record<string, string>)[label] ?? colors.blue;
}

function Badge({ text, tone }: { text: string; tone?: string }) {
  const palette = useDisplayPalette();
  return (
    <View style={[styles.badge, { borderColor: palette.line, backgroundColor: palette.card }, tone === "hot" && styles.badgeHot, tone === "warm" && styles.badgeWarm, tone === "cool" && styles.badgeCool]}>
      <Text style={[styles.badgeText, { color: palette.ink }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>
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
  const palette = useDisplayPalette();
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.line, borderTopColor: palette.primary }]}>
      <Text style={[styles.cardTitle, { color: palette.ink }]}>{title}</Text>
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
  lime: "#86f23b",
  paper: "#fffdf3",
  panel: "#f7fbff",
  line: "#111827",
  muted: "#64748b",
  green: "#bbf7d0",
  red: "#dc2626"
};

type DisplayPalette = {
  shell: string;
  header: string;
  headerInk: string;
  canvas: string;
  card: string;
  ink: string;
  muted: string;
  line: string;
  primary: string;
  onPrimary: string;
  input: string;
  danger: string;
  onDanger: string;
  glow: string;
  signal: string[];
  animated: boolean;
};

const displayPalettes: Record<MobileDisplayMode, DisplayPalette> = {
  bureau: {
    shell: colors.navy,
    header: colors.ink,
    headerInk: "#ffffff",
    canvas: "#eaf3ff",
    card: colors.paper,
    ink: colors.ink,
    muted: colors.muted,
    line: "#334155",
    primary: colors.blue,
    onPrimary: "#ffffff",
    input: "#ffffff",
    danger: colors.red,
    onDanger: "#ffffff",
    glow: colors.cyan,
    signal: [colors.blue, colors.cyan, colors.magenta, colors.lime],
    animated: false
  },
  neon: {
    shell: "#100720",
    header: "#18082f",
    headerInk: "#fff5ff",
    canvas: "#170d2b",
    card: "#25143f",
    ink: "#fff5ff",
    muted: "#d7b9f4",
    line: "#ff71c0",
    primary: "#00e5ff",
    onPrimary: "#12051f",
    input: "#1b0d30",
    danger: "#f0478f",
    onDanger: "#ffffff",
    glow: "#ff26aa",
    signal: ["#00e5ff", "#ff26aa", "#a7ff31", "#ffcf3d"],
    animated: true
  },
  terminal: {
    shell: "#010604",
    header: "#020b06",
    headerInk: "#b9ffc2",
    canvas: "#06120b",
    card: "#0a1b10",
    ink: "#b9ffc2",
    muted: "#71b879",
    line: "#2fbf58",
    primary: "#86f23b",
    onPrimary: "#041006",
    input: "#06120b",
    danger: "#c83535",
    onDanger: "#ffffff",
    glow: "#32ff6a",
    signal: ["#0d5f28", "#1a9a43", "#86f23b", "#d4ff5a"],
    animated: true
  },
  sunset: {
    shell: "#2b0d31",
    header: "#40123f",
    headerInk: "#fff5ec",
    canvas: "#4a1d46",
    card: "#fff1db",
    ink: "#351431",
    muted: "#80516f",
    line: "#f18a42",
    primary: "#ef5aa1",
    onPrimary: "#351431",
    input: "#fff8ed",
    danger: "#c83042",
    onDanger: "#ffffff",
    glow: "#ffb547",
    signal: ["#fe784c", "#ffb547", "#ef5aa1", "#8265e8"],
    animated: true
  },
  candy: {
    shell: "#19376b",
    header: "#234b8f",
    headerInk: "#ffffff",
    canvas: "#dff6ff",
    card: "#fffdfc",
    ink: "#172247",
    muted: "#58708d",
    line: "#38a4de",
    primary: "#ff5eb1",
    onPrimary: "#172247",
    input: "#f6fcff",
    danger: "#d94166",
    onDanger: "#ffffff",
    glow: "#54d7ff",
    signal: ["#54d7ff", "#ff71c4", "#ffe14c", "#8fed5c"],
    animated: true
  }
};

const displayModeOptions: Array<{ id: MobileDisplayMode; name: string; description: string }> = [
  { id: "bureau", name: "Bureau", description: "The classic case-file desk." },
  { id: "neon", name: "Neon Pulse", description: "Late-night social headquarters." },
  { id: "terminal", name: "Hacker Terminal", description: "Green-screen relationship ops." },
  { id: "sunset", name: "Sunset FM", description: "Warm, loud, and slightly cinematic." },
  { id: "candy", name: "Candy Signal", description: "A cheerful intelligence operation." }
];

const DisplayModeContext = createContext<DisplayPalette>(displayPalettes.bureau);

function useDisplayPalette() {
  return useContext(DisplayModeContext);
}

/**
 * The app is intentionally built from a compact set of case-file primitives.
 * This scope gives every existing primitive a semantic display treatment, so a
 * mode changes the whole desk instead of only the header and hero card.
 */
function ThemeScope({ children }: { children: ReactNode }) {
  const palette = useDisplayPalette();

  const walk = (node: ReactNode, parentKind?: "primary" | "danger" | "selected" | "preview"): ReactNode => {
    if (!isValidElement(node)) return node;
    const props = node.props as { style?: unknown; children?: React.ReactNode; placeholderTextColor?: string; testID?: string };
    const flat = (StyleSheet.flatten(props.style) ?? {}) as Record<string, unknown>;
    const background = flat.backgroundColor as string | undefined;
    const isInput = node.type === TextInput;
    const isButton = node.type === Pressable;
    const isAvatar = flat.width === 42 && flat.height === 42;
    const isPreview = props.testID === "display-mode-preview";
    const isDanger = background === colors.red;
    const isPrimary = background === colors.yellow || (background === colors.blue && flat.width === 48);
    const isSelected = background === colors.blue && !isPrimary;
    const kind = isPreview ? "preview" : isDanger ? "danger" : isPrimary ? "primary" : isSelected ? "selected" : parentKind;
    const themed: Record<string, unknown> = {};

    if (isInput) {
      themed.backgroundColor = palette.input;
      themed.borderColor = palette.line;
      themed.color = palette.ink;
    } else if (node.type === Text && kind !== "preview") {
      themed.color = kind === "primary" || kind === "selected" ? palette.onPrimary : kind === "danger" ? palette.onDanger : palette.ink;
    } else if (!isAvatar && !isPreview && (background || flat.borderColor || flat.borderTopColor)) {
      themed.borderColor = palette.line;
      if (flat.borderTopWidth || flat.borderLeftWidth) themed.borderTopColor = palette.primary;
      if (isDanger) themed.backgroundColor = palette.danger;
      else if (isPrimary || isSelected) themed.backgroundColor = palette.primary;
      else themed.backgroundColor = palette.card;
      if (flat.shadowColor) themed.shadowColor = palette.line;
    }

    const nextProps: Record<string, unknown> = {
      ...props,
      ...(Object.keys(themed).length ? { style: [props.style, themed] } : {}),
      ...(isInput ? { placeholderTextColor: palette.muted } : {}),
      children: Children.map(props.children, (child) => walk(child, kind))
    };
    return cloneElement(node, nextProps);
  };

  return <>{Children.map(children, (child) => walk(child))}</>;
}

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
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#334155",
    backgroundColor: colors.ink
  },
  modeGlow: {
    position: "absolute",
    top: -34,
    right: -18,
    width: 156,
    height: 108,
    borderRadius: 78
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
    overflow: "hidden",
    padding: 12,
    paddingTop: 16,
    backgroundColor: "#fff7c9",
    shadowColor: colors.cyan,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 5, height: 5 }
  },
  heroSignal: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: 7,
    flexDirection: "row"
  },
  heroSignalSegment: {
    flex: 1
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
    borderTopWidth: 5,
    borderTopColor: colors.cyan,
    backgroundColor: colors.paper,
    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
    gap: 10
  },
  modeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9
  },
  modeCard: {
    width: "48%",
    minHeight: 116,
    overflow: "hidden",
    borderWidth: 2,
    borderRadius: 10,
    padding: 9,
    gap: 6
  },
  modeCardSelected: {
    borderWidth: 4,
    shadowColor: colors.ink,
    shadowOpacity: 0.22,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 }
  },
  modePreview: {
    flexDirection: "row",
    height: 9,
    marginHorizontal: -9,
    marginTop: -9
  },
  modePreviewSegment: {
    flex: 1
  },
  modeName: {
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  modeDescription: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700"
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
    borderTopWidth: 5,
    borderTopColor: colors.magenta,
    backgroundColor: "#eef9ff",
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
    borderColor: "#a9bce7",
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
    borderLeftWidth: 5,
    borderLeftColor: colors.cyan,
    backgroundColor: colors.panel,
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 0,
    shadowOffset: { width: 3, height: 3 }
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
    borderTopWidth: 5,
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
    borderWidth: 2,
    borderColor: "#b8c8e5",
    borderRadius: 8,
    padding: 10,
    gap: 8,
    backgroundColor: "#ffffff",
    shadowColor: colors.ink,
    shadowOpacity: 0.1,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 2 }
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
    borderTopWidth: 5,
    borderColor: colors.cyan,
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
    borderWidth: 2,
    borderColor: colors.paper,
    borderTopWidth: 5,
    shadowColor: colors.ink,
    shadowOpacity: 0.55,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 2 }
  },
  tabText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "900"
  },
  tabTextActive: {
    color: "#ffffff"
  },
  tabTextOnYellow: {
    color: colors.ink
  }
});
