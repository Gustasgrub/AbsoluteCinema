import { Link } from 'react-router';
import Logo from '../Logo.jsx';

// Poraštė (footer): nuorodos ir projekto informacija
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer">
        <nav className="footer__links" aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/studios">Studios</Link>
          <a href="/docs" target="_blank" rel="noreferrer">API docs</a>
        </nav>

        <ul className="footer__credits">
          <li>Directed by <strong>Gustas Grubliauskas</strong></li>
          <li>Produced at <strong>Kaunas University of Technology</strong></li>
          <li>Course <strong>T120B165 Web Application Design</strong></li>
          <li>Cast <strong>Laravel · MySQL · JWT · React</strong></li>
        </ul>

        <Logo />
        <p className="footer__fine">© 2026 AbsoluteCinema · Posters are generated, photos from Unsplash</p>
      </div>
    </footer>
  );
}
