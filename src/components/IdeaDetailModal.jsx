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
                  <div className="idea-modal__description">{idea.description}</div>
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
          <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.6272 21.2132L17.6774 16.2635L16.2632 17.6777L21.213 22.6274L16.2632 27.5772L17.6774 28.9914L22.6272 24.0416L27.5769 28.9914L28.9911 27.5772L24.0414 22.6274L28.9911 17.6777L27.5769 16.2635L22.6272 21.2132Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
