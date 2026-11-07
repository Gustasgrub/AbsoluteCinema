import { Link } from 'react-router';
import { ArrowRight, Film, Ticket } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import Poster from '../components/Poster.jsx';
import RatingBadge from '../components/RatingBadge.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import StudioCard from '../components/StudioCard.jsx';
import { ErrorState } from '../components/States.jsx';
import { genreLabel, movieUrl } from '../utils/format.js';

// Skaitliukas, kurio skaitmenys "prasisuka" kaip senuose kasos aparatuose
function Counter({ value, label }) {
  const digits = String(value).padStart(3, '0').split('');

  return (
    <div className="counter">
      <div className="counter__digits" aria-label={`${value} ${label}`}>
        {digits.map((digit, index) => (
          <span className="counter__window" key={index} aria-hidden="true">
            <span className="counter__reel" style={{ '--digit': digit, '--delay': `${index * 120}ms` }}>
              {'0123456789'.split('').map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        ))}
      </div>
      <span className="counter__label">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi('/dashboard');
  const dashboard = data?.data;

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="marquee">
            <p className="eyebrow eyebrow--light">Tonight&apos;s programme</p>
            <h1 className="marquee__title">
              <span>Absolute</span>
              <span>Cinema</span>
            </h1>
            <p className="marquee__lead">
              Studios, films and series — reviewed by people who stay until the end credits.
            </p>
            <div className="marquee__actions">
              <Link to="/catalogue" className="btn btn--primary">
                <Film aria-hidden="true" /> Browse the catalogue
              </Link>
              {!user && (
                <Link to="/register" className="btn btn--on-dark">
                  <Ticket aria-hidden="true" /> Get your ticket
                </Link>
              )}
            </div>
          </div>

          <figure className="hero__screen">
            <img src="/images/projector.jpg" alt="A vintage film projector throwing a beam of light through the dark" />
            <figcaption>Projection booth · Reel 01</figcaption>
          </figure>
        </div>
      </section>

      {loading && !dashboard && <Loader label="Threading the projector" />}
      {error && <div className="container"><ErrorState error={error} onRetry={reload} /></div>}

      {dashboard && (
        <>
          <section className="section container">
            <div className="box-office">
              <p className="box-office__title">Box office</p>
              <Counter value={dashboard.totals.studios} label="Studios" />
              <Counter value={dashboard.totals.movies} label="Films" />
              <Counter value={dashboard.totals.series} label="Series" />
              <Counter value={dashboard.totals.reviews} label="Reviews" />
              <Counter value={dashboard.totals.members} label="Members" />
            </div>
          </section>

          <section className="section">
            <div className="container">
              <SectionHeading reel="02" kicker="Highest rated" title="Top of the bill">
                <Link to="/catalogue?sort=-rating" className="text-link">
                  Full ranking <ArrowRight aria-hidden="true" />
                </Link>
              </SectionHeading>
            </div>
            <div className="filmstrip">
              <ol className="filmstrip__track">
                {dashboard.top_rated.map((movie, index) => (
                  <li key={movie.id} className="filmstrip__frame">
                    <Link to={movieUrl(movie)} className="filmstrip__link" aria-label={`${movie.title}, rated ${movie.average_rating}`}>
                      <span className="filmstrip__rank">#{index + 1}</span>
                      <Poster movie={movie} />
                      <RatingBadge value={movie.average_rating} size="sm" />
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="section section--lobby">
            <div className="container lobby">
              <div className="lobby__intro">
                <SectionHeading reel="03" kicker="Fresh from the lobby" title="Latest reviews" />
                <img className="lobby__image" src="/images/audience.jpg" alt="An audience watching a film in a cinema with red seats" />
                <p className="lobby__text">
                  Every review is a ticket stub — a score from 1 to 10 and a few honest lines.
                  {user ? ' Pick a title and add yours.' : ' Log in to add yours.'}
                </p>
              </div>
              <div className="lobby__reviews">
                {dashboard.latest_reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} showMovie />
                ))}
              </div>
            </div>
          </section>

          <section className="section container">
            <SectionHeading reel="04" kicker="Who made it" title="The studios">
              <Link to="/studios" className="text-link">
                All studios <ArrowRight aria-hidden="true" />
              </Link>
            </SectionHeading>
            <div className="grid grid--studios">
              {dashboard.studios.slice(0, 6).map((studio) => <StudioCard key={studio.id} studio={studio} />)}
            </div>
          </section>

          <section className="section container">
            <SectionHeading reel="05" kicker="Pick a mood" title="Genres" />
            <ul className="genre-ribbon">
              {dashboard.genres.map(({ genre, titles }) => (
                <li key={genre}>
                  <Link to={`/catalogue?genre=${genre}`} className="genre-tag">
                    {genreLabel(genre)} <span>{titles}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
