// src/pages/auth/SelectRolePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AuthShell, SubmitBtn, ErrorBanner } from '../../components/auth/AuthShell.jsx';

const ROLES = [
  { value:'FARMER',   icon:'🚜', title:"I'm a Farmer",   desc:'List and sell your fresh produce directly to consumers.' },
  { value:'CONSUMER', icon:'🛒', title:"I'm a Consumer",  desc:'Buy fresh produce directly from local farmers.' },
];

export default function SelectRolePage() {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const [selected, setSelected] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selected) { setError('Please select a role to continue.'); return; }
    setError('');
    setLoading(true);
    try {
      const user = await setRole(selected);
      // If profile already exists (returning user), go to dashboard; otherwise setup
      if (user?.profile?.displayName) {
        navigate(user?.role === 'FARMER' ? '/farmer/dashboard' : '/browse', { replace: true });
      } else {
        navigate('/profile/setup', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Welcome to FarmDirect?</h1>
      <p className="auth-subtitle">Choose your role. This cannot be changed later.</p>

      <ErrorBanner message={error} />

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="role-grid">
          {ROLES.map(role => (
            <button
              key={role.value}
              type="button"
              className={`role-card${selected === role.value ? ' selected' : ''}`}
              onClick={() => setSelected(role.value)}
            >
              <span className="role-card-icon">{role.icon}</span>
              <div className="role-card-title">{role.title}</div>
              <div className="role-card-desc">{role.desc}</div>
            </button>
          ))}
        </div>
        <SubmitBtn loading={loading} disabled={!selected}>
          Continue as {selected === 'FARMER' ? 'Farmer' : selected === 'CONSUMER' ? 'Consumer' : '…'}
        </SubmitBtn>
      </form>
    </AuthShell>
  );
}
