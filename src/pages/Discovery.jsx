import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  SlidersHorizontal,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";
import { people, categories } from "../data/people";
import { Artwork, Avatar } from "../components/PeopleArtwork";
function Discovery({ role, saved, savedOnly, onSave }) {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const type = params.get("type") || "all";
  const category = params.get("interest") || "All interests";
  function update(key, value) {
    const next = new URLSearchParams(params);
    next.set(key, value);
    setParams(next, { replace: true });
  }
  const filtered = people.filter(
    (p) =>
      (!savedOnly || saved.includes(p.id)) &&
      (type === "all" || p.role === type) &&
      (category === "All interests" || p.tags.includes(category)) &&
      `${p.name} ${p.handle} ${p.tags.join(" ")} ${p.city}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="discovery-heading">
        <div>
          <p className="eyebrow">A LITTLE DISCOVERY. A LOT OF POSSIBILITY.</p>
          <h1>
            {savedOnly
              ? "Your kind of people."
              : "Find your next great connection."}
          </h1>
          <p>
            {savedOnly
              ? "A private collection of profiles you want to come back to."
              : "Meet the creators and businesses making things happen."}
          </p>
        </div>
        <span className="discovery-note">
          Good work starts
          <br />
          with the right people.
          <ArrowUpRight size={25} />
        </span>
      </div>
      <div className="search-bar">
        <Search size={23} />
        <input
          aria-label="Search people"
          placeholder="Search names, @usernames, interests or cities"
          value={query}
          onChange={(e) => update("q", e.target.value)}
        />
        {query && (
          <button
            className="icon-button"
            aria-label="Clear search"
            onClick={() => update("q", "")}
          >
            <X size={18} />
          </button>
        )}
        <span className="search-hint">
          <SlidersHorizontal size={18} />
          Find your fit
        </span>
      </div>
      <div className="filter-row">
        <div className="role-tabs" aria-label="Profile type">
          {[
            ["all", "Everyone"],
            ["creator", "Creators"],
            ["business", "Businesses"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={type === value}
              className={type === value ? "selected" : ""}
              onClick={() => update("type", value)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="interest-picker">
          <span>Interest</span>
          <select
            aria-label="Filter by interest"
            value={category}
            onChange={(e) => update("interest", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="results-heading">
        <h2>
          {savedOnly
            ? "Saved profiles"
            : query
              ? "Search results"
              : "People to know"}
        </h2>
        <span role="status">
          {filtered.length} {filtered.length === 1 ? "profile" : "profiles"} ·
          Demo directory
        </span>
      </div>
      {filtered.length ? (
        <div className="people-grid">
          {filtered.map((p) => (
            <article className="person-card" key={p.id}>
              <Link className="work-link" to={`/${role}/people/${p.id}`}>
                <Artwork person={p} />
              </Link>
              <button
                className={`save-person ${saved.includes(p.id) ? "is-saved" : ""}`}
                aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
                aria-pressed={saved.includes(p.id)}
                onClick={() => onSave(p.id)}
              >
                <Bookmark
                  size={19}
                  fill={saved.includes(p.id) ? "currentColor" : "none"}
                />
              </button>
              <Link className="person-identity" to={`/${role}/people/${p.id}`}>
                <Avatar person={p} />
                <div>
                  <h3>{p.name}</h3>
                  <span>@{p.handle}</span>
                </div>
                <ArrowUpRight size={19} />
              </Link>
              <div className="person-meta">
                <span>
                  {p.role === "creator" ? "Creator" : "Business"} · {p.city}
                </span>
                <span>{p.category}</span>
              </div>
              <p className="person-headline">{p.headline}</p>
              <div className="person-tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="social-empty">
          <Search size={30} />
          <h2>
            {savedOnly && !saved.length
              ? "Your saved collection starts here."
              : "No matching profiles yet."}
          </h2>
          <p>
            {savedOnly && !saved.length
              ? "Tap the bookmark on a profile to save it privately."
              : "Try another name, city, or interest."}
          </p>
          <button className="button secondary" onClick={() => setParams({})}>
            Clear filters
          </button>
          {savedOnly && (
            <Link className="text-button" to={`/${role}/discover`}>
              Explore people
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export { Discovery };
