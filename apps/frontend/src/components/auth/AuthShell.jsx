// src/components/auth/AuthShell.jsx
// Shared layout wrapper + small reusable pieces for all auth pages.

/* ── Page shell ─────────────────────────────────────────────── */
export function AuthShell({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🌾 Farm<span>Direct</span></div>
        {children}
      </div>
    </div>
  );
}

/* ── Field wrapper ──────────────────────────────────────────── */
export function Field({ label, error, children }) {
  return (
    <div className="auth-field">
      {label && <label className="auth-label">{label}</label>}
      {children}
      {error && <span className="auth-field-error">{error}</span>}
    </div>
  );
}

/* ── Text input ─────────────────────────────────────────────── */
export function Input({ id, type = 'text', placeholder, value, onChange, disabled, autoFocus, maxLength }) {
  return (
    <input
      id={id}
      type={type}
      className="auth-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      maxLength={maxLength}
      autoComplete={type === 'password' ? 'current-password' : 'off'}
    />
  );
}

/* ── Submit button ──────────────────────────────────────────── */
export function SubmitBtn({ loading, children, disabled }) {
  return (
    <button
      type="submit"
      className="auth-submit-btn"
      disabled={loading || disabled}
    >
      {loading ? <span className="auth-spinner" /> : children}
    </button>
  );
}

/* ── Error banner ───────────────────────────────────────────── */
export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="auth-error-banner">⚠️ {message}</div>;
}

/* ── Link row ───────────────────────────────────────────────── */
export function AuthLink({ text, linkText, onClick }) {
  return (
    <p className="auth-link-row">
      {text}{' '}
      <button type="button" className="auth-link-btn" onClick={onClick}>
        {linkText}
      </button>
    </p>
  );
}
