import { useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../api/client.js';
import { useApi } from '../../hooks/useApi.js';
import { useToast } from '../Toast.jsx';
import { AGE_RATINGS, GENRES } from '../../utils/constants.js';
import { genreLabel } from '../../utils/format.js';
import Poster from '../Poster.jsx';
import Field from './Field.jsx';
import { fieldErrors } from '../../utils/fieldErrors.js';

// Filmo / serialo kūrimo ir redagavimo forma (su gyva plakato peržiūra)
export default function MovieForm({ studio, movie, onSaved, onCancel }) {
  const editing = Boolean(movie);
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: movie?.title ?? '',
    tagline: movie?.tagline ?? '',
    type: movie?.type ?? 'movie',
    genre: movie?.genre ?? 'drama',
    director: movie?.director ?? '',
    release_date: movie?.release_date ?? '',
    runtime_minutes: movie?.runtime_minutes ?? '',
    seasons: movie?.seasons ?? '',
    age_rating: movie?.age_rating ?? '13+',
    poster_url: movie?.poster_url ?? '',
    synopsis: movie?.synopsis ?? '',
    studio_id: movie?.studio_id ?? studio.id,
  });

  // Redaguojant galima perkelti filmą į kitą studiją – reikia studijų sąrašo
  const { data: studios } = useApi(editing ? '/studios?per_page=50' : null);

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const isSeries = form.type === 'series';

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const body = {
      ...form,
      tagline: form.tagline || null,
      poster_url: form.poster_url || null,
      runtime_minutes: form.runtime_minutes === '' ? null : Number(form.runtime_minutes),
      seasons: isSeries && form.seasons !== '' ? Number(form.seasons) : null,
      studio_id: Number(form.studio_id),
    };

    try {
      const result = editing
        ? await api(`/studios/${movie.studio_id}/movies/${movie.id}`, { method: 'PUT', body })
        : await api(`/studios/${studio.id}/movies`, { method: 'POST', body });
      toast.success(editing ? 'Title updated.' : `“${result.data.title}” added to the catalogue.`);
      onSaved(result.data);
    } catch (error) {
      if (error.status === 422) setErrors(fieldErrors(error));
      else toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  const preview = {
    ...form,
    id: movie?.id ?? 7,
    release_year: form.release_date ? Number(form.release_date.slice(0, 4)) : '',
    studio: movie?.studio ?? studio,
  };

  return (
    <form className="form form--with-preview" onSubmit={handleSubmit} noValidate>
      <div className="form-preview" aria-hidden="true">
        <Poster movie={preview} />
        <p className="form-preview__label">Live poster preview</p>
      </div>

      <div className="form-grid">
        <Field label="Title" htmlFor="movie-title" error={errors.title} className="span-2">
          <input id="movie-title" type="text" value={form.title} onChange={set('title')} maxLength={150} required />
        </Field>

        <fieldset className="field span-2">
          <legend className="field__label">Type</legend>
          <div className="segmented">
            {['movie', 'series'].map((type) => (
              <label key={type} className="segmented__option">
                <input type="radio" name="type" value={type} checked={form.type === type} onChange={set('type')} />
                <span>{type === 'movie' ? 'Movie' : 'Series'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Genre" htmlFor="movie-genre" error={errors.genre}>
          <select id="movie-genre" value={form.genre} onChange={set('genre')}>
            {GENRES.map((genre) => <option key={genre} value={genre}>{genreLabel(genre)}</option>)}
          </select>
        </Field>

        <Field label={isSeries ? 'Created by' : 'Directed by'} htmlFor="movie-director" error={errors.director}>
          <input id="movie-director" type="text" value={form.director} onChange={set('director')} maxLength={120} required />
        </Field>

        <Field label={isSeries ? 'Premiere date' : 'Release date'} htmlFor="movie-date" error={errors.release_date}>
          <input id="movie-date" type="date" value={form.release_date} onChange={set('release_date')} required />
        </Field>

        <Field label={isSeries ? 'Episode length (min)' : 'Runtime (min)'} htmlFor="movie-runtime" error={errors.runtime_minutes}>
          <input id="movie-runtime" type="number" min="1" max="999" value={form.runtime_minutes} onChange={set('runtime_minutes')} required />
        </Field>

        {isSeries && (
          <Field label="Seasons" htmlFor="movie-seasons" error={errors.seasons}>
            <input id="movie-seasons" type="number" min="1" max="99" value={form.seasons} onChange={set('seasons')} required />
          </Field>
        )}

        <fieldset className={`field ${isSeries ? '' : 'span-2'}`}>
          <legend className="field__label">Age rating</legend>
          <div className="chips">
            {AGE_RATINGS.map((rating) => (
              <label key={rating} className="chip">
                <input type="radio" name="age_rating" value={rating} checked={form.age_rating === rating} onChange={set('age_rating')} />
                <span>{rating}</span>
              </label>
            ))}
          </div>
          {errors.age_rating && <p className="field__error">{errors.age_rating}</p>}
        </fieldset>

        <Field label="Tagline" htmlFor="movie-tagline" error={errors.tagline} className="span-2">
          <input id="movie-tagline" type="text" value={form.tagline} onChange={set('tagline')} maxLength={200} />
        </Field>

        <Field label="Poster image URL" htmlFor="movie-poster" error={errors.poster_url} hint="Optional – without it a poster is generated" className="span-2">
          <input id="movie-poster" type="url" placeholder="https://…/poster.jpg" value={form.poster_url} onChange={set('poster_url')} />
        </Field>

        {editing && studios && (
          <Field label="Studio" htmlFor="movie-studio" error={errors.studio_id} className="span-2">
            <select id="movie-studio" value={form.studio_id} onChange={set('studio_id')}>
              {studios.data.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
            </select>
          </Field>
        )}

        <Field label="Synopsis" htmlFor="movie-synopsis" error={errors.synopsis} className="span-2">
          <textarea id="movie-synopsis" rows={4} value={form.synopsis} onChange={set('synopsis')} maxLength={3000} required />
        </Field>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          <Save aria-hidden="true" /> {saving ? 'Saving…' : editing ? 'Save changes' : 'Add title'}
        </button>
      </div>
    </form>
  );
}
