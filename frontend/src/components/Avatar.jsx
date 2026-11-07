import { initials } from '../utils/format.js';

const COLORS = ['#d7372a', '#1f6f68', '#c98b10', '#5b3a8c', '#1f3a93', '#b85c1e', '#2f6b4f'];

// Naudotojo inicialai spalvotame apskritime (spalva priklauso nuo ID)
export default function Avatar({ name, id = 0, size = 'md' }) {
  return (
    <span className={`avatar avatar--${size}`} style={{ '--avatar-color': COLORS[id % COLORS.length] }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
