import { ChevronDown, Copy, RefreshCcw, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { buildPosterText, DossierPoster, type DossierPosterVariant } from "./DossierPoster";
import type { CrmData, Person } from "../types";

const posterVariants: DossierPosterVariant[] = [
  {
    stamp: "Not Evidence",
    warning: "Vibes Require Supervision",
    alias: "Person Who Absolutely Mentioned That Thing Once",
    recommendation: "Recommended approach: act normal for up to seven consecutive minutes.",
    ad: "FriendWatch Office Edition says:",
    coupon: "Print one fake concern and get two decorative disclaimers free.",
    officeNote: "Prepared by a machine that has never successfully attended brunch."
  },
  {
    stamp: "Social Debt Detected",
    warning: "Calendar Courage Running Low",
    alias: "Subject With Unresolved Soft Plans",
    recommendation: "Recommended approach: send the kind message before turning it into a municipal project.",
    ad: "Limited time office panic:",
    coupon: "Redeem this rectangle for zero legal standing and one tiny laugh.",
    officeNote: "The office recommends not bringing this poster to dinner unless everyone is already laughing."
  },
  {
    stamp: "Unverified But Funny",
    warning: "Do Not Overplay The Bit",
    alias: "Associate Of Unclear Snack Preferences",
    recommendation: "Recommended approach: remember the thing, then pretend you are naturally thoughtful.",
    ad: "BuddyScan bonus meter:",
    coupon: "Visible fields only. Gossip sold separately, never here.",
    officeNote: "This poster contains decorative nonsense and no hidden score."
  }
];

export function DossierPosterLab({
  data,
  person,
  onClose
}: {
  data: CrmData;
  person: Person;
  onClose: () => void;
}) {
  const [variantIndex, setVariantIndex] = useState(() => stableVariantIndex(person.id));
  const [message, setMessage] = useState(() => previewMessageFor(person));
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    safety: false,
    context: false,
    finePrint: false
  });
  const variant = posterVariants[variantIndex % posterVariants.length];
  const memoryCount = useMemo(
    () => data.memories.filter((memory) => memory.personId === person.id && memory.confirmed).length,
    [data.memories, person.id]
  );
  const openLoopCount = useMemo(
    () => data.openLoops.filter((loop) => loop.personId === person.id && loop.status !== "done").length,
    [data.openLoops, person.id]
  );
  const relationshipLabels = person.relationshipTypes.map(label).join(", ") || "Not set";
  const sensitivityLabel = label(person.sensitivity);
  const hasSensitiveProfile = person.sensitivity !== "normal";
  const contextItems = [
    ["Name", person.name],
    ["City", person.city ?? "Not set"],
    ["Labels", relationshipLabels],
    ["Vibe", label(person.warmth)],
    ["Trust", `${person.trust}/5`],
    ["Sensitivity", sensitivityLabel],
    ["Memories", String(memoryCount)],
    ["Open loops", String(openLoopCount)],
    ["Summary", person.sensitivity === "normal" ? person.summary?.trim() || "Not set" : "Withheld by privacy alibi"]
  ];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function shufflePoster() {
    setVariantIndex((current) => current + 1);
    setMessage("Bureau nonsense shuffled. Facts untouched, dignity negotiable.");
  }

  async function copyPoster() {
    const text = buildPosterText({ person, memoryCount, openLoopCount, variant });

    if (!navigator.clipboard) {
      setMessage("Copy failed. The clipboard left through a fake emergency exit.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setMessage("Poster text copied. Still not evidence, but now portable.");
    } catch {
      setMessage("Copy failed. The clipboard refused to cooperate with the bit.");
    }
  }

  function toggleSection(section: string) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  }

  return (
    <div className="poster-lab-overlay" role="dialog" aria-modal="true" aria-labelledby="poster-lab-title">
      <section className="poster-lab">
        <header className="poster-lab-chrome">
          <div>
            <span>BuddyScan 3000</span>
            <h2 id="poster-lab-title">Poster Lab</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close Poster Lab">
            <X size={17} />
          </button>
        </header>

        <div className="poster-lab-grid">
          <DossierPoster person={person} memoryCount={memoryCount} openLoopCount={openLoopCount} variant={variant} />

          <aside className="poster-lab-rail">
            <div className="poster-lab-actions">
              <button type="button" onClick={shufflePoster}>
                <RefreshCcw size={15} />
                Shuffle Bureau Nonsense
              </button>
              <button type="button" onClick={() => void copyPoster()}>
                <Copy size={15} />
                Copy Poster Text
              </button>
            </div>

            <p className="poster-lab-message" aria-live="polite">
              <span>{message}</span>
              <br />
              <span>Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence.</span>
            </p>

            <AccordionSection
              id="safety"
              title={hasSensitiveProfile ? "Privacy Boundary" : "Comedy Boundary"}
              open={openSections.safety}
              onToggle={() => toggleSection("safety")}
              className="poster-lab-warning"
            >
              <p>
                {hasSensitiveProfile
                  ? `${sensitivityLabel} profile: summary is withheld from the joke poster. Fake dossier art. Not memory, analysis, or evidence.`
                  : "Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence."}
              </p>
            </AccordionSection>

            <AccordionSection
              id="context"
              title="Context Receipt"
              open={openSections.context}
              onToggle={() => toggleSection("context")}
            >
              <dl className="poster-context-list">
                {contextItems.map(([name, value]) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <small>
                Preview uses visible profile fields, confirmed memory counts, and active open-loop counts only.
              </small>
              <small>No notes, contact values, social scraping, or private summaries are used.</small>
            </AccordionSection>

            <AccordionSection
              id="fine-print"
              title="Limited Time Nothing"
              open={openSections.finePrint}
              onToggle={() => toggleSection("finePrint")}
              className="poster-lab-coupon"
            >
              <p>Shuffle the bureau nonsense. It changes the poster, not the file.</p>
            </AccordionSection>
          </aside>
        </div>
      </section>
    </div>
  );
}

function AccordionSection({
  id,
  title,
  open,
  onToggle,
  className = "",
  children
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
  children: ReactNode;
}) {
  const panelId = `poster-lab-${id}-panel`;

  return (
    <section className={`poster-lab-card poster-lab-accordion ${className}`}>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span>{title}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div id={panelId} className="poster-lab-accordion-body">
          {children}
        </div>
      )}
    </section>
  );
}

function stableVariantIndex(value: string) {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0) % posterVariants.length;
}

function previewMessageFor(person: Person) {
  if (person.sensitivity !== "normal") {
    return `${label(person.sensitivity)} profile. Preview uses visible fields only; private summary stays behind the comedy velvet rope.`;
  }

  return "Preview-first mode. Generated locally, never saved, and absolutely not a robot errand.";
}

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
