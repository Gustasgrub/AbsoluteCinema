import { Link } from 'react-router';
import { Projector } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <img className="not-found__image" src="/images/empty-screen.jpg" alt="An empty cinema with a blank white screen" />
      <div className="not-found__overlay container">
        <p className="eyebrow eyebrow--light">Error 404 · Reel missing</p>
        <h1 className="not-found__title">Nothing is playing on this screen</h1>
        <p>The page you are looking for was cut in the edit — or never filmed at all.</p>
        <Link to="/" className="btn btn--primary">
          <Projector aria-hidden="true" /> Back to the programme
        </Link>
      </div>
    </section>
  );
}
