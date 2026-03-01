import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterTabs from '../components/FilterTabs';
import ActivationCard from '../components/ActivationCard';
import IdeaDetailModal from '../components/IdeaDetailModal';
import { api } from '../lib/api';
import './OmnichannelPage.css';

// Generated Images for fallback
import imgBalloon from '../assets/omni/gen/balloon.png';
import imgMagic from '../assets/omni/gen/magic.png';
import imgTasting from '../assets/omni/gen/tasting.png';
import imgOrigami from '../assets/omni/gen/origami.png';
import imgFace from '../assets/omni/gen/face.png';
import imgPostcard from '../assets/omni/gen/postcard.png';
import imgBuzz from '../assets/omni/gen/buzz.png';
import imgBalance from '../assets/omni/gen/balance.png';

export default function OmnichannelPage() {
    const [searchParams] = useSearchParams();
    const campaignId = searchParams.get('campaignId');
    const [ideas, setIdeas] = useState([]);
    const [channels, setChannels] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modules, setModules] = useState({});

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

    const resolveImage = (url) => {
        if (!url) return null;
        return imageMap[url] || url;
    };

    useEffect(() => {
        setLoading(true);
        const fetchAll = async () => {
            if (campaignId) {
                const campaign = await api.getCampaignById(campaignId);
                if (campaign?.modules) setModules(campaign.modules);
            }
            const [channelsData, ideasData] = await Promise.all([
                api.getOmnichannel(),
                api.getOmnichannelIdeas(campaignId)
            ]);
            if (channelsData) setChannels(channelsData);
            if (ideasData) setIdeas(ideasData);
            setLoading(false);
        };
        fetchAll();
    }, [campaignId]);

    const filterTabs = ['All', ...channels.map(c => c.channel)];

    const filteredIdeas = activeFilter === 'All'
        ? ideas
        : ideas.filter(idea => idea.channels?.includes(activeFilter));

    const handleCardClick = (idea) => {
        setSelectedIdea({
            ...idea,
            image_url: resolveImage(idea.image_url),
        });
    };

    const closeModal = () => {
        setSelectedIdea(null);
    };

    return (
        <div className="omnichannel-page">
            <Header />
            <main className="omnichannel-main">
                {/* Page Header — matching live site design */}
                <section className="page-header">
                    <h1>Omnichannel</h1>
                    <p>A 360° activation strategy designed to engage, captivate, and inspire passengers around the world.</p>
                </section>

                <div className="inner-content-wrapper">
                    <p className="omni-subheading">Activation ideas</p>

                    <FilterTabs
                        tabs={filterTabs}
                        activeTab={activeFilter}
                        onTabChange={setActiveFilter}
                    />

                    {loading ? (
                        <div className="activation-loading">Loading ideas...</div>
                    ) : (
                        <>
                            <div className="activation-grid">
                                {filteredIdeas.map((idea) => (
                                    <ActivationCard
                                        key={idea.id}
                                        title={idea.title}
                                        imageUrl={resolveImage(idea.image_url)}
                                        channels={idea.channels || []}
                                        onClick={() => handleCardClick(idea)}
                                    />
                                ))}
                            </div>

                            {filteredIdeas.length === 0 && (
                                <div className="activation-empty">
                                    No activation ideas found for this channel.
                                </div>
                            )}
                        </>
                    )}
                </div>

                <IdeaDetailModal
                    idea={selectedIdea}
                    onClose={closeModal}
                    imageMap={imageMap}
                />
            </main>
            <Footer />
        </div>
    );
}
