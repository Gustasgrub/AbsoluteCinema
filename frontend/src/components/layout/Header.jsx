import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { Building2, House, LogIn, LogOut, Menu, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { useToast } from '../Toast.jsx';
import Logo from '../Logo.jsx';
import Avatar from '../Avatar.jsx';

/*
 * Antraštė (header): logotipas, meniu ir paskyra.
 * Kompiuteryje meniu matomas vienoje eilutėje,
 * telefone (< 900px, žr. styles/layout.css) – "Menu" mygtukas atidaro išskleidžiamą sąrašą.
 */
export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  async function handleLogout() {
    closeMenu();
    await logout();
    toast.info('You are signed out. See you at the next screening!');
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
          className="menu-btn"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>Menu</span>
        </button>

        <div id="site-menu" className="site-menu">
          <nav className="site-nav" aria-label="Main">
            {/* end – "Home" aktyvus tik pačiame pagrindiniame puslapyje, ne visuose */}
            <NavLink to="/" end className="site-nav__link" onClick={closeMenu}>
              <House aria-hidden="true" /> Home
            </NavLink>
            <NavLink to="/studios" className="site-nav__link" onClick={closeMenu}>
              <Building2 aria-hidden="true" /> Studios
            </NavLink>
          </nav>

          <span className="site-menu__divider" aria-hidden="true" />

          <div className="site-account">
            {user ? (
              <>
                <Link to={`/users/${user.id}`} className="site-account__me" onClick={closeMenu}>
                  <Avatar name={user.name} id={user.id} size="sm" />
                  <span>{user.name}</span>
                </Link>
                <button type="button" className="site-nav__link" onClick={handleLogout} title="Sign out">
                  <LogOut aria-hidden="true" /> Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="site-nav__link" onClick={closeMenu}>
                  <LogIn aria-hidden="true" /> Sign in
                </NavLink>
                <Link to="/register" className="btn btn--primary btn--sm" onClick={closeMenu}>
                  <UserPlus aria-hidden="true" /> Join free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
