/**
 * src/pages/Profile/ProfileSetupPage.jsx
 *
 * 3-step onboarding wizard after role selection:
 *   Step 1: Personal Info (displayName, bio)
 *   Step 2: Your Location (geolocation + address)
 *   Step 3: Certifications (FARMER only, skippable)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth }  from '../../context/AuthContext.jsx';
import * as profileService from '../../services/profile.service.js';
import { updateGeolocation as patchGeo } from '../../services/profile.service.js';
import AddressSection    from '../../components/profile/AddressSection.jsx';
import CertUploadForm    from '../../components/profile/CertUploadForm.jsx';

const TOTAL_STEPS_FARMER   = 3;
const TOTAL_STEPS_CONSUMER = 2;

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  const isFarmer   = user?.role === 'FARMER';
  const totalSteps = isFarmer ? TOTAL_STEPS_FARMER : TOTAL_STEPS_CONSUMER;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // Step 1 state
  const [displayName, setDisplayName] = useState('');
  const [bio,         setBio]         = useState('');

  // Step 2 state
  const [address, setAddress] = useState({
    addressLine: '', landmark: '', district: '', state: '', pincode: '',
  });
  const [geo, setGeo] = useState(null);

  // Step 3 state (farmer only)
  const [certs, setCerts] = useState([]);
  const [certLoading, setCertLoading] = useState(false);

  async function handleStep1() {
    if (!displayName.trim()) { setError('Display name is required.'); return; }
    setError('');
    setLoading(true);
    try {
      await updateUserProfile({ displayName: displayName.trim(), bio: bio.trim() });
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    setError('');
    setLoading(true);
    try {
      await updateUserProfile({
        addressLine: address.addressLine,
        landmark:    address.landmark,
        district:    address.district,
        state:       address.state,
        pincode:     address.pincode,
      });

      if (isFarmer) {
        setStep(3);
      } else {
        finishSetup();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleGeoLocation(loc) {
    setGeo(loc);
    // Fire-and-forget geolocation update
    patchGeo({ latitude: loc.latitude, longitude: loc.longitude, accuracy: loc.accuracy })
      .catch(console.error);
  }

  async function handleAddCert(certData) {
    setCertLoading(true);
    try {
      const cert = await profileService.addCertification(certData);
      setCerts(prev => [cert, ...prev]);
    } catch (err) {
      setError(err.message);
    } finally {
      setCertLoading(false);
    }
  }

  function finishSetup() {
    navigate(isFarmer ? '/farmer/dashboard' : '/browse', { replace: true });
  }

  const progressPct = Math.round((step / totalSteps) * 100);

  return (
    <div className="setup-page">
      <div className="setup-card">
        {/* Progress bar */}
        <div className="setup-progress">
          <div className="setup-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="setup-step-label">Step {step} of {totalSteps}</div>

        {error && <div className="auth-error-banner">⚠️ {error}</div>}

        {/* ── Step 1: Personal Info ── */}
        {step === 1 && (
          <div className="setup-step">
            <h2 className="setup-title">👋 Tell us about yourself</h2>
            <p className="setup-subtitle">This helps buyers and farmers recognize you.</p>

            <div className="pf-field">
              <label htmlFor="setup-name">Display Name *</label>
              <input
                id="setup-name"
                type="text"
                className="pf-input"
                placeholder={isFarmer ? 'e.g. Raju Gowda' : 'e.g. Priya Sharma'}
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                disabled={loading}
                maxLength={60}
                autoFocus
              />
            </div>

            <div className="pf-field">
              <label htmlFor="setup-bio">Bio</label>
              <textarea
                id="setup-bio"
                className="pf-textarea"
                placeholder={isFarmer
                  ? 'Tell buyers about your farm, growing practices…'
                  : 'What kind of produce are you looking for?'}
                value={bio}
                onChange={e => setBio(e.target.value)}
                disabled={loading}
                maxLength={500}
                rows={3}
              />
              <span className="pf-char-count">{bio.length}/500</span>
            </div>

            <button
              className="pf-submit"
              onClick={handleStep1}
              disabled={loading || !displayName.trim()}
            >
              {loading ? 'Saving…' : 'Continue →'}
            </button>
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div className="setup-step">
            <h2 className="setup-title">📍 Your Location</h2>
            <p className="setup-subtitle">
              {isFarmer
                ? 'Helps buyers find produce near them.'
                : 'Helps us show you nearby farms.'}
            </p>

            <AddressSection
              address={address}
              onChange={setAddress}
              onGeoLocation={handleGeoLocation}
              loading={loading}
            />

            <button
              className="pf-submit"
              onClick={handleStep2}
              disabled={loading}
            >
              {loading ? 'Saving…' : isFarmer ? 'Continue →' : 'Complete Setup ✓'}
            </button>

            <button
              type="button"
              className="pf-skip"
              onClick={() => isFarmer ? setStep(3) : finishSetup()}
              disabled={loading}
            >
              Skip for now
            </button>
          </div>
        )}

        {/* ── Step 3: Certifications (FARMER only) ── */}
        {step === 3 && isFarmer && (
          <div className="setup-step">
            <h2 className="setup-title">📜 Your Certifications</h2>
            <p className="setup-subtitle">
              Add your organic or FSSAI certifications to build buyer trust.
              You can always add more later.
            </p>

            {certs.length > 0 && (
              <div className="cert-list-mini">
                {certs.map(c => (
                  <div key={c.id} className="cert-chip">
                    ✅ {c.certName}
                  </div>
                ))}
              </div>
            )}

            <CertUploadForm onSubmit={handleAddCert} loading={certLoading} />

            <button
              className="pf-submit"
              onClick={finishSetup}
            >
              Complete Setup ✓
            </button>

            <button
              type="button"
              className="pf-skip"
              onClick={finishSetup}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
