import { Link } from 'react-router';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import MovieCard from '../components/MovieCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import StudioCard from '../components/StudioCard.jsx';
import { ErrorState } from '../components/States.jsx';
import { genreLabel } from '../utils/format.js';

/*
 * Pagrindinis puslapis. Visi duomenys ateina viena užklausa GET /dashboard
 * (resursas sudarytas iš kelių esybių: filmų, recenzijų, studijų ir suvestinių skaičių).
 */
export default function HomePage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi('/dashboard');
  const dashboard = data?.data;

  if (error) return <div className="container"><ErrorState error={error} onRetry={reload} /></div>;
  // Duomenų dar nėra (kraunasi arba dar atkuriama prisijungimo sesija) – rodome krovimo žiedą
  if (!dashboard) return <Loader label={loading ? 'Loading the programme' : 'Loading'} />;

  const totals = [
    ['studios', 'Studios'],
    ['movies', 'Films'],
    ['series', 'Series'],
    ['reviews', 'Reviews'],
    ['members', 'Members'],
  ];

  return (
    <>
      <section className="section container">
        <SectionHeading title="Top rated on AbsoluteCinema" subtitle="Highest average score from at least two reviews" />
        <div className="grid grid--movies">
          {dashboard.top_rated.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Latest user reviews" subtitle={user ? 'Pick a title and add yours' : 'Sign in to add yours'} />
        <div className="grid grid--reviews">
          {dashboard.latest_reviews.map((review) => (
            <ReviewCard key={review.id} review={review} showMovie />
          ))}
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Studios" to="/studios" subtitle="Who made what" />
        <div className="studio-list">
          {dashboard.studios.map((studio) => <StudioCard key={studio.id} studio={studio} />)}
        </div>
      </section>

      <section className="section container">
        <SectionHeading title="Browse by genre" />
        <ul className="chip-list">
          {dashboard.genres.map(({ genre, titles }) => (
            <li key={genre} className="genre-chip">
              {genreLabel(genre)} <span>{titles}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section container">
        <SectionHeading title="AbsoluteCinema in numbers" />
        <ul className="numbers">
          {totals.map(([key, label]) => (
            <li key={key} className="numbers__item">
              <strong>{dashboard.totals[key]}</strong>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {!user && (
        <section className="section container">
          <div className="join-banner">
            <div>
              <h2 className="join-banner__title">Rate and review what you watch</h2>
              <p>Create a free account to score titles from 1 to 10 and share your reviews.</p>
            </div>
            <div className="join-banner__actions">
              <Link to="/register" className="btn btn--primary">Join free</Link>
              <Link to="/login" className="btn btn--gray">Sign in</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
