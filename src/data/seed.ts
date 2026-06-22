import type { CrmData, Memory, NextMove, OpenLoop, Person, RelationshipNote } from "../types";

const now = new Date("2026-06-22T08:00:00.000Z");

const daysAgo = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

const daysFromNow = (days: number) => {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const seedPeople: Person[] = [
  {
    id: "p-ada",
    name: "Ada Nkrumah",
    aliases: ["A"],
    relationshipTypes: ["friend", "collaborator"],
    city: "Austin",
    timezone: "America/Chicago",
    contactMethods: [{ type: "signal", value: "Ada" }],
    importance: 5,
    warmth: "warm",
    trust: 5,
    strategicRelevance: 4,
    sensitivity: "normal",
    lastContactAt: daysAgo(9),
    nextContactAt: daysFromNow(4),
    summary: "Product-minded friend who gives crisp feedback and likes precise asks.",
    createdAt: daysAgo(120),
    updatedAt: daysAgo(9)
  },
  {
    id: "p-jules",
    name: "Jules Moreno",
    aliases: ["J"],
    relationshipTypes: ["friend", "community"],
    city: "New York",
    timezone: "America/New_York",
    contactMethods: [{ type: "instagram", value: "@julesm" }],
    importance: 4,
    warmth: "cool",
    trust: 3,
    strategicRelevance: 3,
    sensitivity: "sensitive",
    lastContactAt: daysAgo(64),
    nextContactAt: daysAgo(8),
    summary: "Warm in person, easy to lose in the noise. Direct plans work better than vague check-ins.",
    createdAt: daysAgo(80),
    updatedAt: daysAgo(64)
  },
  {
    id: "p-mira",
    name: "Mira Chen",
    aliases: ["MC"],
    relationshipTypes: ["mentor"],
    city: "San Francisco",
    timezone: "America/Los_Angeles",
    contactMethods: [{ type: "email", value: "mira@example.com" }],
    importance: 5,
    warmth: "neutral",
    trust: 4,
    strategicRelevance: 5,
    sensitivity: "normal",
    lastContactAt: daysAgo(38),
    nextContactAt: daysFromNow(11),
    summary: "Sharp mentor. Appreciates concise updates and clear decision points.",
    createdAt: daysAgo(200),
    updatedAt: daysAgo(38)
  },
  {
    id: "p-niko",
    name: "Niko Alvarez",
    aliases: [],
    relationshipTypes: ["friend"],
    city: "Los Angeles",
    timezone: "America/Los_Angeles",
    contactMethods: [{ type: "phone", value: "555-0134" }],
    importance: 3,
    warmth: "hot",
    trust: 4,
    strategicRelevance: 2,
    sensitivity: "private",
    lastContactAt: daysAgo(4),
    nextContactAt: daysFromNow(16),
    summary: "High warmth, currently carrying family stress. Keep plans low-pressure.",
    createdAt: daysAgo(90),
    updatedAt: daysAgo(4)
  },
  {
    id: "p-sana",
    name: "Sana Patel",
    aliases: [],
    relationshipTypes: ["collaborator", "community"],
    city: "London",
    timezone: "Europe/London",
    contactMethods: [{ type: "email", value: "sana@example.com" }],
    importance: 4,
    warmth: "warm",
    trust: 4,
    strategicRelevance: 5,
    sensitivity: "normal",
    lastContactAt: daysAgo(18),
    nextContactAt: daysFromNow(2),
    summary: "Great for thoughtful intros. Likes context upfront, not surprise asks.",
    createdAt: daysAgo(160),
    updatedAt: daysAgo(18)
  },
  {
    id: "p-theo",
    name: "Theo Brooks",
    aliases: [],
    relationshipTypes: ["weak_tie", "collaborator"],
    city: "Chicago",
    timezone: "America/Chicago",
    contactMethods: [{ type: "twitter", value: "@theob" }],
    importance: 3,
    warmth: "neutral",
    trust: 2,
    strategicRelevance: 4,
    sensitivity: "normal",
    lastContactAt: daysAgo(52),
    summary: "Interesting operator. Needs a specific reason to reconnect.",
    createdAt: daysAgo(70),
    updatedAt: daysAgo(52)
  },
  {
    id: "p-lena",
    name: "Lena Okafor",
    aliases: ["Len"],
    relationshipTypes: ["friend", "family"],
    city: "Toronto",
    timezone: "America/Toronto",
    contactMethods: [{ type: "whatsapp", value: "Lena" }],
    importance: 5,
    warmth: "warm",
    trust: 5,
    strategicRelevance: 1,
    sensitivity: "private",
    lastContactAt: daysAgo(31),
    nextContactAt: daysAgo(1),
    summary: "Protected relationship. Low tactics, high care.",
    createdAt: daysAgo(400),
    updatedAt: daysAgo(31)
  },
  {
    id: "p-ravi",
    name: "Ravi Shah",
    aliases: [],
    relationshipTypes: ["client", "collaborator"],
    city: "Seattle",
    timezone: "America/Los_Angeles",
    contactMethods: [{ type: "email", value: "ravi@example.com" }],
    importance: 3,
    warmth: "cool",
    trust: 3,
    strategicRelevance: 4,
    sensitivity: "sensitive",
    lastContactAt: daysAgo(23),
    nextContactAt: daysFromNow(6),
    summary: "Collaborative but guarded. Keep promises explicit.",
    createdAt: daysAgo(45),
    updatedAt: daysAgo(23)
  },
  {
    id: "p-iona",
    name: "Iona Reed",
    aliases: [],
    relationshipTypes: ["romantic"],
    city: "Portland",
    timezone: "America/Los_Angeles",
    contactMethods: [{ type: "signal", value: "Iona" }],
    importance: 4,
    warmth: "neutral",
    trust: 3,
    strategicRelevance: 1,
    sensitivity: "private",
    lastContactAt: daysAgo(14),
    summary: "Ambiguous and sensitive. Avoid over-planning.",
    createdAt: daysAgo(30),
    updatedAt: daysAgo(14)
  },
  {
    id: "p-cam",
    name: "Camille Ortiz",
    aliases: ["Cam"],
    relationshipTypes: ["friend", "community"],
    city: "Miami",
    timezone: "America/New_York",
    contactMethods: [{ type: "instagram", value: "@camortiz" }],
    importance: 2,
    warmth: "hot",
    trust: 4,
    strategicRelevance: 3,
    sensitivity: "normal",
    lastContactAt: daysAgo(7),
    summary: "Connector energy. Likes spontaneous invites.",
    createdAt: daysAgo(75),
    updatedAt: daysAgo(7)
  }
];

export const seedNotes: RelationshipNote[] = [
  {
    id: "n-ada-1",
    personIds: ["p-ada"],
    occurredAt: daysAgo(9),
    sourceType: "call",
    rawText: "Ada is exploring a small advisory group and asked for two founder intros. Promised to send names by Friday. She prefers a tight memo before calls.",
    sensitivity: "normal",
    createdAt: daysAgo(9)
  },
  {
    id: "n-jules-1",
    personIds: ["p-jules"],
    occurredAt: daysAgo(64),
    sourceType: "dinner",
    rawText: "Jules seemed tired of open-ended hangouts. Remember to propose a real plan. Mentioned family health stuff, keep that private.",
    sensitivity: "private",
    createdAt: daysAgo(64)
  },
  {
    id: "n-mira-1",
    personIds: ["p-mira"],
    occurredAt: daysAgo(38),
    sourceType: "meeting",
    rawText: "Mira asked for a crisp update once the repo is live. She likes the awkward-useful positioning and warned against making it a sales CRM.",
    sensitivity: "normal",
    createdAt: daysAgo(38)
  },
  {
    id: "n-sana-1",
    personIds: ["p-sana"],
    occurredAt: daysAgo(18),
    sourceType: "call",
    rawText: "Sana can introduce me to two community operators if I send a one-paragraph context note. Follow up this week.",
    sensitivity: "normal",
    createdAt: daysAgo(18)
  },
  {
    id: "n-lena-1",
    personIds: ["p-lena"],
    occurredAt: daysAgo(31),
    sourceType: "call",
    rawText: "Lena said the last conversation helped. Do not turn this into a project. Send a small check-in and ask about the garden.",
    sensitivity: "private",
    createdAt: daysAgo(31)
  }
];

export const seedMemories: Memory[] = [
  {
    id: "m-ada-1",
    personId: "p-ada",
    sourceNoteId: "n-ada-1",
    text: "Prefers a tight memo before calls.",
    category: "preference",
    confidence: "high",
    sensitivity: "normal",
    confirmed: true
  },
  {
    id: "m-jules-1",
    personId: "p-jules",
    sourceNoteId: "n-jules-1",
    text: "Responds better to concrete plans than vague check-ins.",
    category: "preference",
    confidence: "medium",
    sensitivity: "normal",
    confirmed: true
  },
  {
    id: "m-jules-2",
    personId: "p-jules",
    sourceNoteId: "n-jules-1",
    text: "Family health context should be kept private.",
    category: "boundary",
    confidence: "high",
    sensitivity: "private",
    confirmed: true
  },
  {
    id: "m-mira-1",
    personId: "p-mira",
    sourceNoteId: "n-mira-1",
    text: "Warned against generic sales CRM language.",
    category: "history",
    confidence: "high",
    sensitivity: "normal",
    confirmed: true
  },
  {
    id: "m-lena-1",
    personId: "p-lena",
    sourceNoteId: "n-lena-1",
    text: "Keep the relationship protected and uninstrumental.",
    category: "boundary",
    confidence: "high",
    sensitivity: "private",
    confirmed: true
  }
];

export const seedOpenLoops: OpenLoop[] = [
  {
    id: "o-ada-1",
    personId: "p-ada",
    sourceNoteId: "n-ada-1",
    title: "Send two founder intros",
    description: "Ada asked for names for her advisory group.",
    dueAt: daysAgo(3),
    status: "open"
  },
  {
    id: "o-sana-1",
    personId: "p-sana",
    sourceNoteId: "n-sana-1",
    title: "Send one-paragraph context note",
    description: "Unlock two operator intros.",
    dueAt: daysFromNow(2),
    status: "planned"
  },
  {
    id: "o-lena-1",
    personId: "p-lena",
    sourceNoteId: "n-lena-1",
    title: "Small check-in",
    description: "Ask about the garden without making it a project.",
    dueAt: daysAgo(1),
    status: "open"
  }
];

export const seedNextMoves: NextMove[] = [
  {
    id: "x-ada-1",
    personId: "p-ada",
    type: "intro",
    draft: "Send Ada a short note with two founder names and why each might fit her advisory group.",
    rationale: "She made a specific ask and already values concise context.",
    risk: "low",
    status: "queued"
  },
  {
    id: "x-jules-1",
    personId: "p-jules",
    type: "invite",
    draft: "Want to grab ramen Thursday or Friday? Real plan, no vague cloud of intentions.",
    rationale: "A specific invite respects the last signal.",
    risk: "medium",
    status: "idea"
  },
  {
    id: "x-lena-1",
    personId: "p-lena",
    type: "check_in",
    draft: "Thinking of you. How is the garden experiment going?",
    rationale: "Warm, small, and not extractive.",
    risk: "low",
    status: "idea"
  }
];

export const seedData: CrmData = {
  people: seedPeople,
  notes: seedNotes,
  memories: seedMemories,
  openLoops: seedOpenLoops,
  nextMoves: seedNextMoves,
  interactions: []
};
