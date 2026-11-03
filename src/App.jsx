import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ArrowLeft, Menu, X } from "lucide-react";
import Brand from "./components/Brand";
import Placeholder from "./components/Placeholder";
import Overview from "./pages/Overview";
import { navigation } from "./data/navigation";

function Workspace() {
  const { role, page = "overview" } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const validRole = role === "creator" || role === "business";
  const links = navigation(role);
  const active = links.find((item) => item.path === page);
  useEffect(() => {
    setMenuOpen(false);
    document.title = `${active?.label || "Page not found"} | Money Machine`;
  }, [location.pathname, active?.label]);
  if (!validRole || !active) return <NotFound />;
  function changeRole(next) {
    const nextPage = navigation(next).some((item) => item.path === page)
      ? page
      : "overview";
    navigate(`/${next}/${nextPage}`);
  }
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className="sidebar">
        <Link to={`/${role}/overview`} aria-label="Money Machine overview">
          <Brand />
        </Link>
        <p className="sidebar-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {links.map(({ path, label, icon: Icon }, i) => (
            <NavLink
              className={i === links.length - 3 ? "nav-separated" : ""}
              key={path}
              to={`/${role}/${path}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="avatar">{role === "creator" ? "CR" : "BO"}</span>
          <div>
            {role === "creator" ? "Creator workspace" : "Business workspace"}
            <small>Demo preview</small>
          </div>
          <span className="online-dot" />
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{active.label}</strong>
          </div>
          <div className="header-actions">
            <label className="role-picker">
              <span>Preview as</span>
              <select
                aria-label="Preview workspace role"
                value={role}
                onChange={(e) => changeRole(e.target.value)}
              >
                <option value="creator">Creator</option>
                <option value="business">Business owner</option>
              </select>
            </label>
            <button
              className="icon-button mobile-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-navigation"
            aria-label="Mobile navigation"
          >
            {links.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={`/${role}/${path}`}>
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
        <div className="demo-strip">
          <span className="demo-dot" />
          <strong>Prototype workspace</strong>
          <span>Navigation preview · No real accounts or payments</span>
        </div>
        <main
          ref={mainRef}
          id="main-content"
          tabIndex="-1"
          key={location.pathname}
        >
          {page === "overview" ? (
            <Overview role={role} />
          ) : (
            <Placeholder page={active} role={role} />
          )}
          <footer className="page-footer">
            <span>Money Machine</span>
            <span>Built for better collaborations.</span>
          </footer>
        </main>
        <nav className="bottom-nav" aria-label="Quick navigation">
          {links
            .filter((item) =>
              ["overview", "discover", "collaborations", "profile"].includes(
                item.path,
              ),
            )
            .map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={`/${role}/${path}`}>
                <Icon size={19} />
                <span>{path === "discover" ? "Discover" : label}</span>
              </NavLink>
            ))}
        </nav>
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <main className="not-found">
      <Brand />
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1>Let’s get you back on track.</h1>
      <p>This page doesn’t exist in the prototype.</p>
      <Link className="button" to="/creator/overview">
        <ArrowLeft size={18} />
        Go to workspace
      </Link>
    </main>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/creator/overview" replace />} />
      <Route path="/:role/:page" element={<Workspace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
