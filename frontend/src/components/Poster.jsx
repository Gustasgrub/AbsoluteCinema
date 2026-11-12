import { useState } from 'react';
import { genreLabel } from '../utils/format.js';

/*
 * Plakatas. Jei filmas turi poster_url – rodomas paveikslėlis (<img>),
 * kitaip nupiešiamas paprastas SVG plakatas: žanro spalvos fonas, studijos spalvos apskritimas ir pavadinimas.
 * SVG – vektorinė grafika, todėl plakatas ryškus bet kokio dydžio ekrane.
 */

// Žanro spalvos: [fonas, tekstas]
const COLORS = {
  action: ['#c9302c', '#17130e'],
  adventure: ['#2f6b4f', '#f2eadc'],
  animation: ['#f2a93b', '#17130e'],
  comedy: ['#f4d48f', '#17130e'],
  crime: ['#17130e', '#f2eadc'],
  documentary: ['#d9ccb3', '#17130e'],
  drama: ['#1f3a93', '#f2eadc'],
  family: ['#86b8ac', '#17130e'],
  fantasy: ['#4b2f78', '#f2eadc'],
  horror: ['#0d0b09', '#f2eadc'],
  musical: ['#a8231b', '#f2eadc'],
  mystery: ['#1d2b2f', '#f2eadc'],
  romance: ['#e3a39b', '#17130e'],
  'sci-fi': ['#0f2236', '#f2eadc'],
  thriller: ['#2a2622', '#f2a93b'],
  war: ['#4a4a3a', '#f2eadc'],
};

// Pavadinimą suskaido į eilutes po kelis žodžius (eilutėje iki 12 raidžių)
function splitTitle(title) {
  const lines = [];
  for (const word of title.toUpperCase().split(' ')) {
    const last = lines[lines.length - 1];
    if (last && `${last} ${word}`.length <= 12) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

export default function Poster({ movie }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (movie.poster_url && !imageFailed) {
    return (
      <img
        className="poster poster--image"
        src={movie.poster_url}
        alt={`${movie.title} poster`}
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    );
  }

  const [background, text] = COLORS[movie.genre] || COLORS.drama;
  const brand = movie.studio?.brand_color || '#f5c518';
  const lines = splitTitle(movie.title || 'Untitled');
  const longest = Math.max(...lines.map((line) => line.length));
  // Kuo ilgesnė eilutė arba daugiau eilučių – tuo mažesnės raidės
  const fontSize = Math.min(44, 176 / (longest * 0.48), 150 / lines.length);

  return (
    <svg className="poster" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${movie.title} poster`}>
      <rect width="200" height="300" fill={background} />
      <circle cx="100" cy="100" r="58" fill={brand} />
      <text x="12" y="18" className="poster__small" fill={text}>
        {`${genreLabel(movie.genre)} · ${movie.release_year ?? ''}`.toUpperCase()}
      </text>
      {lines.map((line, index) => (
        <text key={index} x="12" y={268 - (lines.length - 1 - index) * fontSize * 0.95} className="poster__title" fill={text} fontSize={fontSize}>
          {line}
        </text>
      ))}
      <rect y="292" width="200" height="8" fill={brand} />
    </svg>
  );
}
