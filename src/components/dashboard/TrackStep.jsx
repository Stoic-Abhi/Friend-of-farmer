/**
 * src/components/dashboard/TrackStep.jsx
 *
 * Single step in an order's progress tracker.
 * Used inside ConsumerDashboardPage's order cards.
 *
 * @param {{
 *   label:  string,
 *   state:  'done' | 'active' | 'pending',
 *   icon?:  string,   // override emoji (e.g. '🚚' for in-transit)
 * }} props
 */
export default function TrackStep({ label, state, icon }) {
  const dotContent =
    state === 'done'   ? '✓'  :
    state === 'active' ? (icon ?? '●') :
                         '';

  return (
    <div className="track-step">
      <div className={`track-dot${state !== 'pending' ? ` ${state}` : ''}`}>
        {dotContent}
      </div>
      <div className={`track-lbl${state === 'done' ? ' done' : ''}`}>
        {label}
      </div>
    </div>
  );
}
