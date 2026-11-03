import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  LockKeyhole,
  Compass,
  Handshake,
  Wallet,
} from "lucide-react";
export default function Overview({ role }) {
  const business = role === "business";
  const items = business
    ? [
        "Complete your organisation profile",
        "Write your first collaboration brief",
        "Build your creator shortlist",
      ]
    : [
        "Complete your creator profile",
        "Explore your first opportunity",
        "Start a collaboration",
      ];
  const paths = business
    ? ["profile", "briefs", "shortlists"]
    : ["profile", "discover", "collaborations"];
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>Good things start together.</h1>
        <p>
          Your {business ? "business" : "creator"} workspace. A little more
          clarity, a lot more possibility.
        </p>
      </div>
      <section className="welcome">
        <div>
          <span className="welcome-kicker">
            MADE FOR {business ? "BUSINESSES" : "CREATORS"}
          </span>
          <h2>
            {business
              ? "Find your people.\nBuild something great."
              : "Your creativity.\nA world of opportunity."}
          </h2>
          <p>
            {business
              ? "Bring your briefs, creator relationships, and collaboration records into one organised space."
              : "Bring your opportunities, collaborations, and income records into one organised space."}
          </p>
          <Link className="button" to={`/${role}/discover`}>
            {business ? "Explore creators" : "Explore opportunities"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-card">
            <span className="art-avatar">MM</span>
            <span>
              Better, together.<small>CREATIVITY MEETS POSSIBILITY</small>
            </span>
            <Handshake size={32} />
          </div>
          <span className="floating-dot" />
        </div>
      </section>
      <div className="section-heading">
        <h2>Your workspace, at a glance</h2>
        <span className="muted">Foundation preview</span>
      </div>
      <div className="feature-grid">
        {[
          {
            icon: Compass,
            title: business ? "Creator discovery" : "Opportunities",
            text: business
              ? "Find the right creative partners."
              : "Find work that fits your interests.",
            path: "discover",
          },
          {
            icon: Handshake,
            title: "Collaborations",
            text: "Keep every next step in view.",
            path: "collaborations",
          },
          {
            icon: Wallet,
            title: business ? "Spending records" : "Income records",
            text: "Clear records. Clear distinctions.",
            path: "finances",
          },
        ].map(({ icon: Icon, title, text, path }) => (
          <Link className="card feature" key={path} to={`/${role}/${path}`}>
            <span className="feature-icon">
              <Icon size={21} />
            </span>
            <ArrowUpRight className="feature-arrow" size={18} />
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="module-status">Module planned</span>
          </Link>
        ))}
      </div>
      <div className="lower-grid">
        <section className="card checklist">
          <div className="section-heading">
            <h2>Make yourself at home</h2>
            <span className="pill">Getting started</span>
          </div>
          <p className="muted">Your next steps once onboarding is available.</p>
          {items.map((item, i) => (
            <Link className="check-row" key={item} to={`/${role}/${paths[i]}`}>
              <span className="step-number">0{i + 1}</span>
              <span>{item}</span>
              <ArrowRight size={17} />
            </Link>
          ))}
        </section>
        <aside className="card privacy">
          <span className="feature-icon">
            <LockKeyhole size={22} />
          </span>
          <h2>Your work. Your visibility.</h2>
          <p>
            Private earnings and confidential business details belong in your
            workspace. Public discovery will be opt-in.
          </p>
          <div>
            <Check size={16} />
            Privacy-first product direction
          </div>
          <Link to={`/${role}/settings`}>
            Explore settings <ArrowRight size={15} />
          </Link>
        </aside>
      </div>
    </>
  );
}
