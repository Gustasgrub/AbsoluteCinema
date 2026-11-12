import { Star } from 'lucide-react';
import { ratingWord } from '../../utils/format.js';

/*
 * Įvertinimo pasirinkimas 1–10. Viduje – paprasti radio mygtukai,
 * o jų <label> atrodo kaip žvaigždutės (nuspalvinamos visos iki pasirinkto balo).
 */
export default function RatingInput({ value, onChange, error }) {
  return (
    <fieldset className={`field rating-input ${error ? 'has-error' : ''}`}>
      <legend className="field__label">Your rating</legend>

      <div className="rating-input__stars">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
          <label key={score} className={`star-option ${score <= value ? 'is-on' : ''}`}>
            <input type="radio" name="rating" value={score} checked={value === score} onChange={() => onChange(score)} />
            <Star aria-hidden="true" />
            <span className="sr-only">{score} out of 10</span>
          </label>
        ))}
      </div>

      <p className="rating-input__word">
        {value ? `${value}/10 · ${ratingWord(value)}` : 'Pick a score from 1 to 10'}
      </p>
      {error && <p className="field__error" role="alert">{error}</p>}
    </fieldset>
  );
}
