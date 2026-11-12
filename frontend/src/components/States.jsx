import { Link } from 'react-router';
import { Clapperboard, RotateCcw } from 'lucide-react';

const TITLES = {
  0: 'The server is offline',
  403: 'Staff only beyond this door',
  404: 'We could not find that page',
};

// Klaidos būsena (pvz. 404 arba neveikia serveris)
export function ErrorState({ error, onRetry }) {
  const status = error?.status;

  return (
    <div className="state state--error">
      <span className="state__icon"><Clapperboard aria-hidden="true" /></span>
      <h2>{TITLES[status] ?? 'Something went wrong'}</h2>
      <p>{error?.message || 'Something went wrong.'}</p>
      <div className="state__actions">
        {onRetry && status !== 404 && status !== 403 && (
          <button type="button" className="btn" onClick={onRetry}>
            <RotateCcw aria-hidden="true" /> Try again
          </button>
        )}
        <Link to="/" className="btn btn--primary">Back to home</Link>
      </div>
    </div>
  );
}

// Tuščio sąrašo būsena
export function EmptyState({ title = 'Nothing here yet', children }) {
  return (
    <div className="state">
      <span className="state__icon"><Clapperboard aria-hidden="true" /></span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
