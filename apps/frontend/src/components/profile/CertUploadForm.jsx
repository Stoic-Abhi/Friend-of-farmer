/**
 * src/components/profile/CertUploadForm.jsx
 *
 * Form to add a new farmer certification.
 * Accepts cert metadata + document URL (upload is manual for now).
 */

import { useState } from 'react';

const CERT_TYPES = [
  { value: 'ORGANIC_NPOP', label: '🌿 NPOP Organic' },
  { value: 'ORGANIC_PGS',  label: '🤝 PGS Organic' },
  { value: 'FSSAI',        label: '🔒 FSSAI' },
  { value: 'APEDA',        label: '📦 APEDA' },
  { value: 'GOOD_AGRICULTURAL_PRACTICE', label: '🌾 Good Agricultural Practice' },
  { value: 'ISO_22000',    label: '📋 ISO 22000' },
  { value: 'OTHER',        label: '📄 Other' },
];

export default function CertUploadForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    certType:    'ORGANIC_NPOP',
    certName:    '',
    issuedBy:    '',
    certNumber:  '',
    expiresAt:   '',
    documentUrl: '',
  });

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.certName.trim() || !form.documentUrl.trim()) return;
    onSubmit({
      ...form,
      certName:    form.certName.trim(),
      issuedBy:    form.issuedBy.trim() || null,
      certNumber:  form.certNumber.trim() || null,
      expiresAt:   form.expiresAt || null,
      documentUrl: form.documentUrl.trim(),
    });
    setForm({
      certType: 'ORGANIC_NPOP', certName: '', issuedBy: '',
      certNumber: '', expiresAt: '', documentUrl: '',
    });
  }

  return (
    <form className="cert-upload-form" onSubmit={handleSubmit}>
      <div className="pf-row">
        <div className="pf-field">
          <label>Type</label>
          <select
            className="pf-input"
            value={form.certType}
            onChange={e => handleChange('certType', e.target.value)}
            disabled={loading}
          >
            {CERT_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="pf-field">
          <label>Certificate Name *</label>
          <input
            type="text"
            className="pf-input"
            placeholder="e.g. NPOP Organic Certificate"
            value={form.certName}
            onChange={e => handleChange('certName', e.target.value)}
            disabled={loading}
            maxLength={120}
          />
        </div>
      </div>

      <div className="pf-row">
        <div className="pf-field">
          <label>Issued By</label>
          <input
            type="text"
            className="pf-input"
            placeholder="e.g. Control Union"
            value={form.issuedBy}
            onChange={e => handleChange('issuedBy', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="pf-field">
          <label>Certificate Number</label>
          <input
            type="text"
            className="pf-input"
            placeholder="Registration number"
            value={form.certNumber}
            onChange={e => handleChange('certNumber', e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="pf-row">
        <div className="pf-field">
          <label>Expires At</label>
          <input
            type="date"
            className="pf-input"
            value={form.expiresAt}
            onChange={e => handleChange('expiresAt', e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="pf-field">
          <label>Document URL *</label>
          <input
            type="url"
            className="pf-input"
            placeholder="https://... (PDF or image link)"
            value={form.documentUrl}
            onChange={e => handleChange('documentUrl', e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        className="pf-submit pf-submit-sm"
        disabled={loading || !form.certName.trim() || !form.documentUrl.trim()}
      >
        {loading ? 'Adding…' : '+ Add Certification'}
      </button>
    </form>
  );
}
