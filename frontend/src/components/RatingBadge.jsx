// Vidutinis įvertinimas, pavaizduotas kaip festivalio antspaudas
export default function RatingBadge({ value, count, size = 'md' }) {
  const empty = value === null || value === undefined;

  return (
    <span
      className={`rating-badge rating-badge--${size} ${empty ? 'is-empty' : ''}`}
      title={empty ? 'No reviews yet' : `Average ${value} / 10 from ${count ?? '?'} reviews`}
    >
      <strong>{empty ? '—' : Number(value).toFixed(1)}</strong>
      {count !== undefined && <small>{count} {count === 1 ? 'review' : 'reviews'}</small>}
    </span>
  );
}
