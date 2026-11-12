import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, LogIn, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import Poster from '../components/Poster.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import MovieForm from '../components/forms/MovieForm.jsx';
import ReviewForm from '../components/forms/ReviewForm.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { REVIEW_SORTS } from '../utils/constants.js';
import { formatDate, formatRuntime, genreLabel, movieUrl, ratingWord, toQuery } from '../utils/format.js';

// Filmo (serialo) puslapis – išdėstymas kaip IMDb filmo puslapyje
export default function MoviePage() {
  const { studioId, movieId } = useParams();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  // Kuris modalinis langas atidarytas: { type: 'edit-movie' | 'delete-movie' | 'review' | 'delete-review', review? }
  const [modal, setModal] = useState(null);

  const baseUrl = `/studios/${studioId}/movies/${movieId}`;
  const movieRequest = useApi(baseUrl);
  const movie = movieRequest.data?.data;

  const filters = {
    sort: params.get('sort') ?? '-created',
    spoilers: params.get('spoilers') ?? '',
    page: params.get('page') ?? '',
    per_page: 6,
  };
  const reviewsRequest = useApi(`${baseUrl}/reviews${toQuery(filters)}`);
  const reviews = reviewsRequest.data;

  function updateFilters(changes) {
    const next = { ...filters, ...changes, page: changes.page ?? '' };
    delete next.per_page;
    setParams(toQuery(next).slice(1));
  }

  function refreshAll() {
    movieRequest.reload();
    reviewsRequest.reload();
  }

  // Savo recenziją parsisiunčiame tik paspaudus "Edit my review" (filmas atsiunčia tik jos id)
  async function editMyReview() {
    try {
      const result = await api(`${baseUrl}/reviews/${movie.my_review_id}`);
      setModal({ type: 'review', review: result.data });
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deleteMovie() {
    try {
      await api(baseUrl, { method: 'DELETE' });
      toast.success(`“${movie.title}” was removed from the catalogue.`);
      navigate(`/studios/${movie.studio_id}`);
    } catch (error) {
      toast.error(error.message);
      setModal(null);
    }
  }

  async function deleteReview(review) {
    try {
      await api(`${baseUrl}/reviews/${review.id}`, { method: 'DELETE' });
      toast.success('Review deleted.');
      setModal(null);
      refreshAll();
    } catch (error) {
      toast.error(error.message);
      setModal(null);
    }
  }

  if (movieRequest.error) return <div className="container"><ErrorState error={movieRequest.error} /></div>;
  if (!movie) return <Loader />;

  const isSeries = movie.type === 'series';
  const canReview = Boolean(movie._links.create_review);
  const openNewReview = () => setModal({ type: 'review' });

  return (
    <>
      <section className="title-hero">
        <div className="title-hero__backdrop" aria-hidden="true">
          <Poster movie={movie} />
        </div>

        <div className="container title-hero__inner">
          <nav className="title-hero__links" aria-label="Title">
            <Link to={`/studios/${movie.studio_id}`}><ArrowLeft aria-hidden="true" /> {movie.studio.name}</Link>
          </nav>

          <div className="title-hero__head">
            <div>
              <h1 className="title-hero__title">{movie.title}</h1>
              <ul className="title-hero__facts">
                {isSeries && <li>TV Series</li>}
                <li>{movie.release_year}</li>
                <li>{movie.age_rating}</li>
                <li>{formatRuntime(movie.runtime_minutes)}</li>
              </ul>
            </div>

            <div className="title-hero__ratings">
              <div className="rating-block">
                <p className="rating-block__label">AC rating</p>
                <a href="#reviews" className="rating-block__value">
                  <Star aria-hidden="true" />
                  <span>
                    <strong>{movie.average_rating ?? '—'}</strong>/10
                    <small>{movie.reviews_count} {movie.reviews_count === 1 ? 'review' : 'reviews'}</small>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="title-hero__body">
            <div className="title-hero__poster">
              <Poster movie={movie} />
            </div>

            <div className="title-hero__info">
              <ul className="chip-list">
                <li className="genre-chip">{genreLabel(movie.genre)}</li>
                <li className="genre-chip">{isSeries ? 'Series' : 'Movie'}</li>
              </ul>

              {movie.tagline && <p className="title-hero__tagline">“{movie.tagline}”</p>}
              <p className="title-hero__plot">{movie.synopsis}</p>

              <dl className="credits">
                <div>
                  <dt>{isSeries ? 'Creator' : 'Director'}</dt>
                  <dd>{movie.director}</dd>
                </div>
                <div>
                  <dt>Studio</dt>
                  <dd><Link to={`/studios/${movie.studio_id}`}>{movie.studio.name}</Link></dd>
                </div>
                <div>
                  <dt>{isSeries ? 'Premiere' : 'Release date'}</dt>
                  <dd>{formatDate(movie.release_date)}</dd>
                </div>
                {isSeries && (
                  <div>
                    <dt>Seasons</dt>
                    <dd>{movie.seasons} · {formatRuntime(movie.runtime_minutes)} per episode</dd>
                  </div>
                )}
              </dl>
            </div>

            <aside className="title-hero__actions">
              {canReview && (
                <button type="button" className="btn btn--primary btn--block" onClick={openNewReview}>
                  <Plus aria-hidden="true" /> Write a review
                </button>
              )}
              {movie.my_review_id && (
                <button type="button" className="btn btn--primary btn--block" onClick={editMyReview}>
                  <Pencil aria-hidden="true" /> Edit my review
                </button>
              )}
              {!user && (
                <Link to="/login" state={{ from: pathname }} className="btn btn--primary btn--block">
                  <LogIn aria-hidden="true" /> Sign in to review
                </Link>
              )}

              <a href="#reviews" className="title-hero__stat">
                <strong>{movie.reviews_count}</strong> User reviews
              </a>
              <p className="title-hero__verdict">
                {movie.average_rating ? ratingWord(movie.average_rating) : 'Awaiting its first review'}
              </p>

              {(movie._links.update || movie._links.delete) && (
                <div className="title-hero__admin">
                  {movie._links.update && (
                    <button type="button" className="btn btn--gray" onClick={() => setModal({ type: 'edit-movie' })}>
                      <Pencil aria-hidden="true" /> Edit title
                    </button>
                  )}
                  {movie._links.delete && (
                    <button type="button" className="btn btn--gray btn--danger-text" onClick={() => setModal({ type: 'delete-movie' })}>
                      <Trash2 aria-hidden="true" /> Delete
                    </button>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <div className="container">
        <section id="reviews" className="section">
          <SectionHeading title="User reviews" count={movie.reviews_count}>
            {canReview && (
              <button type="button" className="btn btn--text" onClick={openNewReview}>
                <Plus aria-hidden="true" /> Review
              </button>
            )}
          </SectionHeading>

          <div className="filter-bar">
            <label className="filter-bar__field">
              <span>Sort by</span>
              <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
                {REVIEW_SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={filters.spoilers === 'false'}
                onChange={(event) => updateFilters({ spoilers: event.target.checked ? 'false' : '' })}
              />
              <span className="toggle__track" aria-hidden="true" />
              <span>Hide spoilers</span>
            </label>
          </div>

          {reviewsRequest.loading && !reviews && <Loader />}
          {reviewsRequest.error && <ErrorState error={reviewsRequest.error} onRetry={reviewsRequest.reload} />}
          {reviews && reviews.data.length === 0 && (
            <EmptyState title="No reviews yet">Nobody has reviewed this {isSeries ? 'series' : 'film'} yet.</EmptyState>
          )}
          {reviews && reviews.data.length > 0 && (
            <div className={`review-list ${reviewsRequest.loading ? 'is-refreshing' : ''}`}>
              {reviews.data.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  mine={review.author?.id === user?.id}
                  onEdit={(selected) => setModal({ type: 'review', review: selected })}
                  onDelete={(selected) => setModal({ type: 'delete-review', review: selected })}
                />
              ))}
            </div>
          )}
          <Pagination meta={reviews?.meta} onPage={(page) => updateFilters({ page })} />
        </section>
      </div>

      <Modal open={modal?.type === 'review'} title={modal?.review ? 'Edit your review' : movie.title} kicker={modal?.review ? 'Your review' : 'Rate this'} onClose={() => setModal(null)}>
        {modal?.type === 'review' && (
          <ReviewForm
            movie={movie}
            review={modal.review}
            onCancel={() => setModal(null)}
            onSaved={() => {
              setModal(null);
              refreshAll();
            }}
          />
        )}
      </Modal>

      <Modal open={modal?.type === 'edit-movie'} title={`Edit “${movie.title}”`} kicker="Admin" onClose={() => setModal(null)} size="xl">
        <MovieForm
          studio={movie.studio}
          movie={movie}
          onCancel={() => setModal(null)}
          onSaved={(saved) => {
            setModal(null);
            if (saved.studio_id !== movie.studio_id) navigate(movieUrl(saved));
            else movieRequest.reload();
          }}
        />
      </Modal>

      <ConfirmDialog
        open={modal?.type === 'delete-movie'}
        title={`Delete “${movie.title}”?`}
        message={`All ${movie.reviews_count} reviews of this title will be deleted too.`}
        confirmLabel="Delete title"
        onConfirm={deleteMovie}
        onClose={() => setModal(null)}
      />

      <ConfirmDialog
        open={modal?.type === 'delete-review'}
        title="Delete this review?"
        message={modal?.review ? `“${modal.review.title}” by ${modal.review.author?.name} will be removed.` : ''}
        confirmLabel="Delete review"
        onConfirm={() => deleteReview(modal.review)}
        onClose={() => setModal(null)}
      />
    </>
  );
}
