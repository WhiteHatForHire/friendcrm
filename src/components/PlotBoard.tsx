import { useState } from "react";
import type { DragEvent } from "react";
import { Check } from "lucide-react";
import { personName } from "../lib/insights";
import type { CrmData, NextMove } from "../types";

const columns: NextMove["status"][] = ["idea", "queued", "done", "dismissed"];

const columnLabels: Record<NextMove["status"], string> = {
  idea: "Next",
  queued: "Later",
  done: "Complete",
  dismissed: "Archived"
};

const emptyCopy: Record<NextMove["status"], { title: string; copy: string; stamp: string }> = {
  idea: {
    title: "No Next Moves Yet",
    copy: "Add one small, specific follow-up for someone you care about.",
    stamp: "READY WHEN YOU ARE"
  },
  queued: {
    title: "Nothing For Later",
    copy: "Save a useful follow-up here when now is not the right time.",
    stamp: "NO RUSH"
  },
  done: {
    title: "Nothing Complete Yet",
    copy: "Completed follow-ups stay here as useful context.",
    stamp: "IN PROGRESS"
  },
  dismissed: {
    title: "Nothing Archived",
    copy: "Archive a move when it is no longer useful. It remains in the local record.",
    stamp: "ALL CLEAR"
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
  const liveMoves = data.nextMoves.filter((move) => move.status === "idea" || move.status === "queued").length;

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
          <h1>Next Moves</h1>
          <p>{liveMoves} active follow-ups.</p>
          <p className="view-guide">Add a small next step, then move it between Next, Later, Complete, or Archived as reality changes.</p>
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
                  <span className="classified-kicker">Next Moves</span>
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
                      title="Drag this next move"
                      aria-label="Drag this next move"
                      onDragStart={(event) => startDrag(event, move)}
                    >
                      Move me
                    </span>
                  </div>
                  <p>{move.draft}</p>
                  <small>{move.rationale}</small>
                  <label className="move-status-control">
                    <span>Change status</span>
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
