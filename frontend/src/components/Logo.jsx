// Logotipas: kameros diafragma (vektorinė SVG grafika) + žodžių ženklas
export function ApertureIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <polygon className="aperture__light" points="27,20 23.5,26.06 16.5,26.06 13,20 16.5,13.94 23.5,13.94" />
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <line x1="27" y1="20" x2="32.65" y2="29.79" />
        <line x1="23.5" y1="26.06" x2="17.85" y2="35.85" />
        <line x1="16.5" y1="26.06" x2="5.2" y2="26.06" />
        <line x1="13" y1="20" x2="7.35" y2="10.21" />
        <line x1="16.5" y1="13.94" x2="22.15" y2="4.15" />
        <line x1="23.5" y1="13.94" x2="34.8" y2="13.94" />
      </g>
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="logo">
      <ApertureIcon className="logo__mark" />
      <span className="logo__word">
        <span>Absolute</span>
        <span>Cinema</span>
      </span>
    </span>
  );
}
