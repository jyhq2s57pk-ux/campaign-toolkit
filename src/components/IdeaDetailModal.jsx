import { useEffect } from 'react';
import Badge from './Badge';
import './IdeaDetailModal.css';

export default function IdeaDetailModal({ idea, onClose, imageMap = {} }) {
  useEffect(() => {
    if (!idea) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [idea, onClose]);

  if (!idea) return null;

  const resolveImage = (url) => {
    if (!url) return null;
    return imageMap[url] || url;
  };

  // Build image list: prefer modal_images, fallback to single image_url
  const images = idea.modal_images?.length > 0
    ? idea.modal_images.map(resolveImage).filter(Boolean)
    : idea.image_url
      ? [resolveImage(idea.image_url)]
      : [];

  const channels = idea.channels || [];
  const headline = idea.headline;
  const subHeadline = idea.sub_headline;
  const howItWorksTitle = idea.how_it_works_title || 'How it works';
  const howItWorksSteps = idea.how_it_works_steps || [];

  return (
    <div className="idea-modal-overlay" onClick={onClose}>
      <div className="idea-modal" onClick={(e) => e.stopPropagation()}>
        {/* Left column: images */}
        <div className="idea-modal__images">
          {images.map((img, i) => (
            <div key={i} className="idea-modal__image-frame">
              <img src={img} alt={`${idea.title} ${i + 1}`} className="idea-modal__image" />
            </div>
          ))}
        </div>

        {/* Right column: content */}
        <div className="idea-modal__content">
          <div className="idea-modal__content-inner">
            <div className="idea-modal__sections">
              {/* Badges */}
              {channels.length > 0 && (
                <div className="idea-modal__badges">
                  {channels.map((channel) => (
                    <Badge key={channel} variant="channel-modal">{channel}</Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <div className="idea-modal__title-section">
                {headline ? (
                  <div className="idea-modal__title">
                    <span className="idea-modal__headline">{headline}</span>
                    {subHeadline && (
                      <>
                        <br />
                        <span className="idea-modal__subtitle">{subHeadline}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="idea-modal__title">
                    <span className="idea-modal__subtitle">{idea.title}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {idea.description && (
                <div className="idea-modal__description-section">
                  {idea.description_title && (
                    <div className="idea-modal__description-heading">{idea.description_title}</div>
                  )}
                  <div className="idea-modal__description">{idea.description}</div>
                </div>
              )}

              {/* Secondary description */}
              {idea.description_secondary && (
                <div className="idea-modal__description-section">
                  <div className="idea-modal__description">{idea.description_secondary}</div>
                </div>
              )}

              {/* How it works */}
              {howItWorksSteps.length > 0 && (
                <div className="idea-modal__how-it-works">
                  <div className="idea-modal__how-title">{howItWorksTitle}</div>
                  <div className="idea-modal__steps">
                    {howItWorksSteps.map((step, i) => (
                      <div key={i} className="idea-modal__step">{step}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close button */}
        <button className="idea-modal__close" onClick={onClose} aria-label="Close modal">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 14.586L11.05 9.636L9.636 11.05L14.586 16L9.636 20.95L11.05 22.364L16 17.414L20.95 22.364L22.364 20.95L17.414 16L22.364 11.05L20.95 9.636L16 14.586Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
