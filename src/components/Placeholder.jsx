import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";
export default function Placeholder({ page, role }) {
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>{page.label}</h1>
        <p>{page.description}</p>
      </div>
      <section className="card empty-state">
        <span className="empty-icon">
          <Construction size={30} />
        </span>
        <span className="pill">Planned module</span>
        <h2>A place for {page.label.toLowerCase()}.</h2>
        <p>
          The navigation is ready. This feature will be built in a following
          step, with clearly labelled demonstration data.
        </p>
        <Link className="button secondary" to={`/${role}/overview`}>
          <ArrowLeft size={16} />
          Back to overview
        </Link>
      </section>
    </>
  );
}
