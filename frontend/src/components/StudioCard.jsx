import { Link } from 'react-router';
import { MapPin } from 'lucide-react';
import RatingBadge from './RatingBadge.jsx';
import { initials } from '../utils/format.js';

/*
 * Studijos kortelė. Kiekviena studija turi savo spalvą (brand_color),
 * ji perduodama į CSS kintamąjį --brand ir nuspalvina apskritimą su inicialais.
 */
export default function StudioCard({ studio }) {
  return (
    <article className="studio-card" style={{ '--brand': studio.brand_color }}>
      <Link to={`/studios/${studio.id}`} className="studio-card__link">
        <span className="studio-card__monogram" aria-hidden="true">{initials(studio.name)}</span>
        <div className="studio-card__body">
          <h3 className="studio-card__name">{studio.name}</h3>
          <p className="studio-card__place">
            <MapPin aria-hidden="true" /> {studio.headquarters ? `${studio.headquarters}, ` : ''}{studio.country} · Est. {studio.founded_year}
          </p>
          <p className="studio-card__stats">
            <RatingBadge value={studio.average_rating} size="sm" />
            <span>{studio.movies_count} titles</span>
            <span>{studio.reviews_count} reviews</span>
          </p>
          <p className="studio-card__desc">{studio.description}</p>
        </div>
      </Link>
    </article>
  );
}
