import { useState } from 'react';
import { Link } from 'react-router';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Avatar from './Avatar.jsx';
import { formatDate, movieUrl, ratingWord } from '../utils/format.js';

/*
 * Recenzija – stilizuota kaip kino bilietas.
 * Redagavimo / trynimo mygtukai rodomi tik jei API atsiuntė _links.update / _links.delete (HATEOAS).
 */
export default function ReviewCard({ review, showMovie = false, mine = false, onEdit, onDelete }) {
  const [revealed, setRevealed] = useState(!review.contains_spoilers);
  const canEdit = Boolean(review._links?.update && onEdit);
  const canDelete = Boolean(review._links?.delete && onDelete);

  return (
    <article className={`ticket ${mine ? 'ticket--mine' : ''} ${review.rating === 10 ? 'ticket--ten' : ''}`}>
      <div className="ticket__stub">
        <span className="ticket__score">{review.rating}</span>
        <span className="ticket__of">/ 10</span>
        <span className="ticket__word">{ratingWord(review.rating)}</span>
      </div>

      <div className="ticket__main">
        {showMovie && (
          <Link to={movieUrl(review.movie)} className="ticket__movie">
            {review.movie.title} <span>{review.movie.release_year}</span>
          </Link>
        )}
        <h3 className="ticket__title">{review.title}</h3>

        <div className={`ticket__body ${revealed ? '' : 'is-hidden'}`}>
          <p>{review.body}</p>
          {!revealed && (
            <button type="button" className="spoiler-btn" onClick={() => setRevealed(true)}>
              <Eye aria-hidden="true" /> Contains spoilers – reveal
            </button>
          )}
        </div>

        <footer className="ticket__foot">
          {review.author && (
            <Link to={`/users/${review.author.id}`} className="ticket__author">
              <Avatar name={review.author.name} id={review.author.id} size="sm" />
              {review.author.name}
            </Link>
          )}
          <span className="ticket__date">Admit one · {formatDate(review.watched_on || review.created_at)}</span>
          {(canEdit || canDelete) && (
            <span className="ticket__actions">
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
      </div>

      {review.rating === 10 && (
        <span className="stamp" aria-hidden="true">
          Absolute<br />Cinema
        </span>
      )}
    </article>
  );
}
