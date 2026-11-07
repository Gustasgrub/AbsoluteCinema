// Mažos pagalbinės funkcijos duomenims gražiai parodyti

const NBSP = String.fromCharCode(160); // nelaužiamas tarpas, kad "2h 05m" nesuskiltų į dvi eilutes

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatRuntime(minutes) {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const rest = String(minutes % 60).padStart(2, '0');
  return hours ? `${hours}h${NBSP}${rest}m` : `${minutes}${NBSP}min`;
}

export function genreLabel(genre) {
  if (!genre) return '';
  return genre === 'sci-fi' ? 'Sci-Fi' : genre.charAt(0).toUpperCase() + genre.slice(1);
}

export function ratingWord(rating) {
  if (rating >= 10) return 'Absolute cinema';
  if (rating >= 9) return 'Masterpiece';
  if (rating >= 8) return 'Great';
  if (rating >= 7) return 'Good';
  if (rating >= 5) return 'Okay';
  if (rating >= 3) return 'Weak';
  return 'Awful';
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

// Paverčia { genre: 'drama', page: 2, empty: '' } į "?genre=drama&page=2"
export function toQuery(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

export function movieUrl(movie) {
  return `/studios/${movie.studio_id}/movies/${movie.id}`;
}
