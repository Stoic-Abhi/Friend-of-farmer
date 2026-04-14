export default function TrackStep({ label, done, active }) {
  return (
    <div className="track-step">
      <div
        className={`track-dot ${
          done ? "done" : active ? "active" : ""
        }`}
      >
        {done ? "✓" : ""}
      </div>

      <div className="track-lbl">{label}</div>
    </div>
  );
}