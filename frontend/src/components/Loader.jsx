// Krovimo indikatorius – besisukantis geltonas žiedas (animacija spin, žr. styles/animations.css)
export default function Loader({ label = 'Loading' }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" aria-hidden="true" />
      <p className="loader__label">{label}…</p>
    </div>
  );
}
