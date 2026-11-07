import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { KeyRound, LogIn, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/forms/Field.jsx';
import OtpInput from '../components/forms/OtpInput.jsx';

const DEMO_ACCOUNTS = [
  { label: 'Administrator', email: 'admin@absolutecinema.test', password: 'Admin123!' },
  { label: 'Member', email: 'member@absolutecinema.test', password: 'Member123!' },
];

export default function LoginPage() {
  const { user, login, completeTwoFactor } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [twoFactorToken, setTwoFactorToken] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user && !busy) return <Navigate to={redirectTo} replace />;

  function welcome(data) {
    toast.success(`Welcome back, ${data.user.name}! Your seat is ready.`);
    navigate(redirectTo, { replace: true });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await login(form.email, form.password);
      if (data.two_factor_required) setTwoFactorToken(data.two_factor_token);
      else welcome(data);
    } catch (requestError) {
      setError(requestError.status === 422 ? 'Enter a valid email and your password.' : requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCode(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      welcome(await completeTwoFactor(twoFactorToken, code));
    } catch (requestError) {
      if (requestError.status === 401) setTwoFactorToken(null); // tarpinis žetonas pasibaigė – iš naujo
      setError(requestError.errors?.code?.[0] || requestError.message);
      setCode('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page container">
      <figure className="auth-page__art">
        <img src="/images/lone-viewer.jpg" alt="A single viewer sitting in an empty cinema with red seats" />
        <figcaption>“The best seat is the one you come back to.”</figcaption>
      </figure>

      <div className="admission">
        <div className="admission__stub" aria-hidden="true">
          <span>Admit</span>
          <strong>One</strong>
        </div>

        {!twoFactorToken ? (
          <form className="admission__form" onSubmit={handleLogin} noValidate>
            <p className="eyebrow">Members&apos; entrance</p>
            <h1 className="admission__title">Log in</h1>

            <Field label="Email" htmlFor="login-email">
              <input id="login-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="Password" htmlFor="login-password">
              <input id="login-password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </Field>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button type="submit" className="btn btn--primary btn--wide" disabled={busy}>
              <LogIn aria-hidden="true" /> {busy ? 'Checking ticket…' : 'Log in'}
            </button>
            <p className="admission__switch">
              No ticket yet? <Link to="/register">Create an account</Link>
            </p>

            <div className="demo-accounts">
              <p className="eyebrow"><KeyRound aria-hidden="true" /> Demo accounts</p>
              {DEMO_ACCOUNTS.map((account) => (
                <button type="button" key={account.email} className="demo-accounts__btn" onClick={() => setForm({ email: account.email, password: account.password })}>
                  <strong>{account.label}</strong>
                  <span>{account.email} · {account.password}</span>
                </button>
              ))}
            </div>
          </form>
        ) : (
          <form className="admission__form" onSubmit={handleCode}>
            <p className="eyebrow">Second check</p>
            <h1 className="admission__title">Enter your code</h1>
            <p>Open your authenticator app and type the 6-digit code for AbsoluteCinema.</p>
            <OtpInput value={code} onChange={setCode} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn--primary btn--wide" disabled={busy || code.length !== 6}>
              <ShieldCheck aria-hidden="true" /> {busy ? 'Verifying…' : 'Verify and enter'}
            </button>
            <button type="button" className="link-btn" onClick={() => setTwoFactorToken(null)}>Use another account</button>
          </form>
        )}
      </div>
    </section>
  );
}
