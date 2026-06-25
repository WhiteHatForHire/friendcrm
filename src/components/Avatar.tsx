import type { Person } from "../types";

export function Avatar({ person, size = "normal" }: { person: Person; size?: "normal" | "small" }) {
  const initial = person.name.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <span className={`avatar ${size === "small" ? "avatar-small" : ""}`}>
      {person.profilePhotoUrl ? <img src={person.profilePhotoUrl} alt={`${person.name} profile`} /> : initial}
    </span>
  );
}
