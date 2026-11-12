import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

/*
 * Skyriaus antraštė su geltonu brūkšniu kairėje (kaip IMDb: "| Top picks >").
 *   title    – pavadinimas
 *   count    – skaičius šalia pavadinimo (pvz. recenzijų kiekis)
 *   to       – jei nurodyta, pavadinimas tampa nuoroda su rodykle ">"
 *   subtitle – pilkas paaiškinimas po pavadinimu
 *   children – mygtukai dešinėje
 */
export default function SectionHeading({ title, count, to, subtitle, children, as: Tag = 'h2' }) {
  const label = (
    <>
      {title}
      {count !== undefined && <span className="section-title__count">{count}</span>}
      {to && <ChevronRight className="section-title__arrow" aria-hidden="true" />}
    </>
  );

  return (
    <div className="section-heading">
      <div>
        <Tag className="section-title">{to ? <Link to={to}>{label}</Link> : label}</Tag>
        {subtitle && <p className="section-heading__sub">{subtitle}</p>}
      </div>
      {children && <div className="section-heading__actions">{children}</div>}
    </div>
  );
}
