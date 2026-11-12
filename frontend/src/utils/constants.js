// Turi sutapti su backend reikšmėmis (app/Models/Movie.php)
export const GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 'family',
  'fantasy', 'horror', 'musical', 'mystery', 'romance', 'sci-fi', 'thriller', 'war',
];

export const AGE_RATINGS = ['ALL', '7+', '13+', '16+', '18+'];

// Dešimtmečiai filmų filtrui pagal išleidimo metus (studijos puslapyje)
export const DECADES = [1980, 1990, 2000, 2010, 2020];

export const MOVIE_SORTS = [
  { value: 'title', label: 'Title A–Z' },
  { value: '-rating', label: 'Highest rated' },
  { value: '-release_date', label: 'Newest first' },
  { value: 'release_date', label: 'Oldest first' },
  { value: '-reviews', label: 'Most reviewed' },
];

export const STUDIO_SORTS = [
  { value: 'name', label: 'Name A–Z' },
  { value: '-rating', label: 'Highest rated' },
  { value: '-movies', label: 'Most titles' },
  { value: 'founded_year', label: 'Oldest first' },
  { value: '-founded_year', label: 'Youngest first' },
];

export const REVIEW_SORTS = [
  { value: '-created', label: 'Newest' },
  { value: '-rating', label: 'Highest score' },
  { value: 'rating', label: 'Lowest score' },
];

export const COUNTRIES = [
  'Japan', 'USA', 'United Kingdom', 'Lithuania', 'France', 'Germany', 'South Korea', 'Italy', 'Spain', 'Canada',
];
