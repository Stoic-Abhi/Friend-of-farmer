export default function SectionHeader({ tag, title }) {
  return (
    <>
      <div className="section-tag">{tag}</div>
      <h2 className="section-title">{title}</h2>
    </>
  );
}