/**
 * src/components/common/SectionHeader.jsx
 *
 * Reusable section eyebrow + title block.
 * `titleHtml` supports an <em> segment via dangerouslySetInnerHTML
 * for the italic accent style — only use with static strings.
 */

/**
 * @param {{ tag: string, titleHtml: string }} props
 */
export default function SectionHeader({ tag, titleHtml }) {
  return (
    <div className="section-header">
      <p className="section-tag">{tag}</p>
      {/* Static content only — safe to use dangerouslySetInnerHTML here */}
      <h2
        className="section-title"
        dangerouslySetInnerHTML={{ __html: titleHtml }}
      />
    </div>
  );
}
