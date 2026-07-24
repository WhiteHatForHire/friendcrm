import { Download, FileText, RotateCcw, Shield, Trash2, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { seedData } from "../data/seed";
import { parseCrmDataJson, summarizeCrmData } from "../lib/dataValidation";
import { download, exportJson, exportMarkdown } from "../lib/storage";
import type { CrmData } from "../types";

export function SettingsView({
  data,
  onClear,
  onRestoreSample,
  onImport,
  hostedSyncPanel,
  isPublicDemo = false,
  cursorEffectsEnabled,
  onCursorEffectsChange
}: {
  data: CrmData;
  onClear: () => void;
  onRestoreSample: () => void;
  onImport: (data: CrmData) => void;
  hostedSyncPanel?: ReactNode;
  isPublicDemo?: boolean;
  cursorEffectsEnabled: boolean;
  onCursorEffectsChange: (enabled: boolean) => void;
}) {
  const sensitiveNotes = data.notes.filter((note) => note.sensitivity !== "normal").length;
  const sensitiveMemories = data.memories.filter((memory) => memory.sensitivity !== "normal").length;
  const sensitiveOpenLoops = data.openLoops.filter((loop) => loop.sensitivity !== "normal").length;
  const privatePeople = data.people.filter((person) => person.sensitivity === "private").length;
  const acceptedRecords = data.memories.length + data.openLoops.length;
  const nextMoves = data.nextMoves.filter((move) => move.status !== "dismissed").length;
  const [importMessage, setImportMessage] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const [pendingImport, setPendingImport] = useState<CrmData | null>(null);
  const [backupAcknowledged, setBackupAcknowledged] = useState(false);
  const pendingSummary = pendingImport ? summarizeCrmData(pendingImport) : null;
  const sampleSummary = summarizeCrmData(seedData);

  function exportWithFeedback(filename: string, contents: string, mimeType?: string) {
    try {
      download(filename, contents, mimeType);
      setExportMessage(`${filename} exported. Treat it like a diary wearing a fake mustache.`);
    } catch {
      setExportMessage(`${filename} export failed. Nothing was deleted or changed.`);
    }
  }

  async function importJson(file?: File) {
    if (!file) return;
    const result = parseCrmDataJson(await file.text());

    if (!result.ok) {
      setImportMessage(`Import blocked. The file is giving nonsense: ${result.errors.slice(0, 3).join(" ")}`);
      setPendingImport(null);
      setBackupAcknowledged(false);
      return;
    }

    setPendingImport(result.value);
    setBackupAcknowledged(false);
    setImportMessage("Import looks structurally sane. Still read the preview before replacing your local reality.");
  }

  function confirmImport() {
    if (!pendingImport || !backupAcknowledged) return;
    onImport(pendingImport);
    setImportMessage(
      `Restored saved export: ${pendingImport.people.length} people and ${pendingImport.notes.length} notes are now the local browser dataset.`
    );
    setPendingImport(null);
    setBackupAcknowledged(false);
  }

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Settings</h1>
          <p>{data.people.length} people, {data.notes.length} notes, {data.memories.length} memories.</p>
          <p className="view-guide">First move: export anything you want to keep, then clear or restore the fictional sample safely.</p>
        </div>
      </header>
      <section className="display-settings" aria-labelledby="display-settings-title">
        <div>
          <span className="settings-action-kicker">Display</span>
          <h2 id="display-settings-title">Cursor effects</h2>
          <p>Use the rainbow pointer trail, or keep your normal system cursor. This preference stays in this browser.</p>
        </div>
        <label className="effect-toggle">
          <input
            type="checkbox"
            checked={cursorEffectsEnabled}
            onChange={(event) => onCursorEffectsChange(event.target.checked)}
          />
          <span>Rainbow cursor trail</span>
        </label>
      </section>
      <section className="export-warning">
        <Shield size={18} />
        <div>
          <strong>Exports include private relationship data. Treat them like a diary with receipts.</strong>
          <p>
            Current data includes {privatePeople} private people, {sensitiveNotes} sensitive/private notes,{" "}
            {sensitiveMemories} sensitive/private memories, and {sensitiveOpenLoops} sensitive/private open loops.
            JSON and Markdown exports preserve those labels. Do not leave this lying around like a fool.
          </p>
        </div>
      </section>
      <div className="settings-actions settings-action-groups">
        <section className="settings-action-card">
          <span className="settings-action-kicker">Step 1</span>
          <h2>Export Current File</h2>
          <p>Download the current local browser dataset before you start rearranging reality.</p>
          <button
            className="primary-button"
            type="button"
            onClick={() => exportWithFeedback("friend-crm-export.json", exportJson(data), "application/json")}
          >
            <Download size={16} />
            Export Backup JSON
          </button>
          <button
            className="primary-button muted"
            type="button"
            onClick={() => exportWithFeedback("friend-crm-export.md", exportMarkdown(data))}
          >
            <FileText size={16} />
            Export Readable Markdown
          </button>
        </section>
        <section className="settings-action-card">
          <span className="settings-action-kicker">Step 2</span>
          <h2>Restore Saved Export</h2>
          <p>Choose a Friend CRM JSON export, preview it, make a panic copy, then replace local data deliberately.</p>
          <label className="file-import-button">
            <Upload size={16} />
            Choose Saved Export JSON
            <input
              type="file"
              accept="application/json,.json"
              aria-label="Choose saved export JSON"
              onChange={(event) => {
                void importJson(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
        </section>
      </div>
      {exportMessage && <p className="settings-note action-feedback" aria-live="polite">{exportMessage}</p>}
      {!isPublicDemo && hostedSyncPanel}
      {!isPublicDemo && <section className="readiness-panel">
        <h2>Prototype Trial Targets, Because Apparently We Need Goals</h2>
        <div className="readiness-grid">
          <ReadinessMetric label="People" value={data.people.length} target={10} />
          <ReadinessMetric label="Notes" value={data.notes.length} target={25} />
          <ReadinessMetric label="Reviewed records" value={acceptedRecords} target={10} />
          <ReadinessMetric label="Next moves" value={nextMoves} target={5} />
          <ReadinessMetric
            label="Private/sensitive"
            value={privatePeople + sensitiveNotes + sensitiveMemories + sensitiveOpenLoops}
            target={3}
          />
        </div>
      </section>}
      {!isPublicDemo && <section className="shortcut-panel">
        <h2>Keyboard Mischief</h2>
        <div className="shortcut-grid">
          <span><kbd>1</kbd> The People</span>
          <span><kbd>2</kbd> The Radar</span>
          <span><kbd>3</kbd> Next Moves</span>
          <span><kbd>4</kbd> Debrief</span>
          <span><kbd>5</kbd> Settings</span>
          <span><kbd>N</kbd> Add a person</span>
          <span><kbd>C</kbd> Capture a note</span>
        </div>
      </section>}
      {!isPublicDemo && <section className="data-action-guide">
        <h2>Local Data Desk, Now With Fewer Mystery Buttons</h2>
        <div className="data-action-grid">
          <article>
            <strong>Export</strong>
            <p>Downloads a copy. Nothing in the browser changes.</p>
          </article>
          <article>
            <strong>Restore Saved Export</strong>
            <p>Previews a Friend CRM JSON export, asks for a panic copy, then replaces local browser data.</p>
          </article>
          <article>
            <strong>Restore Sample</strong>
            <p>Replaces current local data with the built-in fake demo friends after confirmation.</p>
          </article>
        </div>
      </section>}
      <section className="sample-restore-panel">
        <div>
          <h2>Restore Built-In Fake Friends</h2>
          <p>
            This is the demo safety lever. It replaces the current local browser dataset with fake sample data:
            {" "}
            {sampleSummary.people} people, {sampleSummary.notes} notes, {sampleSummary.memories} memories,{" "}
            {sampleSummary.openLoops} open loops, and {sampleSummary.nextMoves} next moves. It does not merge.
          </p>
          <p>
            Export first if the current local data matters. This is a local browser replacement, not a server delete,
            because there is no server in this demo.
          </p>
        </div>
        <button className="danger-button" type="button" onClick={onRestoreSample}>
          <RotateCcw size={16} />
          Restore Sample Friends
        </button>
      </section>
      <section className="clear-demo-panel">
        <div>
          <h2>Clear Fake Demo Data</h2>
          <p>Empty the current browser demo and start with a blank desk. You can restore the sample friends at any time.</p>
        </div>
        <button className="danger-link" type="button" onClick={onClear}>
          <Trash2 size={16} />
          Clear Demo Data
        </button>
      </section>
      {!isPublicDemo && pendingSummary && (
        <section className="import-preview">
          <h2>Check the Saved Export Before Restore</h2>
          <p>This replaces the current local browser dataset after confirmation. Read before you rewrite history.</p>
          <div className="readiness-grid">
            <ReadinessMetric label="People" value={pendingSummary.people} target={data.people.length || 1} />
            <ReadinessMetric label="Notes" value={pendingSummary.notes} target={data.notes.length || 1} />
            <ReadinessMetric label="Memories" value={pendingSummary.memories} target={data.memories.length || 1} />
            <ReadinessMetric label="Open loops" value={pendingSummary.openLoops} target={data.openLoops.length || 1} />
            <ReadinessMetric label="Sensitive/private" value={pendingSummary.sensitiveOrPrivate} target={1} />
          </div>
          <dl className="import-details">
            <div>
              <dt>People Preview</dt>
              <dd>{pendingSummary.firstPeople.join(", ") || "No people. Empty suitcase."}</dd>
            </div>
            <div>
              <dt>Notes Range</dt>
              <dd>
                {pendingSummary.oldestNoteDate && pendingSummary.newestNoteDate
                  ? `${pendingSummary.oldestNoteDate} to ${pendingSummary.newestNoteDate}`
                  : "No notes. Nothing in the diary."}
              </dd>
            </div>
            <div>
              <dt>Privacy Snapshot</dt>
              <dd>
                {pendingSummary.privatePeople} private people, {pendingSummary.sensitiveNotes} sensitive/private notes,{" "}
                {pendingSummary.sensitiveMemories} sensitive/private memories, {pendingSummary.sensitiveOpenLoops}{" "}
                sensitive/private open loops
              </dd>
            </div>
          </dl>
          <div className="restore-safety">
            <strong>Panic-copy step before restore</strong>
            <p>Export the current browser dataset before replacing it if anything here matters. Replacement cannot be undone inside the app.</p>
            <button
              className="primary-button muted"
              type="button"
              onClick={() => {
                exportWithFeedback("friend-crm-before-restore.json", exportJson(data), "application/json");
                setBackupAcknowledged(true);
              }}
            >
              <Download size={16} />
              Make Panic Copy Of Current File
            </button>
            <label className="backup-acknowledgement">
              <input
                type="checkbox"
                checked={backupAcknowledged}
                onChange={(event) => setBackupAcknowledged(event.target.checked)}
              />
              I made a panic copy, or I am deliberately restoring over disposable local data.
            </label>
          </div>
          <div className="delete-actions">
            <button
              type="button"
              onClick={() => {
                setPendingImport(null);
                setBackupAcknowledged(false);
              }}
            >
              Abort Mission
            </button>
            <button className="danger-button" type="button" onClick={confirmImport} disabled={!backupAcknowledged}>
              Restore This Saved Export
            </button>
          </div>
        </section>
      )}
      {importMessage && <p className="settings-note">{importMessage}</p>}
    </section>
  );
}

function ReadinessMetric({ label, value, target }: { label: string; value: number; target: number }) {
  const complete = value >= target;

  return (
    <span className={complete ? "readiness-metric complete" : "readiness-metric"}>
      <strong>
        {value}/{target}
      </strong>
      <small>{label}</small>
    </span>
  );
}
