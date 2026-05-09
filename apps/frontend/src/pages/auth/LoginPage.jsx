// src/pages/auth/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth.service.js';
import {
  AuthShell, Field, Input, SubmitBtn, ErrorBanner, AuthLink,
} from '../../components/auth/AuthShell.jsx';

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!identifier.trim()) { setError('Email or phone is required.'); return; }
    if (!password)           { setError('Password is required.');      return; }
    setLoading(true);

    try {
      await authService.login({ identifier: identifier.trim(), password });
      // Navigate to OTP page — backend has sent OTP
      navigate('/verify-otp', { state: { identifier: identifier.trim(), context: 'login' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your FarmDirect account.</p>

      <ErrorBanner message={error} />

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <Field label="Email or Phone">
          <Input
            id="login-identifier"
            type="text"
            placeholder="you@example.com or +91 98765 43210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
            autoFocus
          />
        </Field>

        <Field label="Password">
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>

        <SubmitBtn loading={loading}>Sign In</SubmitBtn>
      </form>

      <AuthLink
        text="Don't have an account?"
        linkText="Create one"
        onClick={() => navigate('/signup')}
      />
    </AuthShell>
  );
}