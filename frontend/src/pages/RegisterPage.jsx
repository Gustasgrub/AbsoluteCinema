import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { Eye, EyeOff, Ticket } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import Field from '../components/forms/Field.jsx';
import { fieldErrors } from '../utils/fieldErrors.js';

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
      toast.success(`Welcome to the audience, ${data.user.name}!`);
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
        <figcaption>“Scene one, take one. Action.”</figcaption>
      </figure>

      <div className="admission">
        <div className="admission__stub" aria-hidden="true">
          <span>New</span>
          <strong>Pass</strong>
        </div>

        <form className="admission__form" onSubmit={handleSubmit} noValidate>
          <p className="eyebrow">Join the audience</p>
          <h1 className="admission__title">Get a ticket</h1>

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

          <button type="submit" className="btn btn--primary btn--wide" disabled={busy}>
            <Ticket aria-hidden="true" /> {busy ? 'Printing your ticket…' : 'Create account'}
          </button>
          <p className="admission__switch">
            Already a member? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
