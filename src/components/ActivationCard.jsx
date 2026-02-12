import Badge from './Badge';
import './ActivationCard.css';

export default function ActivationCard({ title, imageUrl, channels = [], onClick }) {
  return (
    <div className="activation-card" onClick={onClick}>
      {/* Desktop layout */}
      <div className="activation-card__desktop">
        <div className="activation-card__image-wrapper">
          {imageUrl ? (
            <img className="activation-card__image" src={imageUrl} alt={title} />
          ) : (
            <div className="activation-card__image-placeholder" />
          )}
        </div>
        <div className="activation-card__body">
          {channels.length > 0 && (
            <div className="activation-card__badges">
              {channels.map((channel) => (
                <Badge key={channel} variant="channel">{channel}</Badge>
              ))}
            </div>
          )}
          <div className="activation-card__title">{title}</div>
        </div>
        <button className="activation-card__action" aria-label="View details" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 2.625C16.1449 2.68374 11.5052 4.63853 8.07186 8.07186C4.63853 11.5052 2.68374 16.1449 2.625 21C2.68374 25.8551 4.63853 30.4948 8.07186 33.9281C11.5052 37.3615 16.1449 39.3163 21 39.375C25.8551 39.3163 30.4948 37.3615 33.9281 33.9281C37.3615 30.4948 39.3163 25.8551 39.375 21C39.3163 16.1449 37.3615 11.5052 33.9281 8.07186C30.4948 4.63853 25.8551 2.68374 21 2.625ZM31.5 22.3125H22.3125V31.5H19.6875V22.3125H10.5V19.6875H19.6875V10.5H22.3125V19.6875H31.5V22.3125Z" fill="#000000" />
          </svg>
        </button>
      </div>

      {/* Mobile layout */}
      <div className="activation-card__mobile">
        <div className="activation-card__mobile-link">
          {imageUrl ? (
            <img className="activation-card__mobile-image" src={imageUrl} alt={title} />
          ) : (
            <div className="activation-card__mobile-image-placeholder" />
          )}
          <div className="activation-card__mobile-text">
            <div className="activation-card__mobile-title">{title}</div>
          </div>
        </div>
        <button className="activation-card__mobile-action" aria-label="View details" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C12.3009 2.04476 8.76586 3.53412 6.14999 6.14999C3.53412 8.76586 2.04476 12.3009 2 16C2.04476 19.6991 3.53412 23.2341 6.14999 25.85C8.76586 28.4659 12.3009 29.9552 16 30C19.6991 29.9552 23.2341 28.4659 25.85 25.85C28.4659 23.2341 29.9552 19.6991 30 16C29.9552 12.3009 28.4659 8.76586 25.85 6.14999C23.2341 3.53412 19.6991 2.04476 16 2ZM24 17H17V24H15V17H8V15H15V8H17V15H24V17Z" fill="#F5F3ED" />
          </svg>
        </button>
      </div>
    </div>
  );
}
