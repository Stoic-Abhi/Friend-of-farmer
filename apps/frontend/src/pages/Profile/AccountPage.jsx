/**
 * src/pages/Profile/AccountPage.jsx
 *
 * Full account management page:
 *   - Profile card (name, bio)
 *   - Contact & Address
 *   - Certifications (FARMER)
 *   - Recent Orders (CONSUMER)
 */

import { useState, useEffect } from 'react';
import { useNavigate }  from 'react-router-dom';
import { useAuth }      from '../../context/AuthContext.jsx';
import { useMyOrders }  from '../../hooks/useOrders.js';
import AddressSection   from '../../components/profile/AddressSection.jsx';
import CertificationManager from '../../components/profile/CertificationManager.jsx';
import { updateGeolocation as patchGeo } from '../../services/profile.service.js';

const STATUS_BADGE = {
  PENDING:    's-pending',
  PACKED:     's-packed',
  DISPATCHED: 's-packed',
  DELIVERED:  's-delivered',
  CANCELLED:  's-pending',
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, updateUserProfile, updateGeoInState } = useAuth();
  const profile = user?.profile;

  // Editable state
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [bio,         setBio]         = useState(profile?.bio ?? '');
  const [address, setAddress] = useState({
    addressLine: profile?.addressLine ?? '',
    landmark:    profile?.landmark ?? '',
    district:    profile?.district ?? '',
    state:       profile?.state ?? '',
    pincode:     profile?.pincode ?? '',
  });

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  // Sync from AuthContext when profile loads/changes
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? '');
      setBio(profile.bio ?? '');
      setAddress({
        addressLine: profile.addressLine ?? '',
        landmark:    profile.landmark ?? '',
        district:    profile.district ?? '',
        state:       profile.state ?? '',
        pincode:     profile.pincode ?? '',
      });
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        ...address,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* toast */ }
    setSaving(false);
  }

  function handleGeoLocation(loc) {
    patchGeo({ latitude: loc.latitude, longitude: loc.longitude, accuracy: loc.accuracy })
      .catch(console.error);
    updateGeoInState({
      latitude:     loc.latitude,
      longitude:    loc.longitude,
      geoAccuracy:  loc.accuracy,
      geoUpdatedAt: new Date().toISOString(),
    });
  }

  const identifier = user?.email ?? user?.phone ?? '';

  return (
    <div className="account-page">
      <h1 className="account-title">⚙️ My Account</h1>

      {/* Profile Card */}
      <div className="account-section">
        <div className="account-section-title">👤 Profile</div>

        <div className="account-profile-card">
          <div className="account-avatar">
            {profile?.avatarUrl
              ? <img src={profile.avatarUrl} alt={displayName} />
              : <span className="avatar-emoji">{user?.role === 'FARMER' ? '👨‍🌾' : '🛒'}</span>
            }
          </div>

          <div className="account-profile-fields">
            <div className="pf-field">
              <label>Display Name</label>
              <input
                type="text"
                className="pf-input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                maxLength={60}
              />
            </div>

            <div className="pf-field">
              <label>Bio</label>
              <textarea
                className="pf-textarea"
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={500}
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Address */}
      <div className="account-section">
        <div className="account-section-title">📍 Contact & Address</div>

        <div className="account-contact-row">
          <span className="contact-label">
            {user?.email ? '📧' : '📱'} {identifier}
          </span>
          <span className="contact-note">(set at signup — cannot be changed)</span>
        </div>

        <AddressSection
          address={address}
          onChange={setAddress}
          onGeoLocation={handleGeoLocation}
          loading={saving}
        />

        <div className="account-save-row">
          <button className="pf-submit" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Certifications — FARMER only */}
      {user?.role === 'FARMER' && <CertificationManager />}

      {/* Recent Orders — CONSUMER only */}
      {user?.role === 'CONSUMER' && <OrderHistorySection />}
    </div>
  );
}

/* ── Compact order history for consumer account ── */
function OrderHistorySection() {
  const { orders, isLoading } = useMyOrders();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="account-section">
        <div className="account-section-title">📦 Recent Orders</div>
        <div style={{ padding: '1.5rem', color: 'var(--muted)' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="account-section">
      <div className="account-section-title">📦 Recent Orders</div>
      {orders.length === 0 ? (
        <div className="empty" style={{ padding: '1.5rem' }}>
          <span className="empty-icon">📦</span>
          No orders yet. Go browse some fresh produce!
        </div>
      ) : (
        <>
          {orders.slice(0, 5).map(order => (
            <div
              key={order.id}
              className="account-order-row"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <span className="account-order-id">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
              <span className={`status-badge ${STATUS_BADGE[order.status] ?? 's-pending'}`}>
                {order.status}
              </span>
              <span className="account-order-total">₹{order.totalRs}</span>
              <span className="account-order-date">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          ))}
          <button className="auth-link-btn" onClick={() => navigate('/orders')}>
            View all orders →
          </button>
        </>
      )}
    </div>
  );
}
