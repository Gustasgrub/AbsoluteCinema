import { useState } from 'react';
import { Send } from 'lucide-react';
import { api } from '../../api/client.js';
import { useToast } from '../Toast.jsx';
import Field from './Field.jsx';
import { fieldErrors } from '../../utils/fieldErrors.js';
import RatingInput from './RatingInput.jsx';

// Recenzijos rašymo (POST) ir redagavimo (PUT) forma
export default function ReviewForm({ movie, review, onSaved, onCancel }) {
  const editing = Boolean(review);
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    rating: review?.rating ?? 0,
    title: review?.title ?? '',
    body: review?.body ?? '',
    contains_spoilers: review?.contains_spoilers ?? false,
    watched_on: review?.watched_on ?? '',
  });

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const today = new Date().toISOString().slice(0, 10);
  const baseUrl = `/studios/${movie.studio_id}/movies/${movie.id}/reviews`;

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const body = { ...form, rating: form.rating || null, watched_on: form.watched_on || null };

    try {
      const result = editing
        ? await api(`${baseUrl}/${review.id}`, { method: 'PUT', body })
        : await api(baseUrl, { method: 'POST', body });
      toast.success(editing ? 'Your review was updated.' : 'Review published. Thanks for staying for the credits!');
      onSaved(result.data);
    } catch (error) {
      if (error.status === 422) setErrors(fieldErrors(error));
      else toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <RatingInput value={form.rating} onChange={(rating) => setForm((current) => ({ ...current, rating }))} error={errors.rating} />

      <Field label="Headline" htmlFor="review-title" error={errors.title}>
        <input id="review-title" type="text" value={form.title} onChange={set('title')} maxLength={120} placeholder="Sum it up in one line" required />
      </Field>

      <Field label="Your review" htmlFor="review-body" error={errors.body} hint={`${form.body.length} / 5000 characters`}>
        <textarea id="review-body" rows={6} value={form.body} onChange={set('body')} maxLength={5000} required />
      </Field>

      <div className="form-grid">
        <Field label="Watched on" htmlFor="review-date" error={errors.watched_on}>
          <input id="review-date" type="date" max={today} value={form.watched_on} onChange={set('watched_on')} />
        </Field>

        <div className="field">
          <span className="field__label">Spoilers</span>
          <label className="toggle">
            <input
              type="checkbox"
              checked={form.contains_spoilers}
              onChange={(event) => setForm((current) => ({ ...current, contains_spoilers: event.target.checked }))}
            />
            <span className="toggle__track" aria-hidden="true" />
            <span>My review reveals the plot</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          <Send aria-hidden="true" /> {saving ? 'Publishing…' : editing ? 'Save review' : 'Publish review'}
        </button>
      </div>
    </form>
  );
}
