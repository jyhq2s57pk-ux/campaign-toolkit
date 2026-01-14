import React, { useState } from 'react';
import './Carousel.css';
import joyImage from '../assets/joy-unlimited.png';

const CAROUSEL_ITEMS = [
    {
        id: 1,
        title: "The Magic of Joy Holiday Season",
        scope: "Global",
        activationDates: "October-December 2025",
        channels: ["Reserve & Collect", "(Web /APP) Emporium"],
        color: "purple", // css class mod
        badges: [
            { type: "Premium", label: "Full visibility" },
            { type: "Executive", label: "Medium visibility" },
            { type: "Standard", label: "Regular visibility" }
        ]
    },
    {
        id: 2,
        title: "Summer Vibes Campaign",
        scope: "Global",
        activationDates: "June-August 2026",
        channels: ["Reserve & Collect", "Emporium"],
        color: "orange",
        badges: [
            { type: "Premium", label: "Full visibility" },
            { type: "Executive", label: "Medium visibility" },
            { type: "Standard", label: "Regular visibility" }
        ]
    },
    {
        id: 3,
        title: "Spring Refresh",
        scope: "Global",
        activationDates: "March-May 2026",
        channels: ["All Channels"],
        color: "teal",
        badges: [
            { type: "Premium", label: "Full visibility" },
            { type: "Standard", label: "Regular visibility" }
        ]
    }
];

export default function Carousel() {
    const trackRef = React.useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse Drag Handlers
    const onMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - trackRef.current.offsetLeft);
        setScrollLeft(trackRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - trackRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        trackRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="carousel-container">
            {/* Scrollable Track */}
            <div
                className="carousel-track"
                ref={trackRef}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                {CAROUSEL_ITEMS.map((currentItem) => (
                    <div className={`carousel-card card--${currentItem.color}`} key={currentItem.id}>
                        {/* Left Section: Details */}
                        <div className="carousel-details">
                            <div className="carousel-campaign-label">Campaign</div>
                            <h2 className="carousel-title">{currentItem.title}</h2>

                            <div className="carousel-meta-grid">
                                {/* Column 1: Core Details */}
                                <div className="meta-column">
                                    {/* Scope */}
                                    <div className="meta-block">
                                        <div className="meta-label">Scope</div>
                                        <div className="meta-value">{currentItem.scope}</div>
                                    </div>

                                    {/* Activation Dates */}
                                    <div className="meta-block">
                                        <div className="meta-label">Activation dates</div>
                                        <div className="meta-value">{currentItem.activationDates}</div>
                                    </div>

                                    {/* Channels */}
                                    <div className="meta-block">
                                        <div className="meta-label">Channels</div>
                                        <div className="meta-value">
                                            {currentItem.channels.map((ch, i) => <div key={i}>{ch}</div>)}
                                        </div>
                                    </div>
                                </div>

                                {/* Column 2: Scope/Badges */}
                                <div className="meta-column">
                                    <div className="meta-block">
                                        <div className="meta-label">Scope</div>
                                        <div className="badge-list">
                                            {currentItem.badges.map((badge, idx) => (
                                                <div key={idx} className="badge-row">
                                                    <span className={`badge badge--${badge.type.toLowerCase()} badge--sm`}>{badge.type}</span>
                                                    <span className="badge-desc">{badge.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Section: Visual */}
                        <div className="carousel-visual">
                            <div className="visual-card">
                                <img src={joyImage} alt="Joy Unlimited" className="visual-logo" />

                                <div className="audio-control">
                                    <div className="audio-info">
                                        <span className="audio-label">Audio<br />overview</span>
                                    </div>
                                    <button className="btn-listen">
                                        <span className="icon-headphones">
                                            <svg width="16" height="16" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.1953 6.37109C11.9539 6.37109 13.3816 7.79815 13.3818 9.55664V11.2559C13.3818 12.7936 12.2857 14.0851 10.833 14.374V16.0908L12.3447 17.6025C12.5231 17.781 12.5834 18.0619 12.4814 18.2998C12.3879 18.5376 12.1493 18.6904 11.8945 18.6904H8.49609C8.3705 18.6898 8.24785 18.652 8.14355 18.582C8.03913 18.5119 7.95729 18.4121 7.90918 18.2959C7.86122 18.1798 7.84877 18.0519 7.87305 17.9287C7.89736 17.8054 7.95737 17.6918 8.0459 17.6025L9.55859 16.0908V14.374C8.10578 14.0852 7.00977 12.7936 7.00977 11.2559V9.55664C7.00997 7.79828 8.43695 6.3713 10.1953 6.37109ZM10.1953 2.12305C14.766 2.12305 18.4793 5.83559 18.4795 10.4062C18.4834 12.0456 17.9981 13.6495 17.0859 15.0117C16.8905 15.3004 16.491 15.377 16.2021 15.1816C15.9048 14.9862 15.829 14.5952 16.0244 14.2979C16.772 13.1849 17.2051 11.8505 17.2051 10.4062C17.2049 6.53226 14.0694 3.39746 10.1953 3.39746C6.32144 3.39766 3.18673 6.53238 3.18652 10.4062C3.18289 11.7921 3.59395 13.1478 4.36719 14.2979C4.46176 14.4386 4.49642 14.6109 4.46387 14.7773C4.43121 14.9438 4.33414 15.0909 4.19336 15.1855C4.05253 15.2802 3.87939 15.3149 3.71289 15.2822C3.54668 15.2495 3.40023 15.1523 3.30566 15.0117C2.43058 13.6948 1.91211 12.1054 1.91211 10.4062C1.91231 5.83571 5.62477 2.12325 10.1953 2.12305ZM10.1953 7.64551C9.14211 7.64571 8.28439 8.50344 8.28418 9.55664V11.2559C8.28418 12.3092 9.14198 13.1678 10.1953 13.168C11.2488 13.168 12.1074 12.3094 12.1074 11.2559V9.55664C12.1072 8.50332 11.2487 7.64551 10.1953 7.64551Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                        Listen now
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {/* Dots (Optional: Can remain as indicators, logically updating based on scroll pos requires more logic, 
                for now removing explicit dot control binding or implementing simple scrollIntoView logic is complex without requested. 
                Leaving basic static dots or removing if scroll is primary. 
                User asked for "scrollable", often dots disappear or become just indicators. 
                I will remove the clickable dots for now to rely on the requested scroll/swipe interaction, or keep simplified.) 
                
                Actually, let's keep it clean as per screenshot which shows dots. 
                I will leave them out for this iteration unless requested to sync them, as 'scrollable' is the priority.
            */}
            <div className="carousel-dots">
                {CAROUSEL_ITEMS.map((_, idx) => (
                    <span
                        key={idx}
                        className={`dot ${/* efficient way to track active index on scroll is needed, simplifying for now */ 'dot-indicator'}`}
                    /* active class requires scroll listener */
                    />
                ))}
            </div>
        </div>
    );
}
