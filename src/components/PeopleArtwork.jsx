import { ArrowUpRight } from "lucide-react";
function Artwork({ person, index = 0 }) {
  return (
    <div
      className={`artwork ${person.tone} art-${index}`}
      aria-label={`Illustrative sample work by ${person.name}`}
    >
      <span className="art-label">{person.category} / SAMPLE WORK</span>
      <strong>{person.work[index]}</strong>
      <span className="art-shape" />
      <span className="art-byline">
        @{person.handle} <ArrowUpRight size={19} />
      </span>
    </div>
  );
}
function Avatar({ person }) {
  return (
    <span className={`person-avatar ${person.tone}`}>{person.initials}</span>
  );
}

export { Artwork, Avatar };
