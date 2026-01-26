import React, { useRef, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './OmnichannelPage.css';
import { api } from '../lib/api';

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
                                <div key={idea.id} className="idea-card glass">
                                    <div className="idea-image-container">
                                        <img src={idea.image} alt={idea.title} />
                                        {idea.tag && (
                                            <div className="idea-tag-badge">
                                                {idea.tag}
                                            </div>
                                        )}
                                    </div>
                                    <div className="idea-content">
                                        <h3 className="idea-title">{idea.title}</h3>
                                        <p className="idea-desc">{idea.desc}</p>
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
