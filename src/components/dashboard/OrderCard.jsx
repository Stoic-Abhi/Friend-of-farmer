export default function OrderCard({
  id,
  status,
  items,
  farmer,
  total,
}) {
  return (
    <div className="history-card">
      <div className="history-card-top">
        <span>Order #{id}</span>
        <span>{status}</span>
      </div>

      <div className="history-body">
        <div className="history-items">{items}</div>

        <div>
          From <strong>{farmer}</strong>
        </div>

        <div className="history-total">{total}</div>
      </div>

      {/* Tracking */}
      <div className="tracking-bar">
        <div className="track-steps">
          <TrackStep label="Ordered" done />
          <TrackStep label="Packed" done />
          <TrackStep label="Dispatched" active />
          <TrackStep label="Delivered" />
        </div>
      </div>
    </div>
  );
}