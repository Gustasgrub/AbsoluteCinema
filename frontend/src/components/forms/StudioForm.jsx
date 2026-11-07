import { useState } from 'react';
import { Save } from 'lucide-react';
import { api } from '../../api/client.js';
import { useToast } from '../Toast.jsx';
import { COUNTRIES } from '../../utils/constants.js';
import Field from './Field.jsx';
import { fieldErrors } from '../../utils/fieldErrors.js';

// Studijos kūrimo (POST) ir redagavimo (PUT) forma
export default function StudioForm({ studio, onSaved, onCancel }) {
  const editing = Boolean(studio);
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: studio?.name ?? '',
    country: studio?.country ?? '',
    founded_year: studio?.founded_year ?? '',
    headquarters: studio?.headquarters ?? '',
    website: studio?.website ?? '',
    brand_color: (studio?.brand_color ?? '#d7372a').toLowerCase(),
    description: studio?.description ?? '',
  });

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    const body = {
      ...form,
      founded_year: form.founded_year === '' ? null : Number(form.founded_year),
      headquarters: form.headquarters || null,
      website: form.website || null,
    };

    try {
      const result = editing
        ? await api(`/studios/${studio.id}`, { method: 'PUT', body })
        : await api('/studios', { method: 'POST', body });
      toast.success(editing ? 'Studio updated.' : 'Studio added to the programme.');
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
      <div className="form-grid">
        <Field label="Studio name" htmlFor="studio-name" error={errors.name} className="span-2">
          <input id="studio-name" type="text" value={form.name} onChange={set('name')} maxLength={100} required />
        </Field>

        <Field label="Country" htmlFor="studio-country" error={errors.country}>
          <input id="studio-country" type="text" list="country-options" value={form.country} onChange={set('country')} required />
          <datalist id="country-options">
            {COUNTRIES.map((country) => <option key={country} value={country} />)}
          </datalist>
        </Field>

        <Field label="Founded (year)" htmlFor="studio-founded" error={errors.founded_year}>
          <input
            id="studio-founded"
            type="number"
            min="1850"
            max={new Date().getFullYear()}
            value={form.founded_year}
            onChange={set('founded_year')}
            required
          />
        </Field>

        <Field label="Headquarters" htmlFor="studio-hq" error={errors.headquarters}>
          <input id="studio-hq" type="text" value={form.headquarters} onChange={set('headquarters')} maxLength={100} />
        </Field>

        <Field label="Website" htmlFor="studio-website" error={errors.website}>
          <input id="studio-website" type="url" placeholder="https://" value={form.website} onChange={set('website')} />
        </Field>

        <Field label="Brand colour" htmlFor="studio-color" error={errors.brand_color} hint="Tints the studio's page and cards" className="span-2">
          <div className="color-field">
            <input id="studio-color" type="color" value={form.brand_color} onChange={set('brand_color')} />
            <code>{form.brand_color.toUpperCase()}</code>
            <span className="color-field__preview" style={{ '--brand': form.brand_color }}>{form.name || 'Preview'}</span>
          </div>
        </Field>

        <Field label="Description" htmlFor="studio-description" error={errors.description} className="span-2">
          <textarea id="studio-description" rows={4} value={form.description} onChange={set('description')} maxLength={2000} required />
        </Field>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          <Save aria-hidden="true" /> {saving ? 'Saving…' : editing ? 'Save changes' : 'Add studio'}
        </button>
      </div>
    </form>
  );
}
