import { Link } from 'react-router';
import { BookOpen, Building2, Film, Projector } from 'lucide-react';
import { ApertureIcon } from '../Logo.jsx';

// Poraštė (footer) stilizuota kaip filmo pabaigos titrai ant raudonos uždangos
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container credits">
        <ApertureIcon className="credits__mark" />
        <p className="credits__kicker">— The End —</p>
        <h2 className="credits__title">AbsoluteCinema</h2>

        <dl className="credits__roll">
          <div>
            <dt>Directed by</dt>
            <dd>Gustas Grubliauskas</dd>
          </div>
          <div>
            <dt>Produced at</dt>
            <dd>Kaunas University of Technology</dd>
          </div>
          <div>
            <dt>Course</dt>
            <dd>T120B165 · Web Application Design</dd>
          </div>
          <div>
            <dt>Cast</dt>
            <dd>Laravel · MySQL · JWT · React</dd>
          </div>
        </dl>

        <nav className="credits__links" aria-label="Footer">
          <Link to="/"><Projector aria-hidden="true" /> Now showing</Link>
          <Link to="/studios"><Building2 aria-hidden="true" /> Studios</Link>
          <Link to="/catalogue"><Film aria-hidden="true" /> Catalogue</Link>
          <a href="/docs" target="_blank" rel="noreferrer"><BookOpen aria-hidden="true" /> API docs</a>
        </nav>

        <p className="credits__fine">
          © 2026 AbsoluteCinema · No projectors were harmed in the making of this website · Photos: Unsplash
        </p>
      </div>
    </footer>
  );
}
