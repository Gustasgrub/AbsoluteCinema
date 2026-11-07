import { Link } from 'react-router';
import { Clapperboard, RotateCcw } from 'lucide-react';

const TITLES = {
  0: 'The projector is offline',
  403: 'Staff only beyond this door',
  404: 'This reel is missing',
};

// Klaidos būsena (pvz. 404 arba neveikia serveris)
export function ErrorState({ error, onRetry }) {
  const status = error?.status;

  return (
    <div className="state state--error">
      <Clapperboard className="state__icon" aria-hidden="true" />
      <h2>{TITLES[status] ?? 'The projector jammed'}</h2>
      <p>{error?.message || 'Something went wrong.'}</p>
      <div className="state__actions">
        {onRetry && status !== 404 && status !== 403 && (
          <button type="button" className="btn" onClick={onRetry}>
            <RotateCcw aria-hidden="true" /> Try again
          </button>
        )}
        <Link to="/" className="btn btn--primary">Back to the lobby</Link>
      </div>
    </div>
  );
}

// Tuščio sąrašo būsena
export function EmptyState({ title = 'Nothing on the bill', children }) {
  return (
    <div className="state">
      <Clapperboard className="state__icon" aria-hidden="true" />
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
