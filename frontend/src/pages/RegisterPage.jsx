import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/forms/Field.jsx';
import { fieldErrors } from '../utils/fieldErrors.js';

// Registracija: po sėkmingos registracijos naudotojas iš karto prisijungia
export default function RegisterPage() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  if (user && !busy) return <Navigate to="/" replace />;

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    try {
      const data = await register(form);
      toast.success(`Welcome to AbsoluteCinema, ${data.user.name}!`);
      navigate('/', { replace: true });
    } catch (error) {
      if (error.status === 422) setErrors(fieldErrors(error));
      else toast.error(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page container">
      <figure className="auth-page__art">
        <img src="/images/clapperboard.jpg" alt="A hand holding a film clapperboard in the desert" />
        <figcaption>Join for free and add your score to every title.</figcaption>
      </figure>

      <div className="auth-card">
        <Link to="/" className="auth-card__logo" aria-label="AbsoluteCinema – home"><Logo /></Link>

        <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
          <h1 className="auth-card__title">Create account</h1>

          <Field label="Display name" htmlFor="register-name" error={errors.name}>
            <input id="register-name" type="text" autoComplete="nickname" value={form.name} onChange={set('name')} maxLength={50} required />
          </Field>
          <Field label="Email" htmlFor="register-email" error={errors.email}>
            <input id="register-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
          </Field>
          <Field label="Password" htmlFor="register-password" error={errors.password} hint="At least 8 characters with letters and numbers">
            <span className="input-icon input-icon--end">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={set('password')}
                required
              />
              <button type="button" className="input-icon__btn" onClick={() => setShowPassword((show) => !show)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </Field>
          <Field label="Repeat password" htmlFor="register-password2" error={errors.password_confirmation}>
            <input
              id="register-password2"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={set('password_confirmation')}
              required
            />
          </Field>

          <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
            <UserPlus aria-hidden="true" /> {busy ? 'Creating account…' : 'Create your account'}
          </button>
          <p className="auth-card__switch">
            Already have an account? <Link to="/login" className="text-link">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
