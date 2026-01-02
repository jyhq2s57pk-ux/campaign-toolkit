import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AnnexPage.css';

export default function AnnexPage() {
    const sections = [
        { id: 'inventory', title: 'Component Inventory' },
        { id: 'specs', title: 'Image Dimensions & Specs' },
        { id: 'matrices', title: 'Activation Matrices' },
        { id: 'glossary', title: 'Glossary & Links' },
    ];

    return (
        <div className="annex-page">
            <Header />
            <main className="annex-main">
                <div className="outer-container">
                    <section className="page-header">
                        <h1>Annex & Reference</h1>
                        <p>
                            Full component inventory, image dimensions and activation matrices.
                        </p>
                    </section>

                    <div className="inner-content-wrapper annex-layout">
                        <aside className="annex-sidenav">
                            <nav>
                                <ul>
                                    {sections.map((sec) => (
                                        <li key={sec.id}>
                                            <a href={`#${sec.id}`}>{sec.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </aside>

                        <div className="annex-content">
                            <section id="inventory" className="annex-section glass">
                                <h2>Component Inventory</h2>
                                <div className="reference-item">
                                    <h3>Hero Banners</h3>
                                    <p>Full-width adaptive modules for Web and App homepages.</p>
                                </div>
                                <div className="reference-item">
                                    <h3>Content Blocks</h3>
                                    <p>Dual and triple static or carousel blocks for category pages.</p>
                                </div>
                            </section>

                            <section id="specs" className="annex-section glass">
                                <h2>Image Dimensions & Specs</h2>
                                <table className="specs-table">
                                    <thead>
                                        <tr>
                                            <th>Placement</th>
                                            <th>Dimensions</th>
                                            <th>Safe Zone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Web Hero</td>
                                            <td>2880 x 1200px</td>
                                            <td>Center 1200px</td>
                                        </tr>
                                        <tr>
                                            <td>App Hero</td>
                                            <td>1125 x 1500px</td>
                                            <td>Top 800px</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>

                            <section id="matrices" className="annex-section glass">
                                <h2>Activation Matrices</h2>
                                <p>Detailed matrix explaining which components are required for each activation level (Premium vs Executive).</p>
                            </section>

                            <section id="glossary" className="annex-section glass">
                                <h2>Glossary & Links</h2>
                                <ul className="links-list">
                                    <li><a href="#">DCCR Submission Portal</a></li>
                                    <li><a href="#">Global Creative Brand Guidelines</a></li>
                                    <li><a href="#">Jira Project Home</a></li>
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
