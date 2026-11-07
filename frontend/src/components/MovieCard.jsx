import { Link } from 'react-router';
import Poster from './Poster.jsx';
import RatingBadge from './RatingBadge.jsx';
import { formatRuntime, genreLabel, movieUrl } from '../utils/format.js';

export default function MovieCard({ movie, showStudio = true }) {
  const length = movie.type === 'series'
    ? `${movie.seasons} ${movie.seasons === 1 ? 'season' : 'seasons'}`
    : formatRuntime(movie.runtime_minutes);

  return (
    <article className="movie-card">
      <Link to={movieUrl(movie)} className="movie-card__link">
        <span className="movie-card__type">{movie.type}</span>
        <div className="movie-card__poster">
          <Poster movie={movie} />
        </div>
        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.title}</h3>
          <p className="movie-card__meta">
            {movie.release_year} · {genreLabel(movie.genre)} · {length}
          </p>
          {showStudio && movie.studio && (
            <p className="movie-card__studio" style={{ '--brand': movie.studio.brand_color }}>
              {movie.studio.name}
            </p>
          )}
        </div>
        <RatingBadge value={movie.average_rating} size="sm" />
      </Link>
    </article>
  );
}
