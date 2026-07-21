import { useState } from "react";
import type { DragEvent } from "react";
import { Check } from "lucide-react";
import { personName } from "../lib/insights";
import type { CrmData, NextMove } from "../types";

const columns: NextMove["status"][] = ["idea", "queued", "done", "dismissed"];

const columnLabels: Record<NextMove["status"], string> = {
  idea: "Bad Idea?",
  queued: "Loaded",
  done: "Handled",
  dismissed: "Never Mind"
};

const emptyCopy: Record<NextMove["status"], { title: string; copy: string; stamp: string }> = {
  idea: {
    title: "WANTED: One Specific Plan",
    copy: "No bad ideas here yet. Consider inventing a harmless little maneuver.",
    stamp: "SCHEMELESS"
  },
  queued: {
    title: "MISSING: Loaded Next Move",
    copy: "Nothing is queued. Peaceful, technically. Suspicious, emotionally.",
    stamp: "LOAD SOON"
  },
  done: {
    title: "FOUND: Zero Logged Wins",
    copy: "No handled moves yet. The applause department is standing by with a clipboard.",
    stamp: "UNCLAPPED"
  },
  dismissed: {
    title: "PUBLIC NOTICE: No Abandoned Schemes",
    copy: "No discarded maneuvers. Growth, or a lack of imagination. Hard to say.",
    stamp: "TOO CLEAN"
  }
};

export function PlotBoard({
  data,
  onSelect,
  onUpdateMove
}: {
  data: CrmData;
  onSelect: (personId: string) => void;
  onUpdateMove: (moveId: string, status: NextMove["status"]) => void;
}) {
  const [draggedMoveId, setDraggedMoveId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<NextMove["status"] | null>(null);
  const liveMoves = data.nextMoves.filter((move) => move.status !== "dismissed").length;

  function startDrag(event: DragEvent<HTMLElement>, move: NextMove) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-friend-crm-move", move.id);
    event.dataTransfer.setData("text/plain", move.id);
    setDraggedMoveId(move.id);
  }

  function allowDrop(event: DragEvent<HTMLElement>, status: NextMove["status"]) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  }

  function enterDropZone(event: DragEvent<HTMLElement>, status: NextMove["status"]) {
    event.preventDefault();
    setDragOverStatus(status);
  }

  function finishDrop(event: DragEvent<HTMLElement>, status: NextMove["status"]) {
    event.preventDefault();
    const moveId = event.dataTransfer.getData("application/x-friend-crm-move") || event.dataTransfer.getData("text/plain");
    const move = data.nextMoves.find((candidate) => candidate.id === moveId);

    if (move && move.status !== status) {
      onUpdateMove(move.id, status);
    }

    setDraggedMoveId(null);
    setDragOverStatus(null);
  }

  function clearDrag() {
    setDraggedMoveId(null);
    setDragOverStatus(null);
  }

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Plot Board</h1>
          <p>{liveMoves} live next moves. Soft schemes only.</p>
          <p className="view-guide">First move: drag one small next move into the state that matches reality.</p>
        </div>
      </header>
      <div className="board">
        {columns.map((status) => {
          const moves = data.nextMoves.filter((move) => move.status === status);

          return (
            <section
              key={status}
              aria-label={`${columnLabels[status]} moves`}
              className={`board-column${dragOverStatus === status ? " drag-over" : ""}`}
              data-status={status}
              onDragEnter={(event) => enterDropZone(event, status)}
              onDragOver={(event) => allowDrop(event, status)}
              onDrop={(event) => finishDrop(event, status)}
            >
              <h2>{columnLabels[status]}</h2>
              {moves.length === 0 && (
                <div className="empty-state small classified-empty">
                  <span className="classified-kicker">Plot Board Classifieds</span>
                  <strong>{emptyCopy[status].title}</strong>
                  <p>{emptyCopy[status].copy}</p>
                  <span className="classified-stamp">{emptyCopy[status].stamp}</span>
                </div>
              )}
              {moves.map((move) => (
                <article
                  key={move.id}
                  className={`move-card risk-${move.risk}${draggedMoveId === move.id ? " dragging" : ""}`}
                  data-move-id={move.id}
                  draggable
                  onDragEnd={clearDrag}
                  onDragStart={(event) => startDrag(event, move)}
                >
                  <div className="move-card-head">
                    <button className="link-button" onClick={() => onSelect(move.personId)} type="button">
                      {personName(data, move.personId)}
                    </button>
                    <span
                      className="drag-handle"
                      draggable
                      title="Drag this scheme"
                      aria-label="Drag this scheme"
                      onDragStart={(event) => startDrag(event, move)}
                    >
                      Move me
                    </span>
                  </div>
                  <p>{move.draft}</p>
                  <small>{move.rationale}</small>
                  <label className="move-status-control">
                    <span>Reclassify this maneuver</span>
                    <select
                      aria-label={`Move ${personName(data, move.personId)} next move to`}
                      value={status}
                      onChange={(event) => onUpdateMove(move.id, event.target.value as NextMove["status"])}
                    >
                      {columns.map((option) => (
                        <option key={option} value={option}>
                          {columnLabels[option]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="card-actions">
                    {columns.map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={option === status}
                        onClick={() => onUpdateMove(move.id, option)}
                      >
                        {option === status && <Check size={14} />}
                        {columnLabels[option]}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </section>
  );
}
