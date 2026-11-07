import { ratingWord } from '../../utils/format.js';

// Įvertinimo pasirinkimas 1–10: tai paprasti radio mygtukai, stilizuoti kaip kino kadrai
export default function RatingInput({ value, onChange, error }) {
  return (
    <fieldset className={`field rating-input ${error ? 'has-error' : ''}`}>
      <legend className="field__label">Your score</legend>
      <div className="rating-input__frames">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
          <label key={score} className={`rating-frame ${score <= value ? 'is-on' : ''}`}>
            <input
              type="radio"
              name="rating"
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
            />
            <span>{score}</span>
          </label>
        ))}
      </div>
      <p className="rating-input__word">
        {value ? `${value} / 10 — ${ratingWord(value)}` : 'Pick a score from 1 to 10'}
      </p>
      {error && <p className="field__error" role="alert">{error}</p>}
    </fieldset>
  );
}
