import React from 'react';
import { Link } from 'react-router-dom';
import './LinkCard.css';

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M6.665 3.335L13.335 10L6.665 16.665"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LinkCard({ title, description, image, to, href, onClick }) {
  const content = (
    <>
      <div className="link-card__body">
        {image && (
          <div className="link-card__thumbnail">
            <img src={image} alt={title} />
          </div>
        )}
        <div className="link-card__text">
          <h3 className="link-card__title">{title}</h3>
          {description && (
            <p className="link-card__description">{description}</p>
          )}
        </div>
      </div>
      <div className="link-card__arrow">
        <ChevronRightIcon />
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className="link-card" onClick={onClick} type="button">
        {content}
      </button>
    );
  }

  if (to) {
    return (
      <Link to={to} className="link-card">
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className="link-card" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="link-card">{content}</div>;
}
