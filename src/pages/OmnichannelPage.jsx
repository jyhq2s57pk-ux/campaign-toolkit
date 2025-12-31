import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './OmnichannelPage.css';

// Imported Images
import treasureImg from '../assets/omni/treasure-quest.png';
// import activationImg from '../assets/omni/360-activation.png'; // Not used in new grid layout

// Generated Images for Carousel
import imgBalloon from '../assets/omni/gen/balloon.png';
import imgMagic from '../assets/omni/gen/magic.png';
import imgTasting from '../assets/omni/gen/tasting.png';
import imgOrigami from '../assets/omni/gen/origami.png';
import imgFace from '../assets/omni/gen/face.png';
import imgPostcard from '../assets/omni/gen/postcard.png';
import imgBuzz from '../assets/omni/gen/buzz.png';
import imgBalance from '../assets/omni/gen/balance.png';

export default function OmnichannelPage() {
    const carouselRef = useRef(null);

    // Data for Harmony Channels (360 Activation)
    const harmonySteps = [
        { id: '01', title: 'Web', desc: 'Enhancing campaign visibility on Reserve & Collect to captivate passengers early on.', color: 'blue' },
        { id: '02', title: 'App', desc: 'Celebrating the joy of summer with our members before, during and after their trips.', color: 'green' },
        { id: '03', title: 'Email', desc: 'Crafting personalized communications to strengthen engagement.', color: 'purple' },
        { id: '04', title: 'Social', desc: 'Amplifying the activation\'s reach and resonance on our social channels.', color: 'orange' },
        { id: '05', title: 'Paid Social', desc: 'Elevating the activation\'s influence through our paid social channels.', color: 'red' },
        { id: '06', title: 'Loyalty', desc: 'Offering exclusive benefits & events crafted for our members.', color: 'indigo' },
        { id: '07', title: 'In-store', desc: 'Featuring masterclasses, event branding, and memorable interactive experiences.', color: 'pink' },
    ];

    // Data for Summer Joy Carousel
    const ideas = [
        { id: 1, title: 'Balloon Modelling + Loyalty Boost', desc: 'Delight customers with custom balloon shapes - each tagged with a scannable loyalty QR code to drive sign-ups.', image: imgBalloon, tag: 'Loyalty' },
        { id: 2, title: 'Barcode Magic Reveal', desc: 'Surprise guests with a mind-blowing magic trick - watch their chosen number appear from a product barcode.', image: imgMagic, tag: 'Wow Factor' },
        { id: 3, title: 'Tasting Bar Illusion', desc: 'Engage curious minds with the “Impossible Cups” puzzle - a magic moment at any tasting station.', image: imgTasting, tag: 'Engagement' },
        { id: 4, title: 'Origami Perfume Art', desc: 'Elevate fragrance demos by spraying onto beautiful folded origami artwork—memorable, elegant, and take-home ready.', image: imgOrigami, tag: 'Elegant' },
        { id: 5, title: 'Face Painting Perks', desc: 'Offer artistic face painting linked to a product purchase or photo print-outs of their designs creating smiles and sales.', image: imgFace, tag: 'Sales' },
        { id: 6, title: 'The Great Postcard Adventure', desc: 'Pick a postcard, reveal your prize, and send a little sunshine to someone you love!', image: imgPostcard, tag: 'Summer' },
        { id: 7, title: 'Surfside Buzz Wire Challenge', desc: 'Steady hands win big! Navigate the Surfside Buzz Wire, reach the finish line, and win cool prizes.', image: imgBuzz, tag: 'Fun' },
        { id: 8, title: 'Sunset Surf Balance Challenge', desc: 'Balance the umbrella on the surfboard, win prizes, and share your fun summer moments with friends.', image: imgBalance, tag: 'Active' },
    ];

    return (
        <div className="omnichannel-page">
            <Header />
            <main className="omnichannel-main">

                {/* Hero Section */}
                <section className="omni-hero">
                    <div className="hero-content fade-in-up">
                        <div className="hero-symbol-left">((</div>
                        <div className="hero-text-block">
                            <h1 className="hero-title">Omnichannel Harmony</h1>
                            <h2 className="hero-subtitle">with Entertainment included!</h2>
                        </div>
                        <div className="hero-symbol-right">))</div>
                    </div>
                </section>

                {/* 360 Activation Strategy Grid */}
                <section className="strategy-section">
                    <div className="inner-content-wrapper">
                        <div className="strategy-grid">
                            <div className="strategy-info-card glass">
                                <h2>A <span className="highlight-purple">360° activation strategy</span> designed to engage, captivate, and inspire passengers around the world.</h2>
                            </div>
                            {harmonySteps.map((step) => (
                                <div key={step.id} className={`strategy-card glass card-${step.color}`}>
                                    <div className="card-number">{step.id}</div>
                                    <h3 className="card-title">{step.title}</h3>
                                    <p className="card-desc">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Treasure Quest Spotlight */}
                <section className="treasure-section">
                    <div className="inner-content-wrapper">
                        <div className="treasure-container glass">
                            <div className="treasure-image-col">
                                <img src={treasureImg} alt="Treasure Quest" className="treasure-img" />
                            </div>
                            <div className="treasure-content-col">
                                <h2 className="section-label text-orange">Treasure Quest:</h2>
                                <h1 className="treasure-title">Turn Every Store Visit into a Brand-led AR Adventure</h1>
                                <p className="treasure-desc">Coordinate with your Commercial and Entertainment teams to activate this in your stores!</p>

                                <div className="how-it-works-list">
                                    <h3><span className="icon-arrow">→</span> How it works</h3>
                                    <ul>
                                        <li>Customers grab a clue card and start their hunt</li>
                                        <li>Scan hidden posters using the Club Avolta app</li>
                                        <li>Watch them come to life with stunning AR animations</li>
                                        <li>Find number clues and unlock hidden treasures</li>
                                        <li>Engaging AR gamification increases dwell time</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* Apple-style Carousel: Summer Joy Ideas */}
                <section className="ideas-carousel-section">
                    <div className="section-header centered">
                        <div className="logo-small">((I))</div>
                        <h2 className="section-title">Summer Joy Ideas</h2>
                        <p className="section-subtitle">To be considered and delivered if desired by regions</p>
                    </div>

                    <div className="carousel-wrapper" ref={carouselRef}>
                        <div className="carousel-track">
                            {ideas.map((idea) => (
                                <div key={idea.id} className="carousel-item">
                                    <div className="carousel-image-container">
                                        <img src={idea.image} alt={idea.title} />
                                        <div className="carousel-overlay">
                                        </div>
                                        <div className="carousel-badges">
                                            <span className="carousel-tag">{idea.tag}</span>
                                        </div>
                                    </div>
                                    <div className="carousel-text">
                                        <h3>{idea.title}</h3>
                                        <p>{idea.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
