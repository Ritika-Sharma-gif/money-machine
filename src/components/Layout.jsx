export function Heading({ eyebrow, title, description, action }) {
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
export function Panel({ title, subtitle, children, action }) {
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
