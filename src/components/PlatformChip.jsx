import './PlatformChip.css';

export default function PlatformChip({ name, isNew, isActive, onClick, type }) {
  return (
    <button
      className={`platform-chip ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="chip-header">
        {isNew && (
          <div className="chip-badge">New</div>
        )}
      </div>
      <div className="chip-name">{name}</div>
    </button>
  );
}
