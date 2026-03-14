import './FilterTabs.css';

export default function FilterTabs({ tabs = [], activeTab = 'All', onTabChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter by section">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          id={`tab-${index}`}
          className={`filter-tabs__tab ${activeTab === tab ? 'filter-tabs__tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab}
          tabIndex={activeTab === tab ? 0 : -1}
          onClick={() => onTabChange(tab)}
          onKeyDown={(e) => {
            let newIndex;
            if (e.key === 'ArrowRight') {
              newIndex = (index + 1) % tabs.length;
            } else if (e.key === 'ArrowLeft') {
              newIndex = (index - 1 + tabs.length) % tabs.length;
            } else {
              return;
            }
            e.preventDefault();
            const el = document.getElementById(`tab-${newIndex}`);
            if (el) { el.focus(); onTabChange(tabs[newIndex]); }
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
