import type { CrmData, ExtractionSuggestion, Memory, NextMove, OpenLoop, Person, RelationshipNote } from "../types";
import { acceptSuggestion } from "./insights";

export type PersonDeleteImpact = {
  personId: string;
  personName: string;
  notesRemoved: number;
  sharedNotesDetached: number;
  memoriesRemoved: number;
  openLoopsRemoved: number;
  nextMovesRemoved: number;
  interactionsRemoved: number;
  sharedInteractionsDetached: number;
};

export function addPersonRecord(data: CrmData, person: Person): CrmData {
  return {
    ...data,
    people: [person, ...data.people]
  };
}

export function upsertPersonRecord(data: CrmData, person: Person): CrmData {
  return {
    ...data,
    people: data.people.map((candidate) => (candidate.id === person.id ? person : candidate))
  };
}

export function deletePersonRecord(data: CrmData, personId: string): CrmData {
  return {
    people: data.people.filter((person) => person.id !== personId),
    notes: data.notes.flatMap((note) => {
      if (!note.personIds.includes(personId)) return [note];
      const remainingPersonIds = note.personIds.filter((id) => id !== personId);
      return remainingPersonIds.length > 0 ? [{ ...note, personIds: remainingPersonIds }] : [];
    }),
    memories: data.memories.filter((memory) => memory.personId !== personId),
    openLoops: data.openLoops.filter((loop) => loop.personId !== personId),
    nextMoves: data.nextMoves.filter((move) => move.personId !== personId),
    interactions: data.interactions.flatMap((interaction) => {
      if (!interaction.personIds.includes(personId)) return [interaction];
      const remainingPersonIds = interaction.personIds.filter((id) => id !== personId);
      return remainingPersonIds.length > 0 ? [{ ...interaction, personIds: remainingPersonIds }] : [];
    })
  };
}

export function getPersonDeleteImpact(data: CrmData, personId: string): PersonDeleteImpact {
  const person = data.people.find((candidate) => candidate.id === personId);
  const relatedNotes = data.notes.filter((note) => note.personIds.includes(personId));
  const relatedInteractions = data.interactions.filter((interaction) => interaction.personIds.includes(personId));

  return {
    personId,
    personName: person?.name ?? "Unknown person",
    notesRemoved: relatedNotes.filter((note) => note.personIds.length === 1).length,
    sharedNotesDetached: relatedNotes.filter((note) => note.personIds.length > 1).length,
    memoriesRemoved: data.memories.filter((memory) => memory.personId === personId).length,
    openLoopsRemoved: data.openLoops.filter((loop) => loop.personId === personId).length,
    nextMovesRemoved: data.nextMoves.filter((move) => move.personId === personId).length,
    interactionsRemoved: relatedInteractions.filter((interaction) => interaction.personIds.length === 1).length,
    sharedInteractionsDetached: relatedInteractions.filter((interaction) => interaction.personIds.length > 1).length
  };
}

export function deleteRelationshipNote(data: CrmData, noteId: string): CrmData {
  const note = data.notes.find((candidate) => candidate.id === noteId);
  if (!note) return data;

  const remainingNotes = data.notes.filter((candidate) => candidate.id !== noteId);
  const affectedPersonIds = new Set(note.personIds);

  return {
    ...data,
    notes: remainingNotes,
    memories: data.memories.filter((memory) => memory.sourceNoteId !== noteId),
    openLoops: data.openLoops.filter((loop) => loop.sourceNoteId !== noteId),
    people: data.people.map((person) => {
      if (!affectedPersonIds.has(person.id)) return person;
      return {
        ...person,
        lastContactAt: latestContactAt(remainingNotes, person.id),
        updatedAt: new Date().toISOString()
      };
    })
  };
}

export function addRelationshipNote(
  data: CrmData,
  note: RelationshipNote,
  updatedAt = new Date().toISOString()
): CrmData {
  return {
    ...data,
    notes: [note, ...data.notes],
    people: data.people.map((person) =>
      note.personIds.includes(person.id) ? { ...person, lastContactAt: note.occurredAt, updatedAt } : person
    )
  };
}

export function saveAcceptedSuggestions(
  data: CrmData,
  suggestions: ExtractionSuggestion[],
  acceptedIds: string[],
  sourceNoteId: string
): CrmData {
  const accepted = suggestions
    .filter((suggestion) => acceptedIds.includes(suggestion.id))
    .map((suggestion) => acceptSuggestion(suggestion, sourceNoteId));

  return {
    ...data,
    memories: [...accepted.filter(isMemory), ...data.memories],
    openLoops: [...accepted.filter(isOpenLoop), ...data.openLoops]
  };
}

export function updateLoopStatus(data: CrmData, loopId: string, status: OpenLoop["status"]): CrmData {
  return {
    ...data,
    openLoops: data.openLoops.map((loop) => (loop.id === loopId ? { ...loop, status } : loop))
  };
}

export function updateNextMoveStatus(data: CrmData, moveId: string, status: NextMove["status"]): CrmData {
  return {
    ...data,
    nextMoves: data.nextMoves.map((move) => (move.id === moveId ? { ...move, status } : move))
  };
}

export function addNextMoveRecord(data: CrmData, move: NextMove): CrmData {
  return {
    ...data,
    nextMoves: [move, ...data.nextMoves]
  };
}

function isMemory(item: Memory | OpenLoop): item is Memory {
  return "confirmed" in item;
}

function isOpenLoop(item: Memory | OpenLoop): item is OpenLoop {
  return "status" in item;
}

function latestContactAt(notes: RelationshipNote[], personId: string) {
  return notes
    .filter((note) => note.personIds.includes(personId))
    .map((note) => note.occurredAt)
    .sort((a, b) => b.localeCompare(a))[0];
}
