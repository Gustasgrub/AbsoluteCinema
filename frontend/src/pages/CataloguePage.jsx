import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import Loader from '../components/Loader.jsx';
import MovieCard from '../components/MovieCard.jsx';
import Pagination from '../components/Pagination.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { GENRES, MOVIE_SORTS } from '../utils/constants.js';
import { genreLabel, toQuery } from '../utils/format.js';

const isYear = (value) => value === '' || /^\d{4}$/.test(value);

// Visų filmų ir serialų katalogas su filtrais (GET /movies)
export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Aktyvūs filtrai laikomi URL'e – juos galima nukopijuoti ar pasidalinti
  const filters = {
    search: params.get('search') ?? '',
    studio_id: params.get('studio_id') ?? '',
    genre: params.get('genre') ?? '',
    type: params.get('type') ?? '',
    year_from: params.get('year_from') ?? '',
    year_to: params.get('year_to') ?? '',
    min_rating: params.get('min_rating') ?? '',
    sort: params.get('sort') ?? 'title',
    page: params.get('page') ?? '',
  };

  // Laukai, kuriuos rašant nenorime siųsti užklausos po kiekvieno klavišo
  const [draft, setDraft] = useState({
    search: filters.search,
    year_from: filters.year_from,
    year_to: filters.year_to,
    min_rating: filters.min_rating,
  });

  const { data, loading, error, reload } = useApi(`/movies${toQuery(filters)}`);
  const { data: studios } = useApi('/studios?per_page=50');

  function updateFilters(changes) {
    setParams(toQuery({ ...filters, ...changes, page: changes.page ?? '' }).slice(1));
  }

  function applyDraft() {
    updateFilters({
      search: draft.search,
      min_rating: draft.min_rating,
      year_from: isYear(draft.year_from) ? draft.year_from : filters.year_from,
      year_to: isYear(draft.year_to) ? draft.year_to : filters.year_to,
    });
  }

  function resetFilters() {
    setDraft({ search: '', year_from: '', year_to: '', min_rating: '' });
    setParams('');
  }

  const setDraftField = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }));
  const minRating = Number(draft.min_rating || 0);

  return (
    <section className="section container">
      <SectionHeading reel="01" kicker={data ? `${data.meta.total} titles match` : 'Everything we screen'} title="The catalogue" as="h1">
        <button type="button" className="btn filters-toggle" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}>
          <SlidersHorizontal aria-hidden="true" /> Filters
        </button>
      </SectionHeading>

      <div className="catalogue">
        <aside className={`catalogue__filters ${filtersOpen ? 'is-open' : ''}`} aria-label="Filters">
          <form
            className="filters"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              applyDraft();
            }}
          >
            <label className="field">
              <span className="field__label">Title or director</span>
              <span className="input-icon">
                <Search aria-hidden="true" />
                <input type="search" value={draft.search} placeholder="e.g. Nolan" onChange={setDraftField('search')} />
              </span>
            </label>

            <label className="field">
              <span className="field__label">Studio</span>
              <select value={filters.studio_id} onChange={(event) => updateFilters({ studio_id: event.target.value })}>
                <option value="">Any studio</option>
                {studios?.data.map((studio) => <option key={studio.id} value={studio.id}>{studio.name}</option>)}
              </select>
            </label>

            <fieldset className="field">
              <legend className="field__label">Type</legend>
              <div className="segmented segmented--full">
                {[['', 'All'], ['movie', 'Movies'], ['series', 'Series']].map(([value, label]) => (
                  <label key={label} className="segmented__option">
                    <input type="radio" name="catalogue-type" checked={filters.type === value} onChange={() => updateFilters({ type: value })} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field">
              <legend className="field__label">Genre</legend>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="genre" checked={filters.genre === ''} onChange={() => updateFilters({ genre: '' })} />
                  <span>Any</span>
                </label>
                {GENRES.map((genre) => (
                  <label key={genre} className="chip">
                    <input type="radio" name="genre" checked={filters.genre === genre} onChange={() => updateFilters({ genre })} />
                    <span>{genreLabel(genre)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field">
              <legend className="field__label">Released between</legend>
              <div className="range-pair">
                <input type="number" aria-label="From year" min="1900" max="2100" placeholder="1900" value={draft.year_from} onChange={setDraftField('year_from')} onBlur={applyDraft} />
                <span aria-hidden="true">—</span>
                <input type="number" aria-label="To year" min="1900" max="2100" placeholder="2026" value={draft.year_to} onChange={setDraftField('year_to')} onBlur={applyDraft} />
              </div>
            </fieldset>

            <label className="field">
              <span className="field__label">Minimum score: <strong>{minRating ? minRating.toFixed(1) : 'any'}</strong></span>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(event) => setDraft((current) => ({ ...current, min_rating: event.target.value === '0' ? '' : event.target.value }))}
                onPointerUp={applyDraft}
                onKeyUp={applyDraft}
              />
            </label>

            <label className="field">
              <span className="field__label">Sort by</span>
              <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
                {MOVIE_SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <div className="filters__actions">
              <button type="submit" className="btn btn--ink"><Search aria-hidden="true" /> Search</button>
              <button type="button" className="btn" onClick={resetFilters}><RotateCcw aria-hidden="true" /> Reset</button>
            </div>
          </form>
        </aside>

        <div className="catalogue__results">
          {loading && !data && <Loader />}
          {error && <ErrorState error={error} onRetry={reload} />}
          {data && data.data.length === 0 && <EmptyState title="No titles match">Loosen a filter or two.</EmptyState>}
          {data && data.data.length > 0 && (
            <div className={`grid grid--movies ${loading ? 'is-refreshing' : ''}`}>
              {data.data.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          )}
          <Pagination meta={data?.meta} onPage={(page) => updateFilters({ page })} />
        </div>
      </div>
    </section>
  );
}
