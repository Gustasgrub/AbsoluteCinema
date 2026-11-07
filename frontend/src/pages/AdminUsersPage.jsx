import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, Trash2 } from 'lucide-react';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import { ErrorState } from '../components/States.jsx';
import { useToast } from '../components/Toast.jsx';
import { formatDate, toQuery } from '../utils/format.js';

// Administratoriaus puslapis: naudotojų sąrašas, rolių keitimas ir šalinimas
export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const [deleting, setDeleting] = useState(null);

  const filters = { search: params.get('search') ?? '', role: params.get('role') ?? '', page: params.get('page') ?? '' };
  const { data, loading, error, reload } = useApi(`/users${toQuery(filters)}`);

  function updateFilters(changes) {
    setParams(toQuery({ ...filters, ...changes, page: changes.page ?? '' }).slice(1));
  }

  async function changeRole(user, role) {
    try {
      await api(`/users/${user.id}`, { method: 'PATCH', body: { role } });
      toast.success(`${user.name} is now ${role === 'admin' ? 'an administrator' : 'a member'}.`);
      reload();
    } catch (requestError) {
      toast.error(requestError.message);
    }
  }

  async function deleteUser() {
    try {
      await api(`/users/${deleting.id}`, { method: 'DELETE' });
      toast.success(`${deleting.name} was removed.`);
      setDeleting(null);
      reload();
    } catch (requestError) {
      toast.error(requestError.message);
      setDeleting(null);
    }
  }

  return (
    <section className="section container">
      <SectionHeading reel="00" kicker="Staff only" title="The guest list" as="h1" />

      <form
        className="filter-bar"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          updateFilters({ search });
        }}
      >
        <label className="filter-bar__search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search users</span>
          <input type="search" placeholder="Name or email…" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label className="filter-bar__field">
          <span>Role</span>
          <select value={filters.role} onChange={(event) => updateFilters({ role: event.target.value })}>
            <option value="">Everyone</option>
            <option value="member">Members</option>
            <option value="admin">Administrators</option>
          </select>
        </label>
        <button type="submit" className="btn btn--ink">Search</button>
      </form>

      {loading && !data && <Loader />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {data && (
        <div className={`table-wrap ${loading ? 'is-refreshing' : ''}`}>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Reviews</th>
                <th scope="col">Joined</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => (
                <tr key={user.id}>
                  <td data-label="Member">
                    <Link to={`/users/${user.id}`} className="table__user">
                      <Avatar name={user.name} id={user.id} size="sm" /> {user.name}
                    </Link>
                  </td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Role">
                    {user.id === me?.id ? (
                      <span className="role-pill role-pill--admin">admin (you)</span>
                    ) : (
                      <select
                        className="role-select"
                        aria-label={`Role of ${user.name}`}
                        value={user.role}
                        onChange={(event) => changeRole(user, event.target.value)}
                      >
                        <option value="member">member</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td data-label="Reviews">{user.reviews_count}</td>
                  <td data-label="Joined">{formatDate(user.joined_at)}</td>
                  <td className="table__actions">
                    {user._links.delete && (
                      <button type="button" className="btn btn--icon btn--danger-outline" aria-label={`Delete ${user.name}`} onClick={() => setDeleting(user)}>
                        <Trash2 aria-hidden="true" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination meta={data?.meta} onPage={(page) => updateFilters({ page })} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Remove ${deleting?.name}?`}
        message={`Their ${deleting?.reviews_count ?? 0} reviews will be deleted as well.`}
        confirmLabel="Remove user"
        onConfirm={deleteUser}
        onClose={() => setDeleting(null)}
      />
    </section>
  );
}
