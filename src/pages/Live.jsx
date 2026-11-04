// Screens that talk to the real backend (shown only when signed in).
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading, Panel } from "../components/Layout";
import { useAuth } from "../AuthContext";
import { api } from "../lib/api";

function useAction() {
  const [state, setState] = useState({ busy: false, error: "", note: "" });
  async function run(fn, note) {
    setState({ busy: true, error: "", note: "" });
    try {
      const out = await fn();
      setState({ busy: false, error: "", note: note || "Saved." });
      return out;
    } catch (e) {
      setState({ busy: false, error: e.message, note: "" });
      return null;
    }
  }
  return [state, run];
}

function Messages({ state }) {
  return (
    <>
      {state.error && <p role="alert" className="mm-error">{state.error}</p>}
      {state.note && <p role="status" className="mm-notice">{state.note}</p>}
    </>
  );
}

const csv = (list) => (list || []).join(", ");
const fromCsv = (t) => t.split(",").map((x) => x.trim()).filter(Boolean);

export function LiveProfile() {
  const { me, refresh } = useAuth();
  const [state, run] = useAction();
  const creator = me.user.accountType === "creator";

  if (!creator)
    return (
      <>
        <Heading eyebrow="YOUR ACCOUNT" title={me.organisations[0]?.name || me.user.displayName}
          description={`${me.user.accountType === "agency" ? "Agency" : "Business"} account · ${me.user.email}`} />
        <Panel title="Business profiles">
          <p>Creators build public profiles. Business and agency profiles that creators can browse are coming soon.</p>
        </Panel>
      </>
    );

  const p = me.profile;
  function save(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    run(async () => {
      await api("/api/profile", {
        method: "PUT",
        body: {
          headline: f.get("headline"), bio: f.get("bio"), city: f.get("city"),
          categories: fromCsv(f.get("categories")), languages: fromCsv(f.get("languages")),
        },
      });
      await refresh();
    }, "Profile saved.");
  }
  return (
    <>
      <Heading eyebrow="YOUR INTRODUCTION" title={me.user.displayName}
        description="This is what businesses see if you choose to be found." />
      <Panel title="Your profile"
        subtitle={p.discoverable ? "Discovery is on. Businesses can find you." : "Discovery is off. Nobody can find you in search yet."}
        action={<Link className="mm-quiet" to="/creator/settings">Change visibility ↗</Link>}>
        <form className="mm-form" onSubmit={save} key={JSON.stringify(p)}>
          <label>Headline
            <input name="headline" maxLength={140} defaultValue={p.headline} placeholder="e.g. Food and home storyteller" />
          </label>
          <label>About you
            <textarea name="bio" maxLength={1000} defaultValue={p.bio} />
          </label>
          <label>City
            <input name="city" maxLength={80} defaultValue={p.city} />
          </label>
          <label>Topics (separated by commas)
            <input name="categories" defaultValue={csv(p.categories)} placeholder="Food, Travel" />
          </label>
          <label>Languages (separated by commas)
            <input name="languages" defaultValue={csv(p.languages)} placeholder="English, Hindi" />
          </label>
          <Messages state={state} />
          <button className="mm-button" type="submit" disabled={state.busy}>Save profile</button>
        </form>
      </Panel>
    </>
  );
}

export function LiveSettings() {
  const { me, refresh } = useAuth();
  const [state, run] = useAction();
  const [blocks, setBlocks] = useState(null);
  const creator = me.user.accountType === "creator";

  const loadBlocks = useCallback(() => api("/api/blocks").then((d) => setBlocks(d.blocks)).catch(() => setBlocks([])), []);
  useEffect(() => { loadBlocks(); }, [loadBlocks]);

  const toggles = [
    ...(creator ? [
      ["profile", "discoverable", "Let businesses find me", "Off by default. Switch it off and your profile leaves search straight away.", me.profile?.discoverable],
      ["profile", "showcasePublic", "Show my public showcase page", "Only the work you choose. Earnings are never shown.", me.profile?.showcasePublic],
    ] : []),
    ["settings", "notifyOffers", "Offers and agreements", "Tell me when terms change.", me.settings?.notifyOffers],
    ["settings", "notifyMessages", "Messages", "Tell me when someone writes to me.", me.settings?.notifyMessages],
    ["settings", "notifyReminders", "Deadline reminders", "A nudge before work is due.", me.settings?.notifyReminders],
  ];
  function flip(kind, key, label, value) {
    run(async () => {
      await api(kind === "profile" ? "/api/profile" : "/api/settings", { method: "PUT", body: { [key]: value } });
      await refresh();
    }, `${label} turned ${value ? "on" : "off"}.`);
  }
  return (
    <>
      <Heading eyebrow="MAKE YOURSELF AT HOME" title="Settings"
        description="Choose who can find you, what you hear about, and who can contact you." />
      <Messages state={state} />
      <Panel title="Privacy and notifications" subtitle="Saved to your account. Every switch works right away.">
        {toggles.map(([kind, key, label, help, on]) => (
          <label className="mm-switch-row" key={key}>
            <span><strong>{label}</strong><small>{help}</small></span>
            <input type="checkbox" role="switch" checked={!!on} disabled={state.busy}
              onChange={(e) => flip(kind, key, label, e.target.checked)} />
          </label>
        ))}
      </Panel>
      <Panel title="Blocked accounts" subtitle="Blocking hides you from each other in search.">
        {blocks === null && <p className="mm-caption">Loading…</p>}
        {blocks?.length === 0 && <p className="mm-caption">You haven’t blocked anyone.</p>}
        {blocks?.map((b) => (
          <div className="mm-record-line" key={b.id}>
            <span>{b.displayName}</span>
            <button className="mm-quiet"
              onClick={() => run(async () => setBlocks((await api(`/api/blocks?userId=${b.id}`, { method: "DELETE" })).blocks), `${b.displayName} unblocked.`)}>
              Unblock
            </button>
          </div>
        ))}
      </Panel>
    </>
  );
}

// Business and agency accounts search creators who opted in.
export function LiveDirectory() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [rows, setRows] = useState(null);
  const [state, run] = useAction();

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (category.trim()) params.set("category", category.trim());
      api(`/api/discover?${params}`).then((d) => setRows(d.results)).catch((e) => { setRows([]); });
    }, 250);
    return () => clearTimeout(t);
  }, [q, category]);

  return (
    <>
      <Heading eyebrow="REAL PEOPLE, REAL PROFILES" title="Find creators"
        description="Only creators who chose to be found appear here." />
      <div className="mm-live-search">
        <input aria-label="Search creators" placeholder="Search names, topics or cities" value={q} onChange={(e) => setQ(e.target.value)} />
        <input aria-label="Filter by topic" placeholder="Topic, e.g. Food" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <Messages state={state} />
      {rows === null && <p className="mm-caption">Loading…</p>}
      {rows?.length === 0 && (
        <p className="mm-empty">
          No creators match yet. Profiles appear here only after a creator switches discovery on.
        </p>
      )}
      <div className="mm-live-grid">
        {rows?.map((r) => (
          <article className="mm-live-card" key={r.id}>
            <h2>{r.displayName}</h2>
            <p className="mm-live-headline">{r.headline}</p>
            {r.city && <small>{r.city}</small>}
            {r.bio && <p>{r.bio}</p>}
            <div className="mm-live-tags">{r.categories.map((c) => <span key={c}>{c}</span>)}</div>
            <button className="mm-quiet"
              onClick={() => confirm(`Block ${r.displayName}? You will no longer see each other in search.`) &&
                run(async () => { await api("/api/blocks", { method: "POST", body: { userId: r.id } }); setRows(rows.filter((x) => x.id !== r.id)); }, `${r.displayName} blocked.`)}>
              Block
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
