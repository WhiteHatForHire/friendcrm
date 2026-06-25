import { Avatar } from "./Avatar";
import { daysBetween } from "../lib/insights";
import type { Person, Sensitivity } from "../types";

export type DossierPosterVariant = {
  stamp: string;
  warning: string;
  alias: string;
  recommendation: string;
  ad: string;
  coupon: string;
  officeNote: string;
};

export function DossierPoster({
  person,
  memoryCount,
  openLoopCount,
  variant
}: {
  person: Person;
  memoryCount: number;
  openLoopCount: number;
  variant: DossierPosterVariant;
}) {
  const lastSeen = person.lastContactAt ? `${daysBetween(person.lastContactAt)}d ago` : "Unknown, which feels convenient";
  const nextNudge = person.nextContactAt ?? "No date. Bold strategy.";
  const safeSummary = safeSummaryForPoster(person.summary, person.sensitivity);

  return (
    <article className="dossier-poster" aria-label={`${person.name} fake dossier poster`}>
      <div className="poster-browser-bar">
        <span>www.buddyscan3000.biz/person-of-interest</span>
        <strong>LOCAL ONLY</strong>
      </div>

      <div className="poster-masthead">
        <div>
          <span className="poster-kicker">BuddyScan 3000 Office Edition</span>
          <h3>{person.name} Is Currently Known</h3>
        </div>
        <span className="poster-verified">Verified Probably</span>
      </div>

      <div className="poster-main">
        <div className="poster-photo-stack">
          <div className="poster-photo">
            <Avatar person={person} />
          </div>
          <span className="poster-paperclip" aria-hidden="true" />
          <span className="poster-stamp">{variant.stamp}</span>
        </div>

        <div className="poster-file">
          <dl>
            <div>
              <dt>Known Alias</dt>
              <dd>{variant.alias}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{person.city ?? "Filed under: somewhere"}</dd>
            </div>
            <div>
              <dt>Social Labels</dt>
              <dd>{person.relationshipTypes.map(label).join(" / ")}</dd>
            </div>
            <div>
              <dt>Vibe</dt>
              <dd>{label(person.warmth)}</dd>
            </div>
            <div>
              <dt>Trust Dots</dt>
              <dd>{person.trust}/5 suspicious blue dots</dd>
            </div>
            <div>
              <dt>Last Seen</dt>
              <dd>{lastSeen}</dd>
            </div>
            <div>
              <dt>Next Nudge</dt>
              <dd>{nextNudge}</dd>
            </div>
            <div>
              <dt>Unfinished Business</dt>
              <dd>{openLoopCount} loose thread{openLoopCount === 1 ? "" : "s"}</dd>
            </div>
            <div>
              <dt>Things Remembered</dt>
              <dd>{memoryCount} receipt{memoryCount === 1 ? "" : "s"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="poster-tabloid-grid">
        <section className="poster-warning">
          <strong>{variant.warning}</strong>
          <span>{variant.recommendation}</span>
        </section>
        <section className="poster-ad">
          <strong>{variant.ad}</strong>
          <span>{variant.coupon}</span>
        </section>
      </div>

      <section className="poster-summary">
        <strong>Official Story, Sanitized For The Poster Department</strong>
        <p>{safeSummary}</p>
      </section>

      <footer>
        <strong>{variant.officeNote}</strong>
        <span>Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence.</span>
      </footer>
    </article>
  );
}

export function buildPosterText({
  person,
  memoryCount,
  openLoopCount,
  variant
}: {
  person: Person;
  memoryCount: number;
  openLoopCount: number;
  variant: DossierPosterVariant;
}) {
  return [
    "BuddyScan 3000 Office Edition",
    `${person.name} Is Currently Known`,
    "",
    `Known alias: ${variant.alias}`,
    `City: ${person.city ?? "Filed under: somewhere"}`,
    `Social labels: ${person.relationshipTypes.map(label).join(" / ")}`,
    `Vibe: ${label(person.warmth)}`,
    `Trust dots: ${person.trust}/5 suspicious blue dots`,
    `Unfinished business: ${openLoopCount} loose thread${openLoopCount === 1 ? "" : "s"}`,
    `Things remembered: ${memoryCount} receipt${memoryCount === 1 ? "" : "s"}`,
    `Stamp: ${variant.stamp}`,
    `Warning: ${variant.warning}`,
    `Recommendation: ${variant.recommendation}`,
    "",
    `Official story: ${safeSummaryForPoster(person.summary, person.sensitivity)}`,
    "",
    "Fake dossier art. For comedy only. Not memory. Not analysis. Not evidence."
  ].join("\n");
}

function safeSummaryForPoster(summary: string | undefined, sensitivity: Sensitivity) {
  if (sensitivity !== "normal") {
    return "Summary withheld by the Privacy Alibi desk. The poster machine can cope with fewer snacks.";
  }

  return summary?.trim() || "No official story supplied. The bureau is improvising with visible labels only.";
}

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
