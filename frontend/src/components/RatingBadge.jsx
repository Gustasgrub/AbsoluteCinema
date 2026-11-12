import { Star } from 'lucide-react';

// Vidutinis įvertinimas: geltona žvaigždutė + balas (+ recenzijų skaičius pilkai), kaip IMDb
export default function RatingBadge({ value, count, size = 'md', showMax = false }) {
  const empty = value === null || value === undefined;

  return (
    <span
      className={`rating rating--${size} ${empty ? 'is-empty' : ''}`}
      title={empty ? 'No reviews yet' : `Average ${value} / 10 from ${count ?? '?'} reviews`}
    >
      <Star className="rating__star" aria-hidden="true" />
      <strong>
        {empty ? '—' : Number(value).toFixed(1)}
        {showMax && !empty && <span className="rating__max">/10</span>}
      </strong>
      {count !== undefined && <span className="rating__count">({count})</span>}
    </span>
  );
}
