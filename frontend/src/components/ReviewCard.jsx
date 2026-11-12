import { Link } from 'react-router';
import { Award, Pencil, Star, Trash2 } from 'lucide-react';
import Avatar from './Avatar.jsx';
import Poster from './Poster.jsx';
import { formatDate, movieUrl, ratingWord } from '../utils/format.js';

/*
 * Naudotojo recenzija (kaip IMDb "User reviews"): žvaigždutė su balu, antraštė, tekstas, autorius.
 * Redagavimo / trynimo mygtukai rodomi tik jei API atsiuntė _links.update / _links.delete (HATEOAS).
 */
export default function ReviewCard({ review, showMovie = false, mine = false, onEdit, onDelete }) {
  const canEdit = Boolean(review._links?.update && onEdit);
  const canDelete = Boolean(review._links?.delete && onDelete);

  return (
    <article className={`review ${mine ? 'review--mine' : ''}`}>
      {showMovie && (
        <Link to={movieUrl(review.movie)} className="review__movie">
          <span className="review__movie-poster"><Poster movie={review.movie} /></span>
          <span>
            <strong>{review.movie.title}</strong>
            <small>{review.movie.release_year}</small>
          </span>
        </Link>
      )}

      <div className="review__top">
        <span className="review__score" title={ratingWord(review.rating)}>
          <Star aria-hidden="true" />
          <span><strong>{review.rating}</strong>/10</span>
        </span>
        {review.rating === 10 && (
          <span className="tag tag--yellow"><Award aria-hidden="true" /> Absolute cinema</span>
        )}
        {review.contains_spoilers && <span className="tag tag--red">Spoiler</span>}
        {mine && <span className="tag">Your review</span>}
      </div>

      <h3 className="review__title">{review.title}</h3>
      <p className="review__body">{review.body}</p>

      <footer className="review__foot">
        {review.author && (
          <Link to={`/users/${review.author.id}`} className="review__author">
            <Avatar name={review.author.name} id={review.author.id} size="sm" />
            {review.author.name}
          </Link>
        )}
        <span className="review__date">{formatDate(review.watched_on || review.created_at)}</span>
        {(canEdit || canDelete) && (
          <span className="review__actions">
            {canEdit && (
              <button type="button" className="link-btn" onClick={() => onEdit(review)}>
                <Pencil aria-hidden="true" /> Edit
              </button>
            )}
            {canDelete && (
              <button type="button" className="link-btn link-btn--danger" onClick={() => onDelete(review)}>
                <Trash2 aria-hidden="true" /> Delete
              </button>
            )}
          </span>
        )}
      </footer>
    </article>
  );
}
