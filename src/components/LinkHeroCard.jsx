import React from 'react';
import './LinkHeroCard.css';

const LinkHeroCard = ({ title, description, link }) => {
  return (
    <div className="card">
      <div className="noise-overlay"></div>
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-desc">{description}</p>
      </div>

      <div className="card-footer">
        {/* Figma Logo SVG */}
        <svg className="figma-logo" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.5 57C14.7467 57 19 52.7467 19 47.5V38H9.5C4.25329 38 0 42.2533 0 47.5C0 52.7467 4.25329 57 9.5 57Z" fill="#0ACF83" />
          <path d="M0 28.5C0 23.2533 4.25329 19 9.5 19H19V38H9.5C4.25329 38 0 33.7467 0 28.5Z" fill="#A259FF" />
          <path d="M0 9.5C0 4.25329 4.25329 0 9.5 0H19V19H9.5C4.25329 19 0 14.7467 0 9.5Z" fill="#F24E1E" />
          <path d="M19 0H28.5C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z" fill="#FF7262" />
          <path d="M38 28.5C38 33.7467 33.7467 38 28.5 38H19V19H28.5C33.7467 19 38 23.2533 38 28.5Z" fill="#1ABCFE" />
        </svg>

        {/* Launch Icon SVG */}
        <a href={link} target="_blank" rel="noopener noreferrer" className="launch-icon-link">
          <svg className="launch-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default LinkHeroCard;
