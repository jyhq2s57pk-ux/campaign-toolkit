import Badge from './Badge';
import './ContentCard.css';

function PlusCircleIcon({ size = 42 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M21 2.625C16.1449 2.68374 11.5052 4.63853 8.07186 8.07186C4.63853 11.5052 2.68374 16.1449 2.625 21C2.68374 25.8551 4.63853 30.4948 8.07186 33.9281C11.5052 37.3615 16.1449 39.3163 21 39.375C25.8551 39.3163 30.4948 37.3615 33.9281 33.9281C37.3615 30.4948 39.3163 25.8551 39.375 21C39.3163 16.1449 37.3615 11.5052 33.9281 8.07186C30.4948 4.63853 25.8551 2.68374 21 2.625ZM31.5 22.3125H22.3125V31.5H19.6875V22.3125H10.5V19.6875H19.6875V10.5H22.3125V19.6875H31.5V22.3125Z" fill="currentColor" />
    </svg>
  );
}

export default function ContentCard({
  title,
  imageUrl,
  channels = [],
  onClick,
  description,
  className = '',
  action,
  aspectRatio,
  imageRatio,
  actionLabel = 'View details',
}) {
  const cardStyle = {};
  if (aspectRatio) cardStyle['--cc-aspect-ratio'] = aspectRatio;
  if (imageRatio) cardStyle['--cc-image-height'] = imageRatio;

  return (
    <div
      className={`content-card ${className}`.trim()}
      style={Object.keys(cardStyle).length ? cardStyle : undefined}
      onClick={onClick}
    >
      <div className="content-card__image-wrapper">
        {imageUrl ? (
          <img className="content-card__image" src={imageUrl} alt={title} />
        ) : (
          <div className="content-card__image-placeholder" />
        )}
      </div>

      <div className="content-card__body">
        {channels.length > 0 && (
          <div className="content-card__badges">
            {channels.map((channel) => (
              <Badge key={channel} variant="channel">{channel}</Badge>
            ))}
          </div>
        )}
        <div className="content-card__title">{title}</div>
        {description && (
          <div className="content-card__description">{description}</div>
        )}
      </div>

      <button
        className="content-card__action"
        aria-label={actionLabel}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      >
        {action || <PlusCircleIcon />}
      </button>
    </div>
  );
}
