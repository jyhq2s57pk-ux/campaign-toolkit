import React from 'react';
import './ResourceCard.css';

const ExternalLinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ResourceCard({
  title,
  image,
  imageFit = 'contain',
  href,
  onClick,
  action,
}) {
  const content = (
    <>
      <div className={`resource-card__image ${imageFit === 'cover' ? 'resource-card__image--cover' : ''}`}>
        {image && <img src={image} alt={title} />}
      </div>
      <div className="resource-card__footer">
        <h3 className="resource-card__title">{title}</h3>
        <div className="resource-card__action">
          {action || <ExternalLinkIcon />}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className="resource-card" onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <a href={href} className="resource-card" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="resource-card">{content}</div>;
}
