import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { Pencil, Save, ShieldCheck, ShieldOff } from 'lucide-react';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Field from '../components/forms/Field.jsx';
import { fieldErrors } from '../utils/fieldErrors.js';
import { DisableTwoFactorDialog, EnableTwoFactorDialog } from '../components/TwoFactorDialogs.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { formatDate, genreLabel, toQuery } from '../utils/format.js';

function EditProfileForm({ profile, onSaved, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: profile.name, bio: profile.bio ?? '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const result = await api(`/users/${profile.id}`, { method: 'PATCH', body: { name: form.name, bio: form.bio || null } });
      toast.success('Profile updated.');
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
      <Field label="Display name" htmlFor="profile-name" error={errors.name}>
        <input id="profile-name" type="text" value={form.name} maxLength={50} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field label="About you" htmlFor="profile-bio" error={errors.bio} hint={`${form.bio.length} / 500`}>
        <textarea id="profile-bio" rows={4} value={form.bio} maxLength={500} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </Field>
      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          <Save aria-hidden="true" /> {saving ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { userId } = useParams();
  const { user: me, updateUser } = useAuth();
  const [params, setParams] = useSearchParams();
  const [modal, setModal] = useState(null); // 'edit' | '2fa-on' | '2fa-off'

  const profileRequest = useApi(`/users/${userId}`);
  const profile = profileRequest.data?.data;
  const page = params.get('page') ?? '';
  const reviewsRequest = useApi(`/users/${userId}/reviews${toQuery({ page, per_page: 6 })}`);
  const reviews = reviewsRequest.data;

  if (profileRequest.error) return <div className="container"><ErrorState error={profileRequest.error} /></div>;
  if (!profile) return <Loader label="Checking the guest list" />;

  const isMe = me?.id === profile.id;
  const { stats } = profile;
  const maxBar = Math.max(1, ...Object.values(stats.rating_distribution));

  return (
    <section className="section container">
      <div className="profile">
        <aside className="profile__side">
          <div className={`pass ${profile.role === 'admin' ? 'pass--staff' : ''}`}>
            <span className="pass__hole" aria-hidden="true" />
            <p className="pass__event">AbsoluteCinema · Season 2026</p>
            <Avatar name={profile.name} id={profile.id} size="xl" />
            <h1 className="pass__name">{profile.name}</h1>
            <p className="pass__role">{profile.role === 'admin' ? 'All access · Staff' : 'Audience member'}</p>
            {profile.bio && <p className="pass__bio">{profile.bio}</p>}
            <dl className="pass__meta">
              <div><dt>Pass no.</dt><dd>#{String(profile.id).padStart(4, '0')}</dd></div>
              <div><dt>Since</dt><dd>{formatDate(profile.joined_at)}</dd></div>
            </dl>
            <div className="pass__barcode" aria-hidden="true" />
          </div>

          {isMe && (
            <div className="profile__actions">
              <button type="button" className="btn" onClick={() => setModal('edit')}>
                <Pencil aria-hidden="true" /> Edit profile
              </button>
              <div className="security-card">
                <p className="eyebrow">Security</p>
                <p>
                  Two-factor authentication is <strong>{profile.two_factor_enabled ? 'on' : 'off'}</strong>.
                </p>
                {profile.two_factor_enabled ? (
                  <button type="button" className="btn btn--danger-outline" onClick={() => setModal('2fa-off')}>
                    <ShieldOff aria-hidden="true" /> Turn off 2FA
                  </button>
                ) : (
                  <button type="button" className="btn btn--ink" onClick={() => setModal('2fa-on')}>
                    <ShieldCheck aria-hidden="true" /> Set up 2FA
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>

        <div className="profile__main">
          <div className="stat-row">
            <div className="stat">
              <span className="stat__value">{stats.reviews_count}</span>
              <span className="stat__label">Reviews written</span>
            </div>
            <div className="stat">
              <span className="stat__value">{stats.average_rating ?? '—'}</span>
              <span className="stat__label">Average score given</span>
            </div>
            <div className="stat">
              <span className="stat__value stat__value--word">{stats.favorite_genre ? genreLabel(stats.favorite_genre) : '—'}</span>
              <span className="stat__label">Favourite genre</span>
            </div>
          </div>

          <div className="histogram" aria-label="How often each score was given">
            <p className="eyebrow">Score distribution</p>
            <div className="histogram__bars">
              {Object.entries(stats.rating_distribution).map(([score, count]) => (
                <div className="histogram__col" key={score} title={`${count} × ${score}/10`}>
                  <span className="histogram__count">{count || ''}</span>
                  <span className="histogram__bar" style={{ '--height': `${(count / maxBar) * 100}%` }} />
                  <span className="histogram__score">{score}</span>
                </div>
              ))}
            </div>
          </div>

          <SectionHeading reel="01" kicker={`${stats.reviews_count} tickets`} title={isMe ? 'Your reviews' : 'Reviews'} />
          {reviewsRequest.loading && !reviews && <Loader />}
          {reviews && reviews.data.length === 0 && <EmptyState title="No reviews yet">Every critic starts with a first ticket.</EmptyState>}
          {reviews && reviews.data.length > 0 && (
            <div className={`review-list ${reviewsRequest.loading ? 'is-refreshing' : ''}`}>
              {reviews.data.map((review) => <ReviewCard key={review.id} review={review} showMovie />)}
            </div>
          )}
          <Pagination meta={reviews?.meta} onPage={(next) => setParams(toQuery({ page: next }).slice(1))} />
        </div>
      </div>

      <Modal open={modal === 'edit'} title="Edit profile" kicker="Wardrobe" onClose={() => setModal(null)}>
        <EditProfileForm
          profile={profile}
          onCancel={() => setModal(null)}
          onSaved={(saved) => {
            setModal(null);
            updateUser({ name: saved.name, bio: saved.bio });
            profileRequest.reload();
          }}
        />
      </Modal>

      <EnableTwoFactorDialog open={modal === '2fa-on'} onClose={() => setModal(null)} onEnabled={profileRequest.reload} />
      <DisableTwoFactorDialog open={modal === '2fa-off'} onClose={() => setModal(null)} onDisabled={profileRequest.reload} />
    </section>
  );
}
