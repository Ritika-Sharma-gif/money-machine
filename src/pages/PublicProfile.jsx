import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  MapPin,
  Grid3X3,
} from "lucide-react";
import { Artwork, Avatar } from "../components/PeopleArtwork";
function Profile({ person: p, role, saved, onSave, onRequest }) {
  const actionable = role !== p.role;
  return (
    <>
      <Link className="back-link" to={`/${role}/discover`}>
        <ArrowLeft size={17} />
        Back to people
      </Link>
      <section className="profile-top">
        <Avatar person={p} />
        <div className="profile-copy">
          <p className="eyebrow">
            {p.role.toUpperCase()} · FICTIONAL DEMO PROFILE
          </p>
          <h1>{p.name}</h1>
          <p className="profile-handle">
            @{p.handle}{" "}
            <span>
              <MapPin size={14} />
              {p.city}
            </span>
          </p>
          <p>{p.bio}</p>
          <div className="person-tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <div className="profile-actions">
          <span className="availability">{p.availability}</span>
          {actionable && (
            <button className="button" onClick={onRequest}>
              {role === "business"
                ? "Invite to collaborate"
                : "Apply to opportunity"}
              <ArrowUpRight size={17} />
            </button>
          )}
          <button
            className="button secondary"
            onClick={onSave}
            aria-pressed={saved}
          >
            <Bookmark size={16} />
            {saved ? "Saved privately" : "Save profile"}
          </button>
        </div>
      </section>
      {p.opportunity && (
        <section className="opportunity">
          <div>
            <p className="eyebrow">OPEN OPPORTUNITY · DEMO</p>
            <h2>{p.opportunity}</h2>
            <p>
              Sample brief: create an original short video introducing the
              brand. Scope, budget, usage rights, and deadlines must be agreed
              before work begins.
            </p>
          </div>
          {role === "creator" && (
            <button className="button" onClick={onRequest}>
              Apply
              <ArrowUpRight size={16} />
            </button>
          )}
        </section>
      )}
      <div className="portfolio-heading">
        <h2>
          <Grid3X3 size={18} />
          {p.role === "creator" ? "Selected work" : "From the brand"}
        </h2>
        <span>Illustrative samples · Not real published campaigns</span>
      </div>
      <div className="portfolio-grid">
        {p.work.map((work, i) => (
          <Artwork person={p} index={i} key={work} />
        ))}
      </div>
    </>
  );
}

export { Profile };
