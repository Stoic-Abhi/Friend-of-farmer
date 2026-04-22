// src/pages/auth/SignupPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth.service.js';
import {
  AuthShell, Field, Input, SubmitBtn, ErrorBanner, AuthLink,
} from '../../components/auth/AuthShell.jsx';

export default function SignupPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [confirm,    setConfirm]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const errs = {};
    if (!identifier.trim()) errs.identifier = 'Email or phone is required.';
    if (password.length < 8) errs.password = 'Minimum 8 characters.';
    if (!/[A-Z]/.test(password)) errs.password = 'Must include an uppercase letter.';
    if (!/[0-9]/.test(password)) errs.password = 'Must include a number.';
    if (password !== confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);

    try {
      await authService.signup({ identifier: identifier.trim(), password });
      // Navigate to OTP page, carry identifier + context
      navigate('/verify-otp', { state: { identifier: identifier.trim(), context: 'signup' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Join thousands of farmers and consumers on FarmDirect.</p>

      <ErrorBanner message={error} />

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Field label="Email or Phone" error={fieldErrors.identifier}>
          <Input
            id="identifier"
            type="text"
            placeholder="you@example.com or +91 98765 43210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </Field>

        <Field label="Password" error={fieldErrors.password}>
          <Input
            id="password"
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>

        <Field label="Confirm Password" error={fieldErrors.confirm}>
          <Input
            id="confirm"
            type="password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
          />
        </Field>

        <SubmitBtn loading={loading}>Create Account</SubmitBtn>
      </form>

      <AuthLink
        text="Already have an account?"
        linkText="Sign in"
        onClick={() => navigate('/login')}
      />
    </AuthShell>
  );
}
