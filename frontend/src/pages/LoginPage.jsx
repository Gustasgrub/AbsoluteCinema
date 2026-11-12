import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { KeyRound, LogIn } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/forms/Field.jsx';

const DEMO_ACCOUNTS = [
  { label: 'Administrator', email: 'admin@absolutecinema.test', password: 'Admin123!' },
  { label: 'Member', email: 'member@absolutecinema.test', password: 'Member123!' },
];

// Prisijungimas: el. paštas + slaptažodis
export default function LoginPage() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user && !busy) return <Navigate to={redirectTo} replace />;

  async function handleLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.status === 422 ? 'Enter a valid email and your password.' : requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page container">
      <figure className="auth-page__art">
        <img src="/images/lone-viewer.jpg" alt="A single viewer sitting in an empty cinema with red seats" />
        <figcaption>Rate, review and keep track of everything you watch.</figcaption>
      </figure>

      <div className="auth-card">
        <Link to="/" className="auth-card__logo" aria-label="AbsoluteCinema – home"><Logo /></Link>

        <form className="auth-card__form" onSubmit={handleLogin} noValidate>
          <h1 className="auth-card__title">Sign in</h1>

          <Field label="Email" htmlFor="login-email">
            <input id="login-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </Field>
          <Field label="Password" htmlFor="login-password">
            <input id="login-password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </Field>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
            <LogIn aria-hidden="true" /> {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="auth-card__divider"><span>New to AbsoluteCinema?</span></p>
          <Link to="/register" className="btn btn--gray btn--block">Create a new account</Link>

          <div className="demo-accounts">
            <p className="demo-accounts__title"><KeyRound aria-hidden="true" /> Demo accounts</p>
            {DEMO_ACCOUNTS.map((account) => (
              <button type="button" key={account.email} className="demo-accounts__btn" onClick={() => setForm({ email: account.email, password: account.password })}>
                <strong>{account.label}</strong>
                <span>{account.email} · {account.password}</span>
              </button>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
