import './FilterTabs.css';

export default function FilterTabs({ tabs = [], activeTab = 'All', onTabChange }) {
  return (
    <div className="filter-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`filter-tabs__tab ${activeTab === tab ? 'filter-tabs__tab--active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
