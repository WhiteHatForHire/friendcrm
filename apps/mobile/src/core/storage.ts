import AsyncStorage from "@react-native-async-storage/async-storage";

import { seedData } from "./seed";
import type { CrmData, Person } from "./types";

export const MOBILE_STORAGE_KEY = "friend-crm:mobile:data:v1";
export const MOBILE_EXPORT_SCHEMA_VERSION = 1;

export type MobileExportEnvelope = {
  schemaVersion: typeof MOBILE_EXPORT_SCHEMA_VERSION;
  exportedAt: string;
  app: "friend-crm-mobile";
  data: CrmData;
};

export function cloneData(data: CrmData): CrmData {
  return JSON.parse(JSON.stringify(data)) as CrmData;
}

export function demoData(): CrmData {
  return cloneData(seedData);
}

/**
 * Keeps demo-only controls tied to the bundled sample people, not merely to
 * the presence of any local record. A person added after clearing the sample
 * desk is real local work and must not make the app claim demo data returned.
 */
export function hasDemoPeople(data: CrmData) {
  const samplePersonIds = new Set(seedData.people.map((person) => person.id));
  return data.people.some((person) => samplePersonIds.has(person.id));
}

export async function loadData(): Promise<CrmData> {
  const stored = await AsyncStorage.getItem(MOBILE_STORAGE_KEY);
  if (!stored) return demoData();

  try {
    const parsed = JSON.parse(stored) as unknown;
    if (isCrmData(parsed)) return parsed;
    if (isMobileExportEnvelope(parsed)) return parsed.data;
  } catch {
    return demoData();
  }

  return demoData();
}

export async function saveData(data: CrmData) {
  await AsyncStorage.setItem(MOBILE_STORAGE_KEY, JSON.stringify(data));
}

export async function resetToDemoData() {
  const fresh = demoData();
  await saveData(fresh);
  return fresh;
}

export async function clearLocalData() {
  await AsyncStorage.removeItem(MOBILE_STORAGE_KEY);
}

export function createMobileExport(data: CrmData): MobileExportEnvelope {
  return {
    schemaVersion: MOBILE_EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: "friend-crm-mobile",
    data
  };
}

export function exportJson(data: CrmData) {
  return JSON.stringify(createMobileExport(data), null, 2);
}

export function importJson(raw: string): CrmData {
  const parsed = JSON.parse(raw) as unknown;
  if (isMobileExportEnvelope(parsed)) return parsed.data;
  if (isCrmData(parsed)) return parsed;
  throw new Error("That file does not look like a Friend CRM mobile export.");
}

export function makeId(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function newPerson(name: string): Person {
  const now = new Date().toISOString();
  return {
    id: makeId("p"),
    name,
    aliases: [],
    relationshipTypes: ["friend"],
    contactMethods: [],
    importance: 3,
    warmth: "neutral",
    trust: 3,
    strategicRelevance: 3,
    sensitivity: "normal",
    createdAt: now,
    updatedAt: now
  };
}

function isMobileExportEnvelope(value: unknown): value is MobileExportEnvelope {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MobileExportEnvelope>;
  return candidate.app === "friend-crm-mobile" && candidate.schemaVersion === MOBILE_EXPORT_SCHEMA_VERSION && isCrmData(candidate.data);
}

function isCrmData(value: unknown): value is CrmData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CrmData>;
  return (
    Array.isArray(candidate.people) &&
    Array.isArray(candidate.notes) &&
    Array.isArray(candidate.memories) &&
    Array.isArray(candidate.openLoops) &&
    Array.isArray(candidate.nextMoves) &&
    Array.isArray(candidate.interactions)
  );
}
