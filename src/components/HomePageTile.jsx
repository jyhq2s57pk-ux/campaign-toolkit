import React, { useEffect, useState } from 'react';
import './HomePageTile.css';
import joyImage from '../assets/joy-unlimited.png';
import { api } from '../lib/api';

export default function HomePageTile() {
    const [campaign, setCampaign] = useState(null);

    useEffect(() => {
        api.getCampaign().then(setCampaign);
    }, []);

    const title = campaign ? campaign.name : "Joy unlimited";
    const subtitle = campaign ? campaign.subtitle : "Summer campaign";
    const scope = campaign ? campaign.scope : "Global";
    const dates = campaign ? (campaign.activation_dates || campaign.activationDates) : "October-December 2025"; // handle snake_case from DB

    return (
        <div className="hero-wrapper">


            <div className="homepage-hero-card">
                {/* Left Visual Section */}
                {/* Left Visual Section */}
                <div className="hero-visual">
                    <div className="visual-gradient-card">
                        <img src={joyImage} alt={title} className="joy-logo-img" />
                    </div>

                    <div className="audio-row">
                        <div className="joy-text">{title}<br />Audio overview</div>
                        <div className="btn-listen listen-btn">
                            <div className="listen-icon">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.1953 6.37109C11.9539 6.37109 13.3816 7.79815 13.3818 9.55664V11.2559C13.3818 12.7936 12.2857 14.0851 10.833 14.374V16.0908L12.3447 17.6025C12.5231 17.781 12.5834 18.0619 12.4814 18.2998C12.3879 18.5376 12.1493 18.6904 11.8945 18.6904H8.49609C8.3705 18.6898 8.24785 18.652 8.14355 18.582C8.03913 18.5119 7.95729 18.4121 7.90918 18.2959C7.86122 18.1798 7.84877 18.0519 7.87305 17.9287C7.89736 17.8054 7.95737 17.6918 8.0459 17.6025L9.55859 16.0908V14.374C8.10578 14.0852 7.00977 12.7936 7.00977 11.2559V9.55664C7.00997 7.79828 8.43695 6.3713 10.1953 6.37109ZM10.1953 2.12305C14.766 2.12305 18.4793 5.83559 18.4795 10.4062C18.4834 12.0456 17.9981 13.6495 17.0859 15.0117C16.8905 15.3004 16.491 15.377 16.2021 15.1816C15.9048 14.9862 15.829 14.5952 16.0244 14.2979C16.772 13.1849 17.2051 11.8505 17.2051 10.4062C17.2049 6.53226 14.0694 3.39746 10.1953 3.39746C6.32144 3.39766 3.18673 6.53238 3.18652 10.4062C3.18289 11.7921 3.59395 13.1478 4.36719 14.2979C4.46176 14.4386 4.49642 14.6109 4.46387 14.7773C4.43121 14.9438 4.33414 15.0909 4.19336 15.1855C4.05253 15.2802 3.87939 15.3149 3.71289 15.2822C3.54668 15.2495 3.40023 15.1523 3.30566 15.0117C2.43058 13.6948 1.91211 12.1054 1.91211 10.4062C1.91231 5.83571 5.62477 2.12325 10.1953 2.12305ZM10.1953 7.64551C9.14211 7.64571 8.28439 8.50344 8.28418 9.55664V11.2559C8.28418 12.3092 9.14198 13.1678 10.1953 13.168C11.2488 13.168 12.1074 12.3094 12.1074 11.2559V9.55664C12.1072 8.50332 11.2487 7.64551 10.1953 7.64551Z" fill="#333" />
                                </svg>
                            </div>
                            <div className="listen-label">Listen now</div>
                        </div>
                    </div>
                </div>

                {/* Right Details Section */}
                <div className="hero-details">
                    <div className="hero-scope-section">
                        <div className="hero-title-group">
                            <div className="link-wrapper">
                                <div className="campaign-label">Campaign</div>
                            </div>
                            <div className="campaign-title-large">{title}<br />{subtitle}</div>
                        </div>

                        <div className="hero-info-group">
                            <div className="info-block">
                                <div className="link-wrapper">
                                    <div className="info-label">Scope</div>
                                </div>
                                <div className="info-value">{scope}</div>
                            </div>
                            <div className="info-block">
                                <div className="link-wrapper">
                                    <div className="info-label">Activation dates</div>
                                </div>
                                <div className="info-value">{dates}</div>
                            </div>
                            <div className="info-block">
                                <div className="link-wrapper">
                                    <div className="info-label">Channels</div>
                                </div>
                                <div className="info-value">Reserve & Collect (Web /APP) Emporium</div>
                            </div>
                        </div>
                    </div>

                    <div className="activation-section">
                        <div className="link-wrapper">
                            <div className="info-label">Multi level activation</div>
                        </div>
                        <div className="badge-legend">
                            <div className="badge-legend-item">
                                <span className="badge badge--premium badge--md">Premium</span>
                                <span className="badge-desc">Full visibility</span>
                            </div>
                            <div className="badge-legend-item">
                                <span className="badge badge--executive badge--md">Executive</span>
                                <span className="badge-desc">Medium visibility</span>
                            </div>
                            <div className="badge-legend-item">
                                <span className="badge badge--standard badge--md">Standard</span>
                                <span className="badge-desc">Regular visibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
