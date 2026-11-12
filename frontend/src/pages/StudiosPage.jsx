import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import StudioCard from '../components/StudioCard.jsx';
import StudioForm from '../components/forms/StudioForm.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { COUNTRIES, STUDIO_SORTS } from '../utils/constants.js';
import { toQuery } from '../utils/format.js';

export default function StudiosPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState(params.get('search') ?? '');

  // Filtrai laikomi URL'e (?country=USA&page=2), todėl nuorodą galima nukopijuoti
  const filters = {
    search: params.get('search') ?? '',
    country: params.get('country') ?? '',
    sort: params.get('sort') ?? 'name',
    page: params.get('page') ?? '',
    per_page: 9,
  };
  const { data, loading, error, reload } = useApi(`/studios${toQuery(filters)}`);

  function updateFilters(changes) {
    const next = { ...filters, ...changes, page: changes.page ?? '' };
    delete next.per_page;
    setParams(toQuery(next).slice(1));
  }

  return (
    <>
      <section className="page-banner">
        <img className="page-banner__image" src="/images/film-reels.jpg" alt="Old film reels and projectors on a wall" />
        <div className="container page-banner__content">
          <h1 className="page-banner__title">Studios</h1>
          <p className="page-banner__lead">From hand-drawn spirits to prestige television — browse who made what.</p>
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="All studios" count={data?.meta.total}>
          {data?._links?.create && (
            <button type="button" className="btn btn--primary" onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" /> New studio
            </button>
          )}
        </SectionHeading>

        <form
          className="filter-bar"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            updateFilters({ search });
          }}
        >
          <label className="filter-bar__search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search studios</span>
            <input type="search" placeholder="Search by name…" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <label className="filter-bar__field">
            <span>Country</span>
            <select value={filters.country} onChange={(event) => updateFilters({ country: event.target.value })}>
              <option value="">All countries</option>
              {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
            </select>
          </label>
          <label className="filter-bar__field">
            <span>Sort</span>
            <select value={filters.sort} onChange={(event) => updateFilters({ sort: event.target.value })}>
              {STUDIO_SORTS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button type="submit" className="btn btn--primary">Search</button>
        </form>

        {loading && !data && <Loader />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {data && data.data.length === 0 && <EmptyState title="No studios found">Try a different name or country.</EmptyState>}
        {data && data.data.length > 0 && (
          <div className={`studio-list ${loading ? 'is-refreshing' : ''}`}>
            {data.data.map((studio) => <StudioCard key={studio.id} studio={studio} />)}
          </div>
        )}
        <Pagination meta={data?.meta} onPage={(page) => updateFilters({ page })} />
      </section>

      <Modal open={creating} title="New studio" kicker="Admin" onClose={() => setCreating(false)} size="lg">
        <StudioForm
          onCancel={() => setCreating(false)}
          onSaved={(studio) => {
            setCreating(false);
            navigate(`/studios/${studio.id}`);
          }}
        />
      </Modal>
    </>
  );
}
