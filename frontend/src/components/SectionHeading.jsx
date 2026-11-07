// Skyriaus antraštė: "REEL 02 — kicker" + didelis pavadinimas (+ veiksmo mygtukai dešinėje)
export default function SectionHeading({ reel, kicker, title, children, as: Tag = 'h2' }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          {reel && <span className="eyebrow__reel">Reel {reel}</span>}
          {kicker}
        </p>
        <Tag className="section-heading__title">{title}</Tag>
      </div>
      {children && <div className="section-heading__actions">{children}</div>}
    </div>
  );
}
