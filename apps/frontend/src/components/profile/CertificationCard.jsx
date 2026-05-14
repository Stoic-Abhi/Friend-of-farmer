/**
 * src/components/profile/CertificationCard.jsx
 *
 * Displays a single certification with status badge.
 */

const STATUS_STYLES = {
  PENDING:  { cls: 'cert-pending',  label: '⏳ Under Review',   color: '#f39c12' },
  VERIFIED: { cls: 'cert-verified', label: '✓ Verified',        color: '#27ae60' },
  REJECTED: { cls: 'cert-rejected', label: '✗ Rejected',        color: '#e74c3c' },
  EXPIRED:  { cls: 'cert-expired',  label: '⊘ Expired',         color: '#95a5a6' },
};

export default function CertificationCard({ cert, onDelete }) {
  const status = STATUS_STYLES[cert.status] ?? STATUS_STYLES.PENDING;

  return (
    <div className={`cert-card ${status.cls}`}>
      <div className="cert-card-top">
        <div className="cert-card-name">{cert.certName}</div>
        <span className="cert-badge" style={{ background: status.color }}>
          {status.label}
        </span>
      </div>

      <div className="cert-card-meta">
        {cert.issuedBy && <span>Issued by: {cert.issuedBy}</span>}
        {cert.certNumber && <span>No: {cert.certNumber}</span>}
        {cert.expiresAt && (
          <span>Expires: {new Date(cert.expiresAt).toLocaleDateString('en-IN')}</span>
        )}
      </div>

      <div className="cert-card-actions">
        <a
          href={cert.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-view-link"
        >
          📄 View Document
        </a>
        {onDelete && (
          <button
            className="cert-delete-btn"
            onClick={() => onDelete(cert.id)}
          >
            🗑️ Remove
          </button>
        )}
      </div>
    </div>
  );
}
