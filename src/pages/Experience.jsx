import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import Brand from "../components/Brand";
import "../experience.css";

const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const deals = [
  {
    id: "01",
    title: "A home worth sharing",
    creator: "Maya Kapoor",
    initials: "MK",
    status: "Needs your review",
    deadline: "6 Nov 2026",
    task: "Review the first video",
    agreed: 30000,
    invoiced: 30000,
    paid: 18000,
  },
  {
    id: "02",
    title: "The weekend edit",
    creator: "Arjun Mehta",
    initials: "AM",
    status: "In progress",
    deadline: "9 Nov 2026",
    task: "First video draft",
    agreed: 30000,
    invoiced: 0,
    paid: 0,
  },
  {
    id: "03",
    title: "Stories around the table",
    creator: "Nia Thomas",
    initials: "NT",
    status: "Changes requested",
    deadline: "7 Nov 2026",
    task: "Updated caption and video",
    agreed: 18000,
    invoiced: 18000,
    paid: 0,
  },
];
function tone(text = "") {
  const t = text.toLowerCase();
  if (/(in progress|active|agreed|earned in demo)/.test(t) && !/not /.test(t))
    return "green";
  if (/(changes requested|paused)/.test(t)) return "rose";
  if (/(draft|not earned|planned)/.test(t)) return "grey";
  return "amber";
}
function Status({ children }) {
  const text = [].concat(children).join("");
  return <span className={`mm-status ${tone(text)}`}>{children}</span>;
}

export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      aria-label={title}
      className="mm-modal"
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mm-modal-title">
        <h2>{title}</h2>
        <button
          className="mm-quiet"
          onClick={onClose}
          aria-label="Close dialog"
        >
          Close ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function InstallButton() {
  const [prompt, setPrompt] = useState(null);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      navigator.standalone,
  );
  useEffect(() => {
    const capture = (e) => {
      e.preventDefault();
      setPrompt(e);
    };
    const done = () => {
      setInstalled(true);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", done);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  async function install() {
    if (prompt) {
      await prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
    } else setHelp(true);
  }
  return (
    <>
      <button className="mm-install" onClick={install} disabled={installed}>
        {installed ? "Added to your device" : "Add to home screen"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      {help && (
        <Modal title="Keep Money Machine close" onClose={() => setHelp(false)}>
          <p>No app store needed. Open this website in your phone’s browser.</p>
          <ol>
            <li>
              <strong>iPhone or iPad:</strong> in Safari, open Share, then
              choose Add to Home Screen.
            </li>
            <li>
              <strong>Android:</strong> in Chrome, open the menu, then choose
              Install app or Add to Home screen.
            </li>
          </ol>
          <p>
            Available options depend on your browser. An internet connection is
            needed for the latest version.
          </p>
        </Modal>
      )}
    </>
  );
}
const steps = [
  {
    n: "01",
    label: "DISCOVER",
    title: "Find your people.",
    text: "Search by name, interest, or city. Save the profiles you like.",
    cta: "Browse profiles",
    to: "/creator/discover",
    art: "discover",
  },
  {
    n: "02",
    label: "COLLABORATE",
    title: "Get on the same page.",
    text: "Keep your terms, content, and next steps together.",
    cta: "See a sample agreement",
    to: "/business/agreements",
    art: "agree",
  },
  {
    n: "03",
    label: "KEEP TRACK",
    title: "Know where you stand.",
    text: "See your records, affiliate activity, and achievements.",
    cta: "See sample records",
    to: "/creator/finances",
    art: "track",
  },
];

function StepArt({ kind }) {
  if (kind === "discover")
    return (
      <svg viewBox="0 0 120 80" aria-hidden="true" className="mm-art">
        <circle className="a-ring" cx="44" cy="40" r="22" />
        <line className="a-handle" x1="60" y1="56" x2="76" y2="70" />
        <circle className="a-dot d1" cx="92" cy="22" r="5" />
        <circle className="a-dot d2" cx="104" cy="44" r="4" />
        <circle className="a-dot d3" cx="88" cy="58" r="3" />
      </svg>
    );
  if (kind === "agree")
    return (
      <svg viewBox="0 0 120 80" aria-hidden="true" className="mm-art">
        <rect className="a-doc" x="30" y="10" width="52" height="62" rx="6" />
        <line className="a-line l1" x1="40" y1="26" x2="72" y2="26" />
        <line className="a-line l2" x1="40" y1="38" x2="72" y2="38" />
        <line className="a-line l3" x1="40" y1="50" x2="58" y2="50" />
        <path className="a-check" d="M70 56l6 6 12-14" />
      </svg>
    );
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true" className="mm-art">
      <rect className="a-bar b1" x="26" y="42" width="14" height="28" rx="3" />
      <rect className="a-bar b2" x="50" y="28" width="14" height="42" rx="3" />
      <rect className="a-bar b3" x="74" y="14" width="14" height="56" rx="3" />
      <line className="a-base" x1="18" y1="72" x2="98" y2="72" />
    </svg>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // Walk the highlight through the three steps once the section is visible,
  // then stop so the section stays calm and readable.
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    setActive(0);
    const t = setInterval(() => {
      i += 1;
      if (i > 2) return clearInterval(t);
      setActive(i);
    }, 1400);
    return () => clearInterval(t);
  }, [seen, run]);
  return (
    <section
      className={`mm-steps ${seen ? "in-view" : ""}`}
      id="how-it-works"
      ref={ref}
      aria-labelledby="how-title"
    >
      <div className="mm-steps-head">
        <span className="mm-kicker">HOW IT WORKS</span>
        <button
          type="button"
          className="mm-quiet"
          onClick={() => {
            setSeen(false);
            setActive(0);
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                setSeen(true);
                setRun((r) => r + 1);
              }),
            );
          }}
        >
          Replay ↻
        </button>
        <h2 id="how-title">Three simple steps.</h2>
      </div>
      <div className="mm-steps-grid">
        <span className="mm-steps-line" aria-hidden="true">
          <span />
        </span>
        {steps.map((step, i) => (
          <article
            key={step.n}
            className={`mm-step ${active === i ? "active" : ""}`}
            style={{ "--i": i }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <div className="mm-step-top">
              <span className="mm-step-badge">{step.n}</span>
              <StepArt kind={step.art} />
            </div>
            <span className="mm-step-label">{step.label}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <Link className="mm-step-link" to={step.to}>
              {step.cta} <span aria-hidden="true">↗</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

const calm = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  id,
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      id={id}
      className={`mm-reveal ${shown ? "shown" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

const journey = [
  {
    step: "DISCOVER",
    title: "Maya × Studio Fern",
    line: "Two profiles. One good fit.",
  },
  {
    step: "AGREE",
    title: "Terms in one place",
    line: "Scope, timing and fee, written down.",
  },
  {
    step: "DELIVER",
    title: "First video shared",
    line: "Review it and send your thoughts.",
  },
  {
    step: "REPEAT",
    title: "Ready for round two",
    line: "Work together again, faster.",
  },
];

function JourneyCard() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || calm()) return;
    const t = setInterval(() => setI((n) => (n + 1) % journey.length), 3200);
    return () => clearInterval(t);
  }, [paused]);
  const item = journey[i];
  return (
    <div
      className="mm-float"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="mm-avatar">MK</span>
      <div className="mm-float-body">
        <div key={i} className="mm-float-text">
          <small>
            ILLUSTRATIVE · STEP {i + 1} OF 4 · {item.step}
          </small>
          <strong>{item.title}</strong>
          <span>{item.line}</span>
        </div>
        <div
          className="mm-float-dots"
          role="group"
          aria-label="Collaboration steps"
        >
          {journey.map((j, n) => (
            <button
              key={j.step}
              type="button"
              className={n === i ? "on" : n < i ? "done" : ""}
              aria-label={`Show step ${n + 1}: ${j.step}`}
              aria-current={n === i}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleCard({ to, className = "", label, title, text, cta, delay }) {
  function move(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--my", `${y * 100}%`);
    if (!calm()) {
      e.currentTarget.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
      e.currentTarget.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    }
  }
  function leave(e) {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  }
  return (
    <Reveal delay={delay} className="mm-role-wrap">
      <Link
        to={to}
        className={`mm-role-card ${className}`}
        onMouseMove={move}
        onMouseLeave={leave}
      >
        <span>{label}</span>
        <h3>{title}</h3>
        <p>{text}</p>
        <strong>{cta}</strong>
      </Link>
    </Reveal>
  );
}

export function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const progress = useRef(null);
  const visual = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (progress.current)
          progress.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        setScrolled(scrollY > 12);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  function parallax(e) {
    if (calm() || !visual.current) return;
    const r = visual.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    visual.current.style.setProperty("--px", `${x * 16}px`);
    visual.current.style.setProperty("--py", `${y * 12}px`);
  }
  function parallaxEnd() {
    visual.current?.style.setProperty("--px", "0px");
    visual.current?.style.setProperty("--py", "0px");
  }
  useEffect(() => {
    document.title = "Money Machine — Good work starts with a connection";
  }, []);
  return (
    <div className="mm-landing">
      <span className="mm-progress" aria-hidden="true">
        <span ref={progress} />
      </span>
      <header className={`mm-public-nav ${scrolled ? "scrolled" : ""}`}>
        <Link to="/" aria-label="Money Machine home">
          <Brand />
        </Link>
        <nav aria-label="Website navigation">
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("how-it-works").scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                  .matches
                  ? "instant"
                  : "smooth",
              });
            }}
          >
            How it works
          </a>
          <Link to="/creator/dashboard">For creators</Link>
          <Link to="/business/dashboard">For businesses</Link>
        </nav>
        <a
          className="mm-button small"
          href="#choose-role"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("choose-role").scrollIntoView({
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            });
          }}
        >
          Explore the demo <span>↗</span>
        </a>
      </header>
      <main>
        <section className="mm-hero">
          <div className="mm-glow" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="mm-hero-copy">
            <span className="mm-kicker">GOOD PEOPLE. GREAT POSSIBILITIES.</span>
            <h1 aria-label="Your next great collaboration starts here.">
              {["Your next great", "collaboration", "starts"].map((line, l) => (
                <span className="mm-line" key={line} aria-hidden="true">
                  {line.split(" ").map((w, k) => (
                    <span
                      className="mm-word"
                      key={w + k}
                      style={{ "--w": `${l * 3 + k}` }}
                    >
                      {w}&nbsp;
                    </span>
                  ))}
                </span>
              ))}
              <span className="mm-line" aria-hidden="true">
                <span className="mm-word" style={{ "--w": 7 }}>
                  <em>here.</em>
                </span>
              </span>
            </h1>
            <p>
              Meet the right people. Make something together.
              <br />
              Keep every detail in one place.
            </p>
            <div className="mm-actions">
              <Link className="mm-button" to="/business/discover?type=creator">
                Find a creator <span>↗</span>
              </Link>
              <Link
                className="mm-button outline"
                to="/creator/discover?type=business"
              >
                Find a business
              </Link>
            </div>
            <p className="mm-caption">
              A space for creators and businesses to work together.
            </p>
          </div>
          <div
            className="mm-hero-visual"
            ref={visual}
            onMouseMove={parallax}
            onMouseLeave={parallaxEnd}
          >
            <div className="mm-hero-photo">
              <img
                src="/images/creator-studio.webp"
                alt="A photographer working with a camera"
                fetchPriority="high"
              />
            </div>
            <div className="mm-image-label">
              FROM AN IDEA
              <br />
              <strong>to something real.</strong>
            </div>
            <JourneyCard />
            <div className="mm-visual-tag">Create. Connect. Collaborate.</div>
          </div>
        </section>
        <HowItWorks />
        <Reveal as="section" className="mm-principles" id="principles">
          <div className="mm-principles-head">
            <span className="mm-kicker">HOW WE KEEP IT HONEST</span>
            <h2>Clear by design.</h2>
          </div>
          {[
            [
              "Money stays honest",
              "Agreed, invoiced and recorded amounts are always shown separately. Self-reported is never called verified.",
            ],
            [
              "You choose who finds you",
              "Creator profiles are hidden from search until you switch discovery on. You can switch it off any time.",
            ],
            [
              "Earnings stay private",
              "Income and spending are visible only to their owner. They never appear on a public profile.",
            ],
          ].map(([t, d], n) => (
            <article key={t} style={{ "--n": n }}>
              <span className="mm-principle-no">0{n + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </Reveal>
        <section className="mm-role-section" id="choose-role">
          <div>
            <span className="mm-kicker">A PLACE FOR BOTH SIDES</span>
            <h2>What brings you here?</h2>
            <p>Choose a demo workspace. You can switch roles at any time.</p>
          </div>
          <RoleCard
            to="/creator/dashboard"
            label="FOR CREATORS"
            title="Make your next move."
            text="Find businesses, manage your work, and track your income."
            cta="Explore creator workspace ↗"
            delay={0}
          />
          <RoleCard
            to="/business/dashboard"
            className="business"
            label="FOR BUSINESSES"
            title="Find your next voice."
            text="Meet creators, manage affiliate programs, and track spending."
            cta="Explore business workspace ↗"
            delay={140}
          />
        </section>
        <Reveal as="section" className="mm-phone">
          <div>
            <span className="mm-kicker">WHEREVER WORK TAKES YOU</span>
            <h2>Your workspace. One tap away.</h2>
            <p>
              Add Money Machine to your phone’s home screen for easy access.
            </p>
            <InstallButton />
          </div>
          <div className="mm-phone-art" aria-hidden="true">
            <div className="mm-phone-body">
              <i className="p1" />
              <i className="p2" />
              <i className="p3" />
              <i className="p4" />
              <b>m.</b>
            </div>
          </div>
        </Reveal>
      </main>
      <footer className="mm-public-footer">
        <div className="mm-foot-main">
          <div className="mm-foot-brand">
            <Brand />
            <p>
              A calmer way for creators and businesses to find each other, agree
              on the work and keep track of it.
            </p>
          </div>
          <nav aria-label="Footer">
            <h4>Explore</h4>
            <Link to="/creator/dashboard">Creator workspace</Link>
            <Link to="/business/dashboard">Business workspace</Link>
            <Link to="/creator/discover">Discover people</Link>
          </nav>
          <nav aria-label="Product">
            <h4>Product</h4>
            <a href="#how-it-works">How it works</a>
            <a href="#principles">Our principles</a>
            <Link to="/creator/settings">Settings</Link>
          </nav>
        </div>
        <div className="mm-foot-legal">
          <span>© 2026 Money Machine · A VandLabs build</span>
          <span>
            Interactive demo. Profiles and figures are fictional; no messages
            are sent and no payments are made.
          </span>
        </div>
      </footer>
    </div>
  );
}
const navItems = [
  ["dashboard", "Overview"],
  ["discover", "Discover"],
  ["collaborations", "Collaborations"],
  ["messages", "Messages"],
  ["agreements", "Agreements"],
  ["finances", "Financial records"],
  ["affiliate", "Affiliate programs"],
  ["badges", "Your badges"],
  ["saved", "Saved profiles"],
  ["profile", "Profile"],
  ["settings", "Settings"],
];
export function Workspace({ children }) {
  const { role = "business", page = "dashboard" } = useParams();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    document.title = `${navItems.find((x) => x[0] === page)?.[1] || "Profile"} | Money Machine`;
  }, [location.pathname, page]);
  const business = role === "business";
  return (
    <div className="mm-workspace">
      <a
        className="skip-link"
        href="#mm-main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("mm-main")?.focus();
        }}
      >
        Skip to content
      </a>
      <aside className={`mm-sidebar ${open ? "open" : ""}`}>
        <Link to="/" aria-label="Money Machine home">
          <Brand />
        </Link>
        <div className="mm-role-toggle">
          <Link className={!business ? "active" : ""} to="/creator/dashboard">
            Creator
          </Link>
          <Link className={business ? "active" : ""} to="/business/dashboard">
            Business
          </Link>
        </div>
        <span className="mm-nav-label">YOUR WORKSPACE</span>
        <nav aria-label="Workspace navigation">
          {navItems
            .filter(([id]) => business || id !== "affiliate")
            .map(([id, label]) => (
              <NavLink
                key={id}
                to={`/${role}/${id}${id === "discover" ? `?type=${business ? "creator" : "business"}` : ""}`}
              >
                <span>
                  {id === "discover"
                    ? business
                      ? "Find creators"
                      : "Find businesses"
                    : id === "finances"
                      ? business
                        ? "Spending & records"
                        : "Income & records"
                      : label}
                </span>
                <span aria-hidden="true">↗</span>
              </NavLink>
            ))}
        </nav>
        <div className="mm-sidebar-bottom">
          <InstallButton />
          <small>Good work, wherever you are.</small>
        </div>
      </aside>
      <div className="mm-workspace-body">
        <header className="mm-topbar">
          <button
            className="mm-mobile-toggle"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "Close menu" : "Menu"}
          </button>
          <span className="mm-breadcrumb">
            Workspace <span>/</span>{" "}
            {navItems.find((x) => x[0] === page)?.[1] || "Profile"}
          </span>
          <div className="mm-account">
            <span className="mm-avatar">{business ? "SF" : "MK"}</span>
            <div>
              <strong>{business ? "Studio Fern" : "Maya Kapoor"}</strong>
              <small>{business ? "Business" : "Creator"} demo account</small>
            </div>
          </div>
        </header>
        <div className="mm-demo-note">
          Demo workspace <span>Sample data · Nothing is sent or paid</span>
        </div>
        <main
          id="mm-main"
          tabIndex="-1"
          className="mm-content"
          key={location.pathname}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
function Heading({ eyebrow, title, description, action }) {
  return (
    <div className="mm-heading">
      <div>
        <span className="mm-kicker">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
function Panel({ title, subtitle, children, action }) {
  return (
    <section className="mm-panel">
      <div className="mm-panel-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
function DealDetail({ deal, onClose }) {
  return (
    <Modal title={deal.title} onClose={onClose}>
      <p>
        <strong>{deal.creator}</strong> · Studio Fern
      </p>
      <Status>{deal.status}</Status>
      <p>
        Next step: {deal.task}
        <br />
        Due {deal.deadline}
      </p>
      <div className="mm-record-line">
        <span>Agreed compensation</span>
        <strong>{money(deal.agreed)}</strong>
      </div>
      <div className="mm-record-line">
        <span>Invoiced</span>
        <strong>{money(deal.invoiced)}</strong>
      </div>
      <p className="mm-caption">
        Fictional agreement AGR-DEMO-{deal.id}. This view does not approve
        content or send a message.
      </p>
    </Modal>
  );
}
export function Dashboard() {
  const { role } = useParams();
  const business = role === "business";
  const rows = business ? deals : [deals[0]];
  const [selected, setSelected] = useState(null);
  return (
    <>
      <Heading
        eyebrow="LET’S MAKE GOOD WORK HAPPEN"
        title={`Welcome back, ${business ? "Studio Fern" : "Maya"}.`}
        description="Your people, your projects, and what comes next."
        action={
          <Link
            className="mm-button"
            to={`/${role}/discover?type=${business ? "creator" : "business"}`}
          >
            Find {business ? "creators" : "businesses"} ↗
          </Link>
        }
      />
      <section className="mm-work-banner">
        <div>
          <span>YOUR NEXT STEP</span>
          <h2>
            {business
              ? "A fresh idea is ready for your eyes."
              : "Your story is taking shape."}
          </h2>
          <p>
            {business
              ? "Maya shared the first video for A home worth sharing."
              : "Your first video is with Studio Fern for review."}
          </p>
          <button className="mm-button" onClick={() => setSelected(deals[0])}>
            View collaboration ↗
          </button>
        </div>
        <div className="mm-banner-type" aria-hidden="true">
          Better
          <br />
          <em>together.</em>
        </div>
      </section>
      <div className="mm-stat-grid">
        <div className="mm-stat">
          <span>Active collaborations</span>
          <strong>{rows.length.toString().padStart(2, "0")}</strong>
          <small>People you’re working with</small>
        </div>
        <div className="mm-stat">
          <span>
            {business ? "Needs your attention" : "Awaiting business review"}
          </span>
          <strong>{business ? "02" : "01"}</strong>
          <small>
            {business ? "A review and a revision" : "Your first video draft"}
          </small>
        </div>
        <div className="mm-stat">
          <span>Next deadline</span>
          <strong className="mm-date">6 Nov</strong>
          <small>2026 · First video review</small>
        </div>
      </div>
      <div className="mm-two-col">
        <Panel
          title="Active collaborations"
          subtitle="A clear next step for every project."
          action={<Link to={`/${role}/collaborations`}>View all ↗</Link>}
        >
          {rows.map((d) => (
            <button
              className="mm-deal-row"
              key={d.id}
              onClick={() => setSelected(d)}
            >
              <span className="mm-avatar">{d.initials}</span>
              <span>
                <strong>{d.title}</strong>
                <small>
                  {business ? d.creator : "Studio Fern"} · Due {d.deadline}
                </small>
              </span>
              <Status>{d.status}</Status>
              <span>↗</span>
            </button>
          ))}
        </Panel>
        <Panel title="Needs attention" subtitle="Start here when you check in.">
          {(business
            ? [
                ["Review Maya’s video", "New content is ready", deals[0]],
                ["Check Nia’s revision", "Changes requested", deals[2]],
              ]
            : [
                [
                  "Wait for video feedback",
                  "Studio Fern is reviewing",
                  deals[0],
                ],
              ]
          ).map(([title, sub, d]) => (
            <button
              className="mm-task"
              key={title}
              onClick={() => setSelected(d)}
            >
              <span>
                <strong>{title}</strong>
                <small>{sub}</small>
              </span>
              <span>↗</span>
            </button>
          ))}
          <Link className="mm-inline-link" to={`/${role}/requests`}>
            View local offers and invitations ↗
          </Link>
        </Panel>
      </div>
      <FinancialSummary role={role} />
      <div className="mm-two-col">
        <Panel
          title="Recent activity"
          subtitle="Sample updates · 4 November 2026"
        >
          <div className="mm-timeline">
            <p>
              <strong>Maya shared a first video</strong>
              <span>A home worth sharing · Today, 10:20</span>
            </p>
            {business && (
              <>
                <p>
                  <strong>Changes requested on Nia’s caption</strong>
                  <span>Stories around the table · Yesterday</span>
                </p>
                <p>
                  <strong>Terms agreed with Arjun</strong>
                  <span>The weekend edit · 2 November</span>
                </p>
              </>
            )}
          </div>
        </Panel>
        <Panel title="Upcoming deadlines">
          {[...rows]
            .sort((a, b) =>
              a.deadline.localeCompare(b.deadline, undefined, {
                numeric: true,
              }),
            )
            .map((d) => (
              <button
                className="mm-task"
                key={d.id}
                onClick={() => setSelected(d)}
              >
                <span className="mm-calendar">
                  <strong>{d.deadline.split(" ")[0]}</strong>NOV
                </span>
                <span>
                  <strong>{d.task}</strong>
                  <small>{d.title}</small>
                </span>
                <span>↗</span>
              </button>
            ))}
        </Panel>
      </div>
      {selected && (
        <DealDetail deal={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
function FinancialSummary({ role }) {
  const rows = role === "business" ? deals : [deals[0]];
  const totals = rows.reduce(
    (a, d) => ({
      agreed: a.agreed + d.agreed,
      invoiced: a.invoiced + d.invoiced,
      paid: a.paid + d.paid,
    }),
    { agreed: 0, invoiced: 0, paid: 0 },
  );
  return (
    <Panel
      title={
        role === "business" ? "Spending at a glance" : "Income at a glance"
      }
      subtitle="Separate stages of the same money. Don’t add these values together."
      action={<Link to={`/${role}/finances`}>See records ↗</Link>}
    >
      <div className="mm-finance-grid">
        {[
          ["Agreed", totals.agreed, "From sample agreements"],
          ["Invoiced", totals.invoiced, "From sample invoices"],
          [
            role === "business" ? "Paid, as recorded" : "Received, as recorded",
            totals.paid,
            "Manual demo record · Unverified",
          ],
          [
            "Pending invoices",
            totals.invoiced - totals.paid,
            "Invoiced minus recorded payments",
          ],
        ].map(([label, value, note]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{money(value)}</strong>
            <small>{note}</small>
          </div>
        ))}
      </div>
      <p className="mm-caption">
        Not yet invoiced: {money(totals.agreed - totals.invoiced)}. Money
        Machine does not process or verify these demo payments.
      </p>
    </Panel>
  );
}
export function Collaborations() {
  const { role } = useParams();
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const rows = (role === "business" ? deals : [deals[0]]).filter(
    (d) => filter === "All" || d.status === filter,
  );
  return (
    <>
      <Heading
        eyebrow="KEEP MOVING, TOGETHER"
        title="Your collaborations"
        description="See who you’re working with and what needs to happen next."
      />
      <div className="mm-tabs">
        {["All", "In progress", "Needs your review", "Changes requested"].map(
          (f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ),
        )}
      </div>
      <div className="mm-project-grid">
        {rows.map((d) => (
          <button
            className="mm-project"
            onClick={() => setSelected(d)}
            key={d.id}
          >
            <span className="mm-project-number">COLLABORATION / {d.id}</span>
            <h2>{d.title}</h2>
            <p>{d.creator} × Studio Fern</p>
            <Status>{d.status}</Status>
            <div className="mm-project-footer">
              <span>
                {d.task}
                <small>Due {d.deadline}</small>
              </span>
              <strong>↗</strong>
            </div>
          </button>
        ))}
      </div>
      {!rows.length && (
        <p className="mm-empty">
          No collaborations in this stage. Try another filter.
        </p>
      )}
      <Link className="mm-inline-link" to={`/${role}/requests`}>
        See your saved invitation drafts ↗
      </Link>
      {selected && (
        <DealDetail deal={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
export function FinancialRecords() {
  const { role } = useParams();
  const [detail, setDetail] = useState(null);
  const rows = role === "business" ? deals : [deals[0]];
  return (
    <>
      <Heading
        eyebrow="CLARITY, AT EVERY STEP"
        title={
          role === "business"
            ? "Your spending & records"
            : "Your income & records"
        }
        description="Know what was agreed, what was invoiced, and what was recorded."
      />
      <FinancialSummary role={role} />
      <Panel
        title="Your sample records"
        subtitle="Select a collaboration to inspect the source."
      >
        {rows.map((d) => (
          <button
            className="mm-deal-row"
            key={d.id}
            onClick={() => setDetail(d)}
          >
            <span className="mm-avatar">{d.initials}</span>
            <span>
              <strong>{d.title}</strong>
              <small>
                AGR-DEMO-{d.id}
                {d.invoiced > 0 ? ` · INV-DEMO-${d.id}` : " · Not yet invoiced"}
              </small>
            </span>
            <strong>{money(d.agreed)}</strong>
            <span>↗</span>
          </button>
        ))}
      </Panel>
      {detail && (
        <Modal title="Record details" onClose={() => setDetail(null)}>
          <h3>{detail.title}</h3>
          <p>
            Agreement: AGR-DEMO-{detail.id} · {money(detail.agreed)}
          </p>
          <p>
            Invoice:{" "}
            {detail.invoiced
              ? `INV-DEMO-${detail.id} · ${money(detail.invoiced)}`
              : "No invoice recorded"}
          </p>
          <p>
            Payment:{" "}
            {detail.paid
              ? `PAY-DEMO-${detail.id} · ${money(detail.paid)}`
              : "No payment recorded"}
          </p>
          <div className="mm-record-line">
            <span>Data source</span>
            <strong>
              {detail.paid ? "Self-reported" : "No payment to source"}
            </strong>
          </div>
          <p className="mm-caption">
            Data sources are self-reported, confirmed by the other side, or
            confirmed by a payment provider. Self-reported entries are never
            counted as verified payments. In this demo every entry is
            self-reported; no other side or payment provider is connected.
          </p>
        </Modal>
      )}
    </>
  );
}
const initialPrograms = [
  {
    id: "fern-autumn",
    name: "Studio Fern autumn collection",
    commission: 10,
    status: "Active",
    clicks: 128,
    referrals: 8,
    description: "Introduce your audience to our autumn home collection.",
  },
  {
    id: "fern-gift",
    name: "Thoughtful gifts",
    commission: 8,
    status: "Draft",
    clicks: 0,
    referrals: 0,
    description: "A seasonal program for creators who love considered gifting.",
  },
];
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      return Array.isArray(raw) ? raw : initial;
    } catch {
      return initial;
    }
  });
  const [error, setError] = useState("");
  function update(next) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      setError(
        "Browser storage is unavailable. Changes will last until you reload.",
      );
    }
  }
  return [value, update, error];
}
export function Affiliates() {
  const [programs, setPrograms, error] = useStored(
    "mm-affiliates-v1",
    initialPrograms,
  );
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [activity, setActivity] = useState(false);
  function save(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const entry = {
      ...editing,
      name: fd.get("name").trim(),
      description: fd.get("description").trim(),
      commission: Number(fd.get("commission")),
    };
    if (!entry.name) return;
    setPrograms(
      programs.some((p) => p.id === entry.id)
        ? programs.map((p) => (p.id === entry.id ? entry : p))
        : [...programs, entry],
    );
    setEditing(null);
    setNotice("Program saved on this browser. It has not been published.");
  }
  return (
    <>
      <Heading
        eyebrow="GROW THROUGH GOOD CONNECTIONS"
        title="Your affiliate programs"
        description="Give creators a clear way to refer people to your business."
        action={
          <button
            className="mm-button"
            onClick={() =>
              setEditing({
                id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name: "",
                description: "",
                commission: 10,
                status: "Draft",
                clicks: 0,
                referrals: 0,
              })
            }
          >
            Create a program +
          </button>
        }
      />
      {notice && (
        <p role="status" className="mm-notice">
          {notice}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <div className="mm-stat-grid">
        <div className="mm-stat">
          <span>Programs</span>
          <strong>{programs.length}</strong>
          <small>Stored on this browser</small>
        </div>
        <div className="mm-stat">
          <span>Sample link visits</span>
          <strong>{programs.reduce((a, p) => a + p.clicks, 0)}</strong>
          <small>Illustrative activity, not live tracking</small>
        </div>
        <div className="mm-stat">
          <span>Sample referrals</span>
          <strong>{programs.reduce((a, p) => a + p.referrals, 0)}</strong>
          <small>Not verified sales or payments</small>
        </div>
      </div>
      <Panel
        title="Programs"
        subtitle="Set your terms, then keep the details easy to find."
        action={
          <button className="mm-quiet" onClick={() => setActivity(true)}>
            View sample activity ↗
          </button>
        }
      >
        {programs.map((p) => (
          <div className="mm-program" key={p.id}>
            <div>
              <Status>{p.status} · Demo</Status>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <small>
                {p.commission}% proposed commission · {p.clicks} sample visits ·{" "}
                {p.referrals} sample referrals
              </small>
            </div>
            <div className="mm-actions">
              <button
                className="mm-button outline small"
                onClick={() => setEditing(p)}
              >
                Edit
              </button>
              <button
                className="mm-quiet"
                onClick={() => {
                  setPrograms(
                    programs.map((x) =>
                      x.id === p.id
                        ? {
                            ...x,
                            status: x.status === "Active" ? "Paused" : "Active",
                          }
                        : x,
                    ),
                  );
                  setNotice(
                    "Demo status updated. No live program was changed.",
                  );
                }}
              >
                {p.status === "Active" ? "Pause demo" : "Activate demo"}
              </button>
            </div>
          </div>
        ))}
      </Panel>
      <p className="mm-caption">
        Creating a program here does not create a live referral link. Live
        attribution and commission tracking need a connected backend.
      </p>
      {editing && (
        <Modal
          title={
            programs.some((p) => p.id === editing.id)
              ? "Edit your program"
              : "Create a program"
          }
          onClose={() => setEditing(null)}
        >
          <form className="mm-form" onSubmit={save}>
            <label>
              Program name
              <input
                name="name"
                required
                maxLength={80}
                defaultValue={editing.name}
              />
            </label>
            <label>
              What should creators know?
              <textarea
                name="description"
                required
                maxLength={400}
                defaultValue={editing.description}
              />
            </label>
            <label>
              Proposed commission (%)
              <input
                name="commission"
                type="number"
                min="0"
                max="100"
                step="0.5"
                required
                defaultValue={editing.commission}
              />
            </label>
            <p className="mm-caption">
              Demo only. Saved to this browser, never published.
            </p>
            <button className="mm-button" type="submit">
              Save program
            </button>
          </form>
        </Modal>
      )}
      {activity && (
        <Modal
          title="Sample affiliate activity"
          onClose={() => setActivity(false)}
        >
          <p>Studio Fern autumn collection · 4 November 2026</p>
          <div className="mm-record-line">
            <span>Maya Kapoor · Referral submitted</span>
            <span>10:40</span>
          </div>
          <div className="mm-record-line">
            <span>Arjun Mehta · Link visited</span>
            <span>09:15</span>
          </div>
          <p className="mm-caption">
            Illustrative events only. Neither event confirms a sale or earned
            commission.
          </p>
        </Modal>
      )}
    </>
  );
}
export function Badges() {
  const { role } = useParams();
  const business = role === "business";
  return (
    <>
      <Heading
        eyebrow="THE SMALL STEPS COUNT"
        title="Your badges"
        description="A simple record of meaningful activity. No scores to chase."
      />
      <p className="mm-notice">
        Preview badges · These reflect fictional demo activity, not verified
        achievements.
      </p>
      <div className="mm-project-grid">
        {[
          [
            "01",
            "Profile ready",
            "Name, introduction, and interests added.",
            true,
            "Account check",
            "You completed your demo profile.",
          ],
          [
            "02",
            business ? "First agreement" : "First delivery",
            business
              ? "Both sides agreed on a sample collaboration."
              : "A first piece of sample content was delivered.",
            true,
            "Working behaviour",
            business
              ? "Based on sample agreement AGR-DEMO-01."
              : "Based on sample delivery in AGR-DEMO-01.",
          ],
          [
            "03",
            "Working together again",
            "Complete a second collaboration with the same partner.",
            false,
            "Milestone",
            "Needs two completed collaborations with one partner.",
          ],
        ].map(([n, title, desc, earned, kind, evidence]) => (
          <article
            className={`mm-badge-card ${earned ? "" : "locked"}`}
            key={n}
          >
            <span className="mm-badge-seal">{n}</span>
            <span className="mm-badge-class">{kind}</span>
            <h2>{title}</h2>
            <p>{desc}</p>
            <small className="mm-badge-evidence">Evidence: {evidence}</small>
            <Status>{earned ? "Earned in demo" : "Not earned yet"}</Status>
          </article>
        ))}
      </div>
      <p className="mm-caption">
        Badges do not certify identity, content quality, income, or payment
        reliability. Subscriptions never earn a badge, and earnings are never
        shown as a statistic.
      </p>
    </>
  );
}
const defaultSettings = {
  discoverable: false,
  showcase: false,
  notifyOffers: true,
  notifyMessages: true,
  notifyReminders: false,
  blocked: [],
};

function SettingsPage({ business }) {
  const key = `mm-settings-${business ? "business" : "creator"}`;
  const [settings, setSettings] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      return raw && typeof raw === "object"
        ? { ...defaultSettings, ...raw }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [note, setNote] = useState("");
  function change(patch, message) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setNote(message);
    } catch {
      setNote("Browser storage is unavailable. This lasts until you reload.");
    }
  }
  const toggles = [
    ...(business
      ? []
      : [
          [
            "discoverable",
            "Let businesses find me",
            "Off by default. Turn it off at any time and your profile leaves search straight away.",
          ],
          [
            "showcase",
            "Show my public showcase page",
            "Only the work samples you choose. Earnings are never shown.",
          ],
        ]),
    ["notifyOffers", "Offers and agreements", "Tell me when terms change."],
    ["notifyMessages", "Messages", "Tell me when someone writes to me."],
    ["notifyReminders", "Deadline reminders", "A nudge before work is due."],
  ];
  const blockable = ["Slow Coffee Co.", "Daily Form", "Arjun Mehta"];
  return (
    <>
      <Heading
        eyebrow="MAKE YOURSELF AT HOME"
        title="Settings"
        description="Choose who can find you, what you hear about, and who can contact you."
      />
      {note && (
        <p role="status" className="mm-notice">
          {note} Saved on this browser only.
        </p>
      )}
      <Panel
        title="Privacy and notifications"
        subtitle="Every switch works right away."
      >
        {toggles.map(([id, label, help]) => (
          <label className="mm-switch-row" key={id}>
            <span>
              <strong>{label}</strong>
              <small>{help}</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={settings[id]}
              onChange={(e) =>
                change(
                  { [id]: e.target.checked },
                  `${label} turned ${e.target.checked ? "on" : "off"}.`,
                )
              }
            />
          </label>
        ))}
      </Panel>
      <Panel
        title="Blocked accounts"
        subtitle="Blocking stops messages, offers and feed visibility."
      >
        {blockable.map((name) => {
          const isBlocked = settings.blocked.includes(name);
          return (
            <div className="mm-record-line" key={name}>
              <span>{name}</span>
              <button
                className="mm-quiet"
                onClick={() =>
                  change(
                    {
                      blocked: isBlocked
                        ? settings.blocked.filter((x) => x !== name)
                        : [...settings.blocked, name],
                    },
                    `${name} ${isBlocked ? "unblocked" : "blocked"}.`,
                  )
                }
              >
                {isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          );
        })}
        <p className="mm-caption">
          Demo only. No real accounts are affected and nothing is sent.
        </p>
      </Panel>
      <Panel title="Use Money Machine on your phone">
        <p>Add this website to your home screen for quick access.</p>
        <InstallButton />
      </Panel>
      <Panel title="Motion & accessibility">
        <p>
          Animations follow your device’s reduced-motion setting. All actions
          work with a keyboard as well as touch.
        </p>
      </Panel>
    </>
  );
}

export function SimplePage() {
  const { role, page } = useParams();
  const [note, setNote] = useState("");
  const business = role === "business";
  if (page === "settings") return <SettingsPage business={business} />;
  if (page === "profile")
    return (
      <>
        <Heading
          eyebrow="YOUR INTRODUCTION"
          title={business ? "Studio Fern" : "Maya Kapoor"}
          description={
            business
              ? "Independent home and design studio · Bengaluru"
              : "Lifestyle creator · Mumbai"
          }
        />
        <Panel title="Your public demo profile">
          <p>
            {business
              ? "Objects with a story. Looking for creators who love intentional spaces."
              : "Thoughtful everyday content for brands with something to say."}
          </p>
          <Link
            className="mm-button"
            to={`/${role}/people/${business ? "studio-fern" : "maya"}`}
          >
            View profile ↗
          </Link>
          <p className="mm-caption">
            Fictional account. Profile editing and account authentication are
            not connected.
          </p>
        </Panel>
      </>
    );
  if (page === "agreements")
    return (
      <>
        <Heading
          eyebrow="CLEAR TERMS, BETTER WORK"
          title="Your agreements"
          description="Keep scope, compensation, and deadlines easy to find."
        />
        {(business ? deals : [deals[0]]).map((d) => (
          <Panel
            key={d.id}
            title={d.title}
            subtitle={`AGR-DEMO-${d.id} · Fictional agreement`}
          >
            <div className="mm-record-line">
              <span>{d.creator} × Studio Fern</span>
              <strong>{money(d.agreed)}</strong>
            </div>
            <p>
              Scope: one short video and supporting caption. Next deadline:{" "}
              {d.deadline}.
            </p>
            <Status>Terms agreed · Demo</Status>
          </Panel>
        ))}
      </>
    );
  return (
    <>
      <Heading
        eyebrow="KEEP THE CONVERSATION CLOSE"
        title="Messages"
        description="A preview of conversations around your work."
      />
      <Panel
        title="Maya × Studio Fern"
        subtitle="Sample conversation · Nothing is sent"
      >
        <div className="mm-message">
          <strong>Maya</strong>
          <p>
            The first video is ready. Let me know what you think of the opening.
          </p>
          <small>Today, 10:20 · Demo message</small>
        </div>
        <label className="mm-message-label">
          Your local draft
          <textarea
            value={note}
            maxLength={1000}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a reply to try the interface…"
          />
        </label>
        <p className="mm-caption">
          Draft only. This text stays on this screen and is not sent or saved.
        </p>
      </Panel>
    </>
  );
}
