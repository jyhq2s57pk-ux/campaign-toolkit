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
        Promise.all([
            api.getOmnichannel(),
            api.getOmnichannelIdeas(campaignId)
        ]).then(([channelsData, ideasData]) => {
            if (channelsData) setChannels(channelsData);
            if (ideasData) setIdeas(ideasData);
            setLoading(false);
        });
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
                <div className="inner-content-wrapper">
                    <div className="omni-panel">
                        <svg className="omni-panel__logo" width="69" height="37" viewBox="0 0 69 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.4431 18.3573C30.4431 12.4526 30.4431 6.54792 30.4431 0.643236C30.4431 0.0130828 30.3561 0 31.0724 0C33.3413 0.00218046 35.6081 0 37.877 0C37.9929 0 38.1088 0 38.2247 0.00436092C38.3634 0.00872184 38.438 0.0893989 38.4442 0.231129C38.4504 0.370678 38.4504 0.510228 38.4504 0.649777C38.4504 12.4592 38.4504 24.2685 38.4504 36.0801C38.4504 36.0975 38.4504 36.115 38.4504 36.1324C38.4504 36.7386 38.4504 36.7408 37.8873 36.7408C35.9 36.7408 33.9126 36.7408 31.9274 36.7408C31.5299 36.7408 31.1324 36.7342 30.7349 36.7408C30.5238 36.7451 30.4286 36.6601 30.441 36.4355C30.4493 36.296 30.441 36.1564 30.441 36.0169C30.441 30.1296 30.441 24.2424 30.441 18.3551L30.4431 18.3573Z" fill="white" />
                            <path d="M40.0513 0.0806711C40.2435 -0.0261275 40.3854 0.0109251 40.5187 0.0109251C42.9799 0.00874549 45.4434 0.0174637 47.9047 2.72345e-05C48.265 -0.00215233 48.4747 0.126442 48.68 0.403246C50.248 2.51742 51.4666 4.81468 52.4057 7.26669C53.3426 9.71652 53.9585 12.2448 54.2642 14.845C54.5197 17.0268 54.5394 19.2107 54.3145 21.4033C53.9017 25.4137 52.7879 29.2062 50.925 32.7828C50.2567 34.0666 49.4858 35.2893 48.6057 36.4401C48.4725 36.6145 48.3524 36.7409 48.1012 36.7409C45.4478 36.7322 42.7943 36.7366 40.1496 36.7366C40.0775 36.6211 40.1496 36.56 40.2085 36.5012C42.1326 34.5744 43.3883 32.2423 44.323 29.7227C45.2512 27.2184 45.8496 24.6335 46.1422 21.9744C46.3301 20.2569 46.3978 18.535 46.306 16.8154C46.0789 12.5521 45.1595 8.45237 43.2638 4.60109C42.482 3.01218 41.508 1.55624 40.2413 0.302987C40.1801 0.244138 40.1299 0.174392 40.0513 0.0806711Z" fill="white" />
                            <path d="M28.7968 36.6799C28.6152 36.7627 28.4577 36.7278 28.3045 36.73C25.889 36.7322 23.4756 36.7213 21.06 36.7409C20.664 36.7431 20.4233 36.6232 20.1914 36.3072C17.8896 33.195 16.347 29.734 15.3887 26.0028C14.6185 22.9974 14.2969 19.9418 14.461 16.8492C14.671 12.9022 15.5834 9.11439 17.2266 5.50961C18.0603 3.68106 19.0558 1.94623 20.2767 0.344351C20.4343 0.139484 20.5808 0 20.8697 0C23.4778 0.0108972 26.0837 0.0065383 28.6918 0.0065383C28.7399 0.0065383 28.799 -0.0108972 28.8384 0.102433C28.6349 0.322556 28.4117 0.557935 28.1951 0.797673C26.7379 2.41045 25.6942 4.27605 24.8869 6.27241C23.8366 8.86594 23.1693 11.5597 22.817 14.3341C22.6573 15.596 22.5566 16.8666 22.561 18.1307C22.5851 23.1892 23.5347 28.0515 25.8802 32.5891C26.5957 33.9752 27.4884 35.2393 28.5824 36.3573C28.6634 36.4401 28.7793 36.5055 28.7968 36.6755V36.6799Z" fill="white" />
                            <path d="M48.6724 0.00874399C51.8723 0.00874399 55.0745 0.0174612 58.2745 2.67827e-05C58.7696 -0.00215252 59.1537 0.128606 59.5355 0.414094C62.0736 2.31009 64.1352 4.58528 65.7548 7.22224C67.2611 9.67613 68.2514 12.3087 68.647 15.1113C69.5586 21.5533 67.8997 27.3568 63.6262 32.4804C62.3999 33.9514 61.0001 35.2633 59.429 36.414C59.1236 36.6385 58.8159 36.7431 58.4179 36.7409C55.1069 36.7256 51.7959 36.7322 48.4827 36.7322H48.1495C48.1564 36.5448 48.3184 36.5556 48.4225 36.5099C50.7478 35.5161 52.8765 34.239 54.7182 32.5653C57.7539 29.8063 59.6905 26.4568 60.6854 22.6125C61.0903 21.0521 61.324 19.4721 61.2546 17.8594C61.1505 15.4535 60.5581 13.1456 59.5748 10.9314C57.4091 6.05195 53.7256 2.54981 48.633 0.339998C48.4595 0.263722 48.2582 0.222316 48.0616 0.00874399H48.6724Z" fill="white" />
                            <path d="M19.1892 0.00871774C18.2895 0.531782 17.3855 0.980746 16.5264 1.51471C12.2564 4.17144 9.43533 7.9702 7.9372 12.8129C7.40505 14.5303 7.07807 16.2913 7.0396 18.0893C6.999 19.944 7.31529 21.7595 7.82179 23.5401C8.82838 27.0751 10.5915 30.1503 13.2223 32.6894C14.8508 34.2585 16.7101 35.4812 18.7447 36.4314C18.8943 36.5012 19.0674 36.5382 19.2256 36.7344H18.7575C15.7313 36.7344 12.7073 36.73 9.6811 36.7409C9.31779 36.7409 9.02928 36.6472 8.74504 36.4162C4.39383 32.8724 1.56212 28.3719 0.425162 22.7904C0.0169685 20.7831 -0.0792027 18.7497 0.0597112 16.7141C0.309756 13.0766 1.38687 9.69413 3.26969 6.58625C4.72936 4.17798 6.54379 2.09226 8.73649 0.34871C9.03141 0.113331 9.33061 0 9.71743 0C12.7436 0.015256 15.7677 0.00871774 18.7939 0.00871774C18.9264 0.00871774 19.0567 0.00871774 19.1892 0.00871774Z" fill="white" />
                        </svg>
                        <p className="omni-panel__text">
                            <span className="omni-panel__text--purple">A 360° activation strategy </span>
                            <span className="omni-panel__text--white">designed to engage, captivate, and inspire passengers around the world.</span>
                        </p>
                        <p className="omni-panel__subheading">Omnichannel engagement ideas</p>
                        <div className="omni-panel__scroll-indicator">
                            <svg className="omni-panel__arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 16L6 10H18L12 16Z" fill="white" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="inner-content-wrapper">
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
