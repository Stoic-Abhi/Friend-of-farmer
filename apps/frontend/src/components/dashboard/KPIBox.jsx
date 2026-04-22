/**
 * src/components/dashboard/KPIBox.jsx
 *
 * Single KPI metric card used in the Farmer Dashboard.
 *
 * @param {{
 *   icon:    string,
 *   value:   string,
 *   label:   string,
 *   trend?:  string,
 *   trendUp?: boolean,
 *   accent?: 'default' | 'green' | 'clay' | 'blue',
 * }} props
 */
export default function KPIBox({ icon, value, label, trend, trendUp, accent = 'default' }) {
  return (
    <div className={`kpi-card${accent !== 'default' ? ` ${accent}` : ''}`}>
      <span className="kpi-icon">{icon}</span>
      <div className="kpi-val">{value}</div>
      <div className="kpi-label">{label}</div>
      {trend && (
        <div className={`kpi-trend${trendUp ? ' up' : ''}`}>{trend}</div>
      )}
    </div>
  );
}
