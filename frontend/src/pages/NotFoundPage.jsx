import { Link } from 'react-router';
import { House } from 'lucide-react';

// 404 puslapis (kai adresas neatitinka jokio maršruto App.jsx faile)
export default function NotFoundPage() {
  return (
    <section className="not-found">
      <img className="not-found__image" src="/images/empty-screen.jpg" alt="An empty cinema with a blank white screen" />
      <div className="not-found__overlay container">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">The requested page was not found on our server</h1>
        <blockquote className="not-found__quote">
          “Nothing is playing on this screen.”
          <span>— the projectionist</span>
        </blockquote>
        <Link to="/" className="btn btn--primary">
          <House aria-hidden="true" /> Go to the homepage
        </Link>
      </div>
    </section>
  );
}
