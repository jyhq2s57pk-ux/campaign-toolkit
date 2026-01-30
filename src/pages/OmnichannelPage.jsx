import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './OmnichannelPage.css';
import { api } from '../lib/api';
import UniversalCard from '../components/UniversalCard';
import '../components/UniversalCard.css';

// Imported Images

// import activationImg from '../assets/omni/360-activation.png'; // Not used in new grid layout
import logomark from '../assets/logomark.svg';

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
    const gridRef = useRef(null);
    const [gridVisible, setGridVisible] = useState(false);
    const [harmonySteps, setHarmonySteps] = useState([]);
    const [ideas, setIdeas] = useState([]);

    const [selectedIdea, setSelectedIdea] = useState(null);

    // Map of default images for fallback
    const imageMap = {
        '/src/assets/omni/gen/balloon.png': imgBalloon,
        '/src/assets/omni/gen/magic.png': imgMagic,
        '/src/assets/omni/gen/tasting.png': imgTasting,
        '/src/assets/omni/gen/origami.png': imgOrigami,
        '/src/assets/omni/gen/face.png': imgFace,
        '/src/assets/omni/gen/postcard.png': imgPostcard,
        '/src/assets/omni/gen/buzz.png': imgBuzz,
        '/src/assets/omni/gen/balance.png': imgBalance
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setGridVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.2 });

        if (gridRef.current) {
            observer.observe(gridRef.current);
        }

        return () => {
            if (gridRef.current) observer.disconnect();
        };
    }, []);

    useEffect(() => {
        // Fetch omnichannel strategy grid data
        api.getOmnichannel().then(data => {
            if (data) {
                const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo', 'pink'];
                const steps = data.map((item, index) => ({
                    id: String(item.id).padStart(2, '0'),
                    title: item.channel,
                    desc: item.description,
                    color: colors[index % colors.length]
                }));
                setHarmonySteps(steps);
            }
        });

        // Fetch omnichannel ideas from database
        api.getOmnichannelIdeas().then(data => {
            if (data) {
                const ideasData = data.map(idea => ({
                    id: idea.id,
                    title: idea.title,
                    desc: idea.description,
                    image: imageMap[idea.image_url] || idea.image_url,
                    tag: idea.tag
                }));
                setIdeas(ideasData);
            }
        });
    }, []);

    const handleCardClick = (idea) => {
        setSelectedIdea(idea);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setSelectedIdea(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    return (
        <div className="omnichannel-page">
            <Header />
            <main className="omnichannel-main">

                {/* Hero Section */}
                {/* Header Section */}
                <div className="outer-container">
                    <section className="page-header">
                        <h1>Omnichannel Harmony</h1>
                        <p>A 360° activation strategy designed to engage, captivate, and include entertainment.</p>
                    </section>
                </div>

                {/* 360 Activation Strategy Grid */}
                <section className="strategy-section">
                    <div className="inner-content-wrapper">
                        <div className={`strategy-grid ${gridVisible ? 'animate-active' : ''}`} ref={gridRef}>
                            <div className="strategy-info-card glass">
                                <img src={logomark} alt="Logo" className="strategy-logo-center" />
                                <h2>A <span className="highlight-purple">360° activation strategy</span> designed to engage, captivate, and inspire passengers around the world.</h2>
                            </div>
                            {harmonySteps.map((step) => (
                                <div key={step.id} className={`strategy-card glass card-${step.color} pos-${step.id}`}>
                                    <div className="card-number">{step.id}</div>
                                    <h3 className="card-title">{step.title}</h3>
                                    <p className="card-desc">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>





                {/* Summer Joy Ideas Carousel */}
                <section className="ideas-grid-section">
                    <div className="inner-content-wrapper">
                        <div className="section-header centered">
                            <img src={logomark} alt="Logo" className="logo-small" />
                            <h2 className="h-xxxl section-title">Summer Joy Ideas</h2>
                            <p className="section-subtitle">To be considered and delivered if desired by regions</p>
                        </div>
                    </div>

                    <div className="ideas-carousel-wrapper">
                        <div className="ideas-grid">
                            {ideas.map((idea) => (
                                <UniversalCard
                                    key={idea.id}
                                    title={idea.title}
                                    description={idea.desc}
                                    image={idea.image}
                                    category={idea.tag}
                                    categoryStyle="badge"
                                    onClick={() => handleCardClick(idea)}
                                    // No button here, card itself is clickable
                                    className="clickable"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modal Overlay */}
                {selectedIdea && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>

                            <div className="modal-image-header">
                                <img src={selectedIdea.image} alt={selectedIdea.title} />
                            </div>

                            <div className="modal-content-body">
                                <h2 className="modal-title">{selectedIdea.title}</h2>

                                <div className="modal-highlight-block">
                                    <div className="highlight-bar"></div>
                                    <p className="highlight-text">
                                        {selectedIdea.desc}
                                    </p>
                                </div>

                                <div className="modal-long-desc">
                                    <p>
                                        Our Power for Impact initiative gives local communities and organizations access to cost-effective energy while supporting their economic growth and championing social impact. We support projects in countries around the world, including South Africa, the Philippines, and Colombia.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </main>
            <Footer />
        </div>
    );
}
