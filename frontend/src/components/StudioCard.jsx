import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import { initials } from '../utils/format.js';

// Studijos kortelė. Kiekviena studija turi savo spalvą (brand_color), kuri naudojama CSS kintamajame --brand
export default function StudioCard({ studio }) {
  return (
    <article className="studio-card" style={{ '--brand': studio.brand_color }}>
      <Link to={`/studios/${studio.id}`} className="studio-card__link">
        <div className="studio-card__top">
          <span className="studio-card__monogram" aria-hidden="true">{initials(studio.name)}</span>
          <span className="studio-card__est">Est. {studio.founded_year}</span>
        </div>
        <h3 className="studio-card__name">{studio.name}</h3>
        <p className="studio-card__place">
          <MapPin aria-hidden="true" /> {studio.headquarters ? `${studio.headquarters}, ` : ''}{studio.country}
        </p>
        <p className="studio-card__desc">{studio.description}</p>
        <dl className="studio-card__stats">
          <div>
            <dt>Titles</dt>
            <dd>{studio.movies_count}</dd>
          </div>
          <div>
            <dt>Reviews</dt>
            <dd>{studio.reviews_count}</dd>
          </div>
          <div>
            <dt>Avg score</dt>
            <dd>{studio.average_rating ?? '—'}</dd>
          </div>
        </dl>
      </Link>
    </article>
  );
}
