/**
 * src/components/profile/CertificationManager.jsx
 *
 * Lists existing certifications + add new (farmer only).
 * Used in AccountPage.
 */

import { useEffect, useState } from 'react';
import * as profileService from '../../services/profile.service.js';
import CertificationCard   from './CertificationCard.jsx';
import CertUploadForm      from './CertUploadForm.jsx';

export default function CertificationManager() {
  const [certs,     setCerts]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adding,    setAdding]    = useState(false);
  const [showForm,  setShowForm]  = useState(false);

  useEffect(() => {
    profileService.getMyCerts()
      .then(c => setCerts(Array.isArray(c) ? c : []))
      .catch(() => setCerts([]))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleAdd(data) {
    setAdding(true);
    try {
      const cert = await profileService.addCertification(data);
      setCerts(prev => [cert, ...prev]);
      setShowForm(false);
    } catch { /* handled by form */ }
    setAdding(false);
  }

  async function handleDelete(id) {
    try {
      await profileService.deleteCert(id);
      setCerts(prev => prev.filter(c => c.id !== id));
    } catch { /* silent */ }
  }

  if (isLoading) {
    return (
      <div className="account-section">
        <div className="account-section-title">📜 Certifications</div>
        <div style={{ padding: '1.5rem', color: 'var(--muted)' }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="account-section">
      <div className="account-section-header">
        <span className="account-section-title">📜 Certifications</span>
        <button className="pf-submit pf-submit-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showForm && <CertUploadForm onSubmit={handleAdd} loading={adding} />}

      {certs.length === 0 ? (
        <div className="empty" style={{ padding: '1.5rem' }}>
          <span className="empty-icon">📜</span>
          No certifications yet. Add one to build buyer trust!
        </div>
      ) : (
        <div className="cert-list">
          {certs.map(c => (
            <CertificationCard key={c.id} cert={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
