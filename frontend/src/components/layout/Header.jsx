import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Building2, Film, LogIn, LogOut, Projector, ShieldCheck, Ticket } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useToast } from '../Toast.jsx';
import Logo from '../Logo.jsx';
import Avatar from '../Avatar.jsx';

/*
 * Antraštė (header). Kompiuteryje – horizontalus meniu,
 * telefone (< 768px, žr. styles/layout.css) – "hamburger" mygtukas, kuris atidaro meniu.
 */
export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  async function handleLogout() {
    closeMenu();
    await logout();
    toast.info('You left the theatre. See you next screening!');
    navigate('/');
  }

  return (
    <header className={`site-header ${menuOpen ? 'is-open' : ''}`}>
      <div className="container site-header__bar">
        <Link to="/" className="site-header__brand" onClick={closeMenu} aria-label="AbsoluteCinema – home">
          <Logo />
        </Link>

        <button
          type="button"
          className="hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div id="site-menu" className="site-menu">
          <nav className="site-nav" aria-label="Main">
            <NavLink to="/" end className="site-nav__link" onClick={closeMenu}>
              <Projector aria-hidden="true" /> Now showing
            </NavLink>
            <NavLink to="/studios" className="site-nav__link" onClick={closeMenu}>
              <Building2 aria-hidden="true" /> Studios
            </NavLink>
            <NavLink to="/catalogue" className="site-nav__link" onClick={closeMenu}>
              <Film aria-hidden="true" /> Catalogue
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/users" className="site-nav__link" onClick={closeMenu}>
                <ShieldCheck aria-hidden="true" /> Admin
              </NavLink>
            )}
          </nav>

          <div className="site-account">
            {user ? (
              <>
                <Link to={`/users/${user.id}`} className="site-account__me" onClick={closeMenu}>
                  <Avatar name={user.name} id={user.id} size="sm" />
                  <span>
                    <strong>{user.name}</strong>
                    <small>{user.role}</small>
                  </span>
                </Link>
                <button type="button" className="btn btn--on-dark btn--icon" onClick={handleLogout} aria-label="Log out" title="Log out">
                  <LogOut aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="site-nav__link" onClick={closeMenu}>
                  <LogIn aria-hidden="true" /> Log in
                </NavLink>
                <Link to="/register" className="btn btn--ticket" onClick={closeMenu}>
                  <Ticket aria-hidden="true" /> Get a ticket
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="sprockets" aria-hidden="true" />
    </header>
  );
}
