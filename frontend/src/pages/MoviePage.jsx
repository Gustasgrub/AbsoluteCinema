import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, CalendarDays, Clock, LogIn, PenLine, Pencil, Trash2, Tv } from 'lucide-react';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import Poster from '../components/Poster.jsx';
import RatingBadge from '../components/RatingBadge.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import MovieForm from '../components/forms/MovieForm.jsx';
import ReviewForm from '../components/forms/ReviewForm.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { REVIEW_SORTS } from '../utils/constants.js';
import { formatDate, formatRuntime, genreLabel, movieUrl, ratingWord, toQuery } from '../utils/format.js';

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

  return (
    <>
      <section className="movie-hero" style={{ '--brand': movie.studio.brand_color }}>
        <div className="container movie-hero__grid">
          <div className="movie-hero__poster">
            <Poster movie={movie} />
          </div>

          <div className="movie-hero__info">
            <Link to={`/studios/${movie.studio_id}`} className="back-link">
              <ArrowLeft aria-hidden="true" /> {movie.studio.name}
            </Link>
            <p className="eyebrow eyebrow--light">{isSeries ? 'Series' : 'Feature film'} · {genreLabel(movie.genre)}</p>
            <h1 className="movie-hero__title">{movie.title}</h1>
            {movie.tagline && <p className="movie-hero__tagline">“{movie.tagline}”</p>}

            <ul className="meta-chips">
              <li><CalendarDays aria-hidden="true" /> {formatDate(movie.release_date)}</li>
              <li><Clock aria-hidden="true" /> {formatRuntime(movie.runtime_minutes)}{isSeries ? ' / episode' : ''}</li>
              {isSeries && <li><Tv aria-hidden="true" /> {movie.seasons} {movie.seasons === 1 ? 'season' : 'seasons'}</li>}
              <li className="meta-chips__age" title="Age rating">{movie.age_rating}</li>
            </ul>

            <p className="movie-hero__credit">
              {isSeries ? 'Created by' : 'Directed by'} <strong>{movie.director}</strong>
            </p>
            <p className="movie-hero__synopsis">{movie.synopsis}</p>

            {(movie._links.update || movie._links.delete) && (
              <div className="movie-hero__admin">
                {movie._links.update && (
                  <button type="button" className="btn btn--on-dark" onClick={() => setModal({ type: 'edit-movie' })}>
                    <Pencil aria-hidden="true" /> Edit title
                  </button>
                )}
                {movie._links.delete && (
                  <button type="button" className="btn btn--on-dark btn--danger-outline" onClick={() => setModal({ type: 'delete-movie' })}>
                    <Trash2 aria-hidden="true" /> Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <aside className="movie-hero__score">
            <RatingBadge value={movie.average_rating} count={movie.reviews_count} size="xl" />
            <p>{movie.average_rating ? ratingWord(movie.average_rating) : 'Awaiting its first review'}</p>
          </aside>
        </div>
      </section>

      <section className="section container">
        <SectionHeading reel="02" kicker={`${movie.reviews_count} ${movie.reviews_count === 1 ? 'review' : 'reviews'}`} title="The audience speaks">
          {movie._links.create_review && (
            <button type="button" className="btn btn--primary" onClick={() => setModal({ type: 'review' })}>
              <PenLine aria-hidden="true" /> Write a review
            </button>
          )}
          {movie.my_review_id && (
            <button type="button" className="btn" onClick={editMyReview}>
              <Pencil aria-hidden="true" /> Edit my review
            </button>
          )}
          {!user && (
            <Link to="/login" state={{ from: pathname }} className="btn">
              <LogIn aria-hidden="true" /> Log in to review
            </Link>
          )}
        </SectionHeading>

        <div className="filter-bar">
          <label className="filter-bar__field">
            <span>Sort</span>
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
            <span>Hide reviews with spoilers</span>
          </label>
        </div>

        {reviewsRequest.loading && !reviews && <Loader />}
        {reviewsRequest.error && <ErrorState error={reviewsRequest.error} onRetry={reviewsRequest.reload} />}
        {reviews && reviews.data.length === 0 && (
          <EmptyState title="Silence in the theatre">Nobody has reviewed this {isSeries ? 'series' : 'film'} yet.</EmptyState>
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

      <Modal open={modal?.type === 'review'} title={modal?.review ? 'Edit your review' : `Review “${movie.title}”`} kicker="Your take" onClose={() => setModal(null)}>
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

      <Modal open={modal?.type === 'edit-movie'} title={`Edit “${movie.title}”`} kicker="Re-shoot" onClose={() => setModal(null)} size="xl">
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
