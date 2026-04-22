/**
 * src/components/layout/RoleTabs.jsx
 *
 * Horizontal role-selector tab bar below the Navbar.
 * Driven by a config array so adding a new tab is a one-liner.
 */

const TABS = [
  { id: 'browse',        label: '🌿 Browse Produce' },
  { id: 'farmer-dash',   label: '🚜 Farmer Dashboard' },
  { id: 'list-product',  label: '📋 List My Produce' },
  { id: 'consumer-dash', label: '📦 My Orders' },
];

/**
 * @param {{ activeView: string, onNavigate: (id: string) => void }} props
 */
export default function RoleTabs({ activeView, onNavigate }) {
  return (
    <div className="role-bar">
      {TABS.map(tab => (
        <button
          key={tab.id}
          className={`role-tab${activeView === tab.id ? ' active' : ''}`}
          onClick={() => onNavigate(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
