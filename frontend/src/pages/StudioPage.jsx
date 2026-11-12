import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, ExternalLink, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import MovieForm from '../components/forms/MovieForm.jsx';
import StudioForm from '../components/forms/StudioForm.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { DECADES, GENRES, MOVIE_SORTS } from '../utils/constants.js';
import { genreLabel, initials, movieUrl, toQuery } from '../utils/format.js';

// Studijos puslapis: informacija viršuje + jos filmų sąrašas ("Filmography") su filtrais
export default function StudioPage() {
  const { studioId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(null); // 'edit' | 'delete' | 'add-movie'

  const studioRequest = useApi(`/studios/${studioId}`);
  const studio = studioRequest.data?.data;

  const filters = {
    type: params.get('type') ?? '',
    genre: params.get('genre') ?? '',
    year_from: params.get('year_from') ?? '',
    year_to: params.get('year_to') ?? '',
    sort: params.get('sort') ?? '-release_date',
    page: params.get('page') ?? '',
  };

  // Išleidimo metų filtras pagal dešimtmetį: pasirinkus "1990s" siunčiama ?year_from=1990&year_to=1999
  function chooseDecade(decade) {
    updateFilters({ year_from: decade, year_to: decade ? String(Number(decade) + 9) : '' });
  }
  const moviesRequest = useApi(`/studios/${studioId}/movies${toQuery(filters)}`);
  const movies = moviesRequest.data;

  function updateFilters(changes) {
    setParams(toQuery({ ...filters, ...changes, page: changes.page ?? '' }).slice(1));
  }

  async function deleteStudio() {
    try {
      await api(`/studios/${studio.id}`, { method: 'DELETE' });
      toast.success(`${studio.name} was removed together with its titles.`);
      navigate('/studios');
    } catch (error) {
      toast.error(error.message);
      setModal(null);
    }
  }

  if (studioRequest.error) return <div className="container"><ErrorState error={studioRequest.error} /></div>;
  if (!studio) return <Loader />;

  return (
    <>
      <section className="studio-hero" style={{ '--brand': studio.brand_color }}>
        <div className="container">
          <Link to="/studios" className="back-link"><ArrowLeft aria-hidden="true" /> All studios</Link>

          <div className="studio-hero__grid">
            <span className="studio-hero__monogram" aria-hidden="true">{initials(studio.name)}</span>

            <div className="studio-hero__info">
              <h1 className="studio-hero__title">{studio.name}</h1>
              <ul className="title-hero__facts">
                <li>Studio</li>
                <li>Est. {studio.founded_year}</li>
                <li>{studio.country}</li>
              </ul>
              <p className="studio-hero__desc">{studio.description}</p>
              <p className="studio-hero__meta">
                {studio.headquarters && <span><MapPin aria-hidden="true" /> {studio.headquarters}</span>}
                {studio.website && (
                  <a href={studio.website} target="_blank" rel="noreferrer" className="text-link">
                    <ExternalLink aria-hidden="true" /> {studio.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </p>
            </div>

            <aside className="studio-hero__side">
              <div className="rating-block">
                <p className="rating-block__label">Average AC rating</p>
                <span className="rating-block__value">
                  <Star aria-hidden="true" />
                  <span>
                    <strong>{studio.average_rating ?? '—'}</strong>/10
                    <small>{studio.reviews_count} reviews · {studio.movies_count} titles</small>
                  </span>
                </span>
              </div>
              {(studio._links.update || studio._links.delete) && (
                <div className="title-hero__admin">
                  {studio._links.update && (
                    <button type="button" className="btn btn--gray" onClick={() => setModal('edit')}>
                      <Pencil aria-hidden="true" /> Edit studio
                    </button>
                  )}
                  {studio._links.delete && (
                    <button type="button" className="btn btn--gray btn--danger-text" onClick={() => setModal('delete')}>
                      <Trash2 aria-hidden="true" /> Delete
                    </button>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Filmography" count={movies?.meta.total}>
          {studio._links.create_movie && (
            <button type="button" className="btn btn--primary" onClick={() => setModal('add-movie')}>
              <Plus aria-hidden="true" /> Add title
            </button>
          )}
        </SectionHeading>

        <div className="filter-bar">
          <div className="segmented" role="radiogroup" aria-label="Type">
            {[['', 'All'], ['movie', 'Movies'], ['series', 'Series']].map(([value, label]) => (
              <label key={label} className="segmented__option">
                <input type="radio" name="type" value={value} checked={filters.type === value} onChange={() => updateFilters({ type: value })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <label className="filter-bar__field">
            <span>Genre</span>
            <select value={filters.genre} onChange={(event) => updateFilters({ genre: event.target.value })}>
              <option value="">All genres</option>
              {GENRES.map((genre) => <option key={genre} value={genre}>{genreLabel(genre)}</option>)}
            </select>
          </label>
          <label className="filter-bar__field">
            <span>Released</span>
            <select value={filters.year_from} onChange={(event) => chooseDecade(event.target.value)}>
              <option value="">Any year</option>
              {DECADES.map((decade) => <option key={decade} value={decade}>{decade}s</option>)}
            </select>
          </label>
          <label className="filter-bar__field">
            <span>Sort</span>
            <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
              {MOVIE_SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        {moviesRequest.loading && !movies && <Loader />}
        {moviesRequest.error && <ErrorState error={moviesRequest.error} onRetry={moviesRequest.reload} />}
        {movies && movies.data.length === 0 && <EmptyState title="No titles here yet">Try other filters{studio._links.create_movie ? ' or add the first title.' : '.'}</EmptyState>}
        {movies && movies.data.length > 0 && (
          <div className={`grid grid--movies ${moviesRequest.loading ? 'is-refreshing' : ''}`}>
            {movies.data.map((movie) => <MovieCard key={movie.id} movie={movie} showStudio={false} />)}
          </div>
        )}
        <Pagination meta={movies?.meta} onPage={(page) => updateFilters({ page })} />
      </section>

      <Modal open={modal === 'edit'} title={`Edit ${studio.name}`} kicker="Admin" onClose={() => setModal(null)} size="lg">
        <StudioForm
          studio={studio}
          onCancel={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            studioRequest.reload();
          }}
        />
      </Modal>

      <Modal open={modal === 'add-movie'} title={`New title for ${studio.name}`} kicker="Admin" onClose={() => setModal(null)} size="xl">
        <MovieForm
          studio={studio}
          onCancel={() => setModal(null)}
          onSaved={(movie) => {
            setModal(null);
            navigate(movieUrl(movie));
          }}
        />
      </Modal>

      <ConfirmDialog
        open={modal === 'delete'}
        title={`Delete ${studio.name}?`}
        message={`This also deletes its ${studio.movies_count} titles and ${studio.reviews_count} reviews. This cannot be undone.`}
        confirmLabel="Delete studio"
        onConfirm={deleteStudio}
        onClose={() => setModal(null)}
      />
    </>
  );
}
