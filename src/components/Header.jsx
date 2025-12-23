import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="bracket">((( )))</span>
        <span className="brand">Trading Toolkit</span>
      </div>

      <nav className="header-nav">
        <button className="nav-btn nav-btn-active">Customer touch points</button>
        <button className="nav-btn">Section</button>
        <button className="nav-btn">Section</button>
        <button className="nav-btn">Resources</button>
      </nav>
    </header>
  );
}
