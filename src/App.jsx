import {
  Landing,
  Workspace,
  Dashboard,
  Collaborations,
  FinancialRecords,
  Affiliates,
  Badges,
  SimplePage,
} from "./pages/Experience";
import { Discovery } from "./pages/Discovery";
import { Profile } from "./pages/PublicProfile";
import { RequestDialog } from "./components/RequestDialog";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import {
  Compass,
  Bookmark,
  UserRound,
  X,
  BriefcaseBusiness,
  Menu,
} from "lucide-react";
import Brand from "./components/Brand";
import { people } from "./data/people";
import { navigation } from "./data/navigation";
import "./social.css";

function readLocal(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return Array.isArray(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
}
function useLocal(key, initial) {
  const [value, setValue] = useState(() => readLocal(key, initial));
  const [error, setError] = useState("");
  function update(next) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setError("");
    } catch {
      setError(
        "Browser storage is unavailable. Your changes last only until this page reloads.",
      );
    }
  }
  return [value, update, error];
}
function SocialApp() {
  const { role = "creator", page = "discover", id } = useParams();
  const [more, setMore] = useState(false);
  const [saved, setSaved, saveError] = useLocal(`mm-saved-${role}`, []);
  const [requests, setRequests, requestError] = useLocal(
    `mm-requests-${role}`,
    [],
  );
  const [target, setTarget] = useState(null);
  const [notice, setNotice] = useState("");
  const mainRef = useRef(null);
  const isBusiness = role === "business";
  useEffect(() => {
    setMore(false);
    setNotice("");
    document.title = `${id ? "Profile" : page === "discover" ? "Discover people" : page} | Money Machine`;
  }, [role, page, id]);
  if (!["creator", "business"].includes(role)) return <Missing />;
  const base = `/${role}`;
  const person = people.find((p) => p.id === id);
  function toggleSave(personId) {
    setSaved(
      saved.includes(personId)
        ? saved.filter((x) => x !== personId)
        : [...saved, personId],
    );
  }
  function submitRequest(message) {
    const next = {
      id: Date.now(),
      personId: target.id,
      message,
      status: "Draft",
      kind: isBusiness ? "Invitation" : "Application",
    };
    setRequests([...requests, next]);
    setTarget(null);
    setNotice(`${next.kind} saved as a local demo draft. Nothing was sent.`);
  }
  const module = navigation(role).find((item) => item.path === page);
  return (
    <div className="social-app">
      <a
        className="skip-link"
        href="#social-main"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="social-header">
        <Link to={`${base}/discover`} aria-label="Money Machine home">
          <Brand />
        </Link>
        <nav aria-label="Primary navigation">
          <NavLink to={`${base}/discover`}>
            <Compass size={20} />
            <span>Discover</span>
          </NavLink>
          <NavLink to={`${base}/saved`}>
            <Bookmark size={20} />
            <span>Saved</span>
          </NavLink>
          <NavLink to={`${base}/requests`}>
            <BriefcaseBusiness size={20} />
            <span>My collaborations</span>
          </NavLink>
        </nav>
        <div className="social-tools">
          <label>
            <span className="sr-only">Preview as</span>
            <select
              aria-label="Preview role"
              value={role}
              onChange={(e) => {
                window.location.hash = `/${e.target.value}/discover`;
              }}
            >
              <option value="creator">Creator</option>
              <option value="business">Business</option>
            </select>
          </label>
          <button
            className="icon-button"
            onClick={() => setMore(!more)}
            aria-label="More navigation"
            aria-expanded={more}
            aria-controls="more-nav"
          >
            {more ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {more && (
        <nav id="more-nav" className="more-nav" aria-label="More navigation">
          {navigation(role)
            .filter(
              (x) => !["overview", "discover", "shortlists"].includes(x.path),
            )
            .map((x) => (
              <Link key={x.path} to={`${base}/${x.path}`}>
                {x.label}
              </Link>
            ))}
        </nav>
      )}
      <div className="social-demo">
        Interactive prototype · Fictional profiles & sample work · Nothing is
        sent or paid
      </div>
      <div
        id="social-main"
        className="social-main"
        ref={mainRef}
        tabIndex="-1"
      >
        {notice && (
          <p className="notice" role="status">
            {notice}
          </p>
        )}
        {(saveError || requestError) && (
          <p role="alert">{saveError || requestError}</p>
        )}
        {id ? (
          person ? (
            <Profile
              person={person}
              role={role}
              saved={saved.includes(person.id)}
              onSave={() => toggleSave(person.id)}
              onRequest={() => setTarget(person)}
            />
          ) : (
            <Missing />
          )
        ) : page === "discover" || page === "saved" ? (
          <Discovery
            role={role}
            saved={saved}
            savedOnly={page === "saved"}
            onSave={toggleSave}
          />
        ) : page === "requests" ? (
          <section>
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h1>Conversations start with an idea.</h1>
            <p className="muted">
              Local demo applications and invitations. These drafts have not
              been sent.
            </p>
            {requests.length ? (
              requests.map((r) => (
                <article className="request-card" key={r.id}>
                  <div>
                    <span className="pill">
                      {r.kind} · {r.status}
                    </span>
                    <h2>{people.find((p) => p.id === r.personId)?.name}</h2>
                    <p>{r.message}</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() =>
                      setRequests(requests.filter((x) => x.id !== r.id))
                    }
                  >
                    Delete draft
                  </button>
                </article>
              ))
            ) : (
              <div className="social-empty">
                <BriefcaseBusiness size={32} />
                <h2>Your next collaboration starts here.</h2>
                <p>
                  Find a profile and{" "}
                  {isBusiness
                    ? "invite a creator"
                    : "apply to a business opportunity"}{" "}
                  to save your first draft.
                </p>
                <Link className="button" to={`${base}/discover`}>
                  Discover people
                </Link>
              </div>
            )}
          </section>
        ) : module ? (
          <section className="social-empty">
            <module.icon size={34} />
            <h1>{module.label}</h1>
            <p>{module.description}</p>
            <span className="pill">Planned feature</span>
            <p>This secondary tool will be added in a later step.</p>
            <Link className="button secondary" to={`${base}/discover`}>
              Back to discovery
            </Link>
          </section>
        ) : (
          <Missing />
        )}
        <footer className="social-footer">
          <Brand />
          <span>Find your people. Make something meaningful.</span>
          <small>
            Demo profiles are shown as opted in. Real public profiles will
            require consent.
          </small>
        </footer>
      </div>
      <nav className="social-bottom" aria-label="Mobile navigation">
        <NavLink to={`${base}/discover`}>
          <Compass size={22} />
          Discover
        </NavLink>
        <NavLink to={`${base}/saved`}>
          <Bookmark size={22} />
          Saved
        </NavLink>
        <NavLink to={`${base}/requests`}>
          <BriefcaseBusiness size={22} />
          Collaborations
        </NavLink>
        <NavLink to={`${base}/profile`}>
          <UserRound size={22} />
          Profile
        </NavLink>
      </nav>
      {target && (
        <RequestDialog
          person={target}
          role={role}
          onClose={() => setTarget(null)}
          onSubmit={submitRequest}
        />
      )}
    </div>
  );
}
function Missing() {
  const { role } = useParams();
  const home = role === "business" ? "business" : "creator";
  return (
    <section className="social-empty">
      <h1>We couldn’t find that page.</h1>
      <Link className="button" to={`/${home}/dashboard`}>
        Back to your overview
      </Link>
    </section>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/:role/overview" element={<OldOverview />} />
      <Route path="/:role/people/:id" element={<RoleApp />} />
      <Route path="/:role/:page" element={<RoleApp />} />
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}
function OldOverview() {
  const { role } = useParams();
  return <Navigate to={`/${role}/dashboard`} replace />;
}

function RoleApp() {
  const { role, page } = useParams();
  if (!["creator", "business"].includes(role)) return <Missing />;
  const pages = {
    dashboard: <Dashboard />,
    collaborations: <Collaborations />,
    finances: <FinancialRecords />,
    badges: <Badges />,
    messages: <SimplePage />,
    agreements: <SimplePage />,
    profile: <SimplePage />,
    settings: <SimplePage />,
  };
  if (role === "business") pages.affiliate = <Affiliates />;
  return <Workspace>{pages[page] || <SocialApp key={role} />}</Workspace>;
}
