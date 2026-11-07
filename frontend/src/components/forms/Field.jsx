// Formos laukas: pavadinimas + įvesties elementas + klaidos tekstas
export default function Field({ label, htmlFor, error, hint, children, className = '' }) {
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label className="field__label" htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && <p className="field__error" role="alert">{error}</p>}
    </div>
  );
}

