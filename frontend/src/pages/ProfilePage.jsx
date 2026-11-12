import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { CalendarDays, Trash2 } from 'lucide-react';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { formatDate, toQuery } from '../utils/format.js';

/*
 * Naudotojo profilis: vardas, rolė ir jo parašytos recenzijos.
 * Administratorius mato mygtuką "Delete user" (_links.delete).
 */
export default function ProfilePage() {
  const { userId } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const profileRequest = useApi(`/users/${userId}`);
  const profile = profileRequest.data?.data;
  const page = params.get('page') ?? '';
  const reviewsRequest = useApi(`/users/${userId}/reviews${toQuery({ page, per_page: 6 })}`);
  const reviews = reviewsRequest.data;

  async function deleteUser() {
    try {
      await api(`/users/${profile.id}`, { method: 'DELETE' });
      toast.success(`${profile.name} was deleted together with their reviews.`);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
      setConfirmDelete(false);
    }
  }

  if (profileRequest.error) return <div className="container"><ErrorState error={profileRequest.error} /></div>;
  if (!profile) return <Loader label="Loading profile" />;

  const isMe = me?.id === profile.id;

  return (
    <section className="section container">
      <div className="profile">
        <aside className="profile__side">
          <div className="profile-card">
            <Avatar name={profile.name} id={profile.id} size="xl" />
            <h1 className="profile-card__name">{profile.name}</h1>
            <span className={`tag ${profile.role === 'admin' ? 'tag--yellow' : ''}`}>
              {profile.role === 'admin' ? 'Administrator' : 'Member'}
            </span>
            <p className="profile-card__joined">
              <CalendarDays aria-hidden="true" /> Joined {formatDate(profile.joined_at)}
            </p>
            {profile._links.delete && (
              <button type="button" className="btn btn--gray btn--danger-text" onClick={() => setConfirmDelete(true)}>
                <Trash2 aria-hidden="true" /> Delete user
              </button>
            )}
          </div>
        </aside>

        <div>
          <SectionHeading title={isMe ? 'Your reviews' : 'Reviews'} count={profile.reviews_count} />
          {reviewsRequest.loading && !reviews && <Loader />}
          {reviews && reviews.data.length === 0 && <EmptyState title="No reviews yet">Every critic starts with a first review.</EmptyState>}
          {reviews && reviews.data.length > 0 && (
            <div className={`review-list ${reviewsRequest.loading ? 'is-refreshing' : ''}`}>
              {reviews.data.map((review) => <ReviewCard key={review.id} review={review} showMovie />)}
            </div>
          )}
          <Pagination meta={reviews?.meta} onPage={(next) => setParams(toQuery({ page: next }).slice(1))} />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete ${profile.name}?`}
        message={`All ${profile.reviews_count} reviews written by this user will be deleted too.`}
        confirmLabel="Delete user"
        onConfirm={deleteUser}
        onClose={() => setConfirmDelete(false)}
      />
    </section>
  );
}
