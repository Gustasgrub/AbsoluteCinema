import { Link } from 'react-router';
import { Info } from 'lucide-react';
import Poster from './Poster.jsx';
import RatingBadge from './RatingBadge.jsx';
import { formatRuntime, genreLabel, movieUrl } from '../utils/format.js';

// Filmo kortelė su plakatu (kaip IMDb plakatų tinklelyje)
export default function MovieCard({ movie, showStudio = true }) {
  // Serialui rodome sezonų skaičių, filmui – trukmę
  const length = movie.type === 'series'
    ? `${movie.seasons} ${movie.seasons === 1 ? 'season' : 'seasons'}`
    : formatRuntime(movie.runtime_minutes);

  return (
    <article className="title-card">
      <Link to={movieUrl(movie)} className="title-card__link">
        <div className="title-card__poster">
          <Poster movie={movie} />
          {movie.type === 'series' && <span className="title-card__type">Series</span>}
        </div>
        <div className="title-card__body">
          <RatingBadge value={movie.average_rating} count={movie.reviews_count} size="sm" />
          <h3 className="title-card__title">{movie.title}</h3>
          <p className="title-card__meta">
            {movie.release_year} · {genreLabel(movie.genre)} · {length}
          </p>
          {showStudio && movie.studio && <p className="title-card__studio">{movie.studio.name}</p>}
          <span className="title-card__cta">
            <Info aria-hidden="true" /> Details
          </span>
        </div>
      </Link>
    </article>
  );
}
