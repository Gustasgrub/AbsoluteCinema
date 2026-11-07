// Krovimo animacija – kino juostos atgalinis skaičiavimas (3, 2, 1), žr. styles/animations.css
export default function Loader({ label = 'Loading the reel' }) {
  return (
    <div className="loader" role="status">
      <div className="leader" aria-hidden="true">
        <span className="leader__sweep" />
        <span className="leader__cross" />
        <span className="leader__num leader__num--3">3</span>
        <span className="leader__num leader__num--2">2</span>
        <span className="leader__num leader__num--1">1</span>
      </div>
      <p className="loader__label">{label}…</p>
    </div>
  );
}
