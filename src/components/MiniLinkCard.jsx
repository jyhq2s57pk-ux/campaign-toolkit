import React from 'react';
import { Link } from 'react-router-dom';
import './MiniLinkCard.css';

const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MiniLinkCard = ({ title, description, link = "#", onClick }) => {
    // Determine if we use a React Router Link or a regular div/a
    const isInternal = link && link.startsWith('/');
    const content = (
        <>
            <div className="mini-card-content">
                <h3 className="mini-card-title">{title}</h3>
                {description && <p className="mini-card-description">{description}</p>}
            </div>
            <div className="mini-card-chevron">
                <ChevronRight />
            </div>
        </>
    );

    if (onClick) {
        return (
            <div className="mini-link-card" onClick={onClick}>
                {content}
            </div>
        );
    }

    if (isInternal) {
        return (
            <Link to={link} className="mini-link-card">
                {content}
            </Link>
        );
    }

    return (
        <a href={link} className="mini-link-card" target="_blank" rel="noopener noreferrer">
            {content}
        </a>
    );
};

export default MiniLinkCard;
