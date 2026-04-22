/**
 * src/components/dashboard/OrderCard.jsx
 *
 * A single order row in the Farmer Dashboard order list.
 *
 * @param {{
 *   emoji:    string,
 *   name:     string,
 *   detail:   string,
 *   amount:   string,
 *   status:   'pending' | 'packed' | 'delivered',
 * }} props
 */

const STATUS_MAP = {
  pending:   { cls: 's-pending',   label: 'Pending' },
  packed:    { cls: 's-packed',    label: 'Packed' },
  delivered: { cls: 's-delivered', label: 'Delivered' },
};

export default function OrderCard({ emoji, name, detail, amount, status }) {
  const { cls, label } = STATUS_MAP[status] ?? STATUS_MAP.pending;

  return (
    <div className="order-row">
      <div className="order-emoji">{emoji}</div>
      <div className="order-info">
        <div className="order-name">{name}</div>
        <div className="order-detail">{detail}</div>
      </div>
      <span className={`status-badge ${cls}`}>{label}</span>
      <div className="order-amt">{amount}</div>
    </div>
  );
}
