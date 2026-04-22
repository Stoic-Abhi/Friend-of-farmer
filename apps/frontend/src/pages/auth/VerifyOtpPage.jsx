// src/pages/auth/VerifyOtpPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext.jsx';
import { verifyOtp }   from '../../services/auth.service.js';
import { useOtpTimer } from '../../hooks/useOtpTimer.js';
import OtpInput        from '../../components/auth/OtpInput.jsx';
import { AuthShell, SubmitBtn, ErrorBanner } from '../../components/auth/AuthShell.jsx';

export default function VerifyOtpPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { finishOtpVerification } = useAuth();

  const { identifier, context } = location.state ?? {};

  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const { timeLabel, isExpired, isResending, resendError, handleResend } =
    useOtpTimer(identifier ?? '');

  if (!identifier || !context) {
    navigate('/login', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    setError('');
    setLoading(true);

    try {
      // Step 1: verify OTP — backend sets the HTTP-only cookie
      await verifyOtp({ identifier, otp, context });

      // Step 2: fetch full user profile (id, email, phone, role)
      const user = await finishOtpVerification();

      // Step 3: redirect based on role
      if (!user || !user.role) {
        navigate('/select-role', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Verify your identity</h1>
      <p className="auth-subtitle">We sent a 6-digit code to</p>
      <div className="auth-identifier-chip">{identifier}</div>

      <ErrorBanner message={error || resendError} />

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <OtpInput value={otp} onChange={setOtp} disabled={loading} />

        <div className="otp-timer-row">
          <span className={`otp-timer${isExpired ? ' expired' : ''}`}>
            {isExpired ? 'Code expired' : `Expires in ${timeLabel}`}
          </span>
          <button
            type="button"
            className="otp-resend-btn"
            onClick={handleResend}
            disabled={!isExpired || isResending}
          >
            {isResending ? 'Sending…' : 'Resend OTP'}
          </button>
        </div>

        <SubmitBtn loading={loading} disabled={otp.length < 6 || isExpired}>
          Verify &amp; Continue
        </SubmitBtn>
      </form>

      <p className="auth-link-row">
        Wrong contact?{' '}
        <button
          type="button"
          className="auth-link-btn"
          onClick={() => navigate(context === 'signup' ? '/signup' : '/login')}
        >
          Go back
        </button>
      </p>
    </AuthShell>
  );
}
