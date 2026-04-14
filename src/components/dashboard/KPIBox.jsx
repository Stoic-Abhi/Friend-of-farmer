export default function KPIBox({ title, value }) {
  return (
    <div className="kpi-card">
      <div className="kpi-val">{value}</div>
      <div className="kpi-label">{title}</div>
    </div>
  );
}