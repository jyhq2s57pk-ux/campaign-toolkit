
import React from 'react';
import RichText from './RichText';
import './ImplementationTips.css';

const DEFAULT_TIPS = [
    { id: 1, text: "Specific ticket type was created under Ecommerce Trading Toolkit DCR to manage toolkits implementation." },
    { id: 2, text: "Please include the desired level of activation in the ticket as a first step. All components from this level will be included to streamline the implementation." },
    { id: 3, text: "Start and end date are essential to schedule the updates." },
    { id: 4, text: "Remember, ensure to check the visuals to be used in your region." },
    { id: 5, text: "Translations must also be checked." },
    { id: 6, text: "Once the ticket has been properly completed and checked, please assign it to the content team." },
    { id: 7, text: "A global proposal mock-up in excel, with copy by component and AI generated translations, will be included in the JIRA tickets.", isNew: true },
    { id: 8, text: "If you need support with visuals, copy, or translations, please open a JIRA ticket in the DCCR board." }
];

export default function ImplementationTips({ tips }) {
    const items = tips && tips.length > 0 ? tips : DEFAULT_TIPS;

    if (items.length === 0) return null;

    return (
        <div className="implementation-tips-container">
            <div className="tips-headline-col">
                <div className="headline-wrapper-relative">
                    <h2>
                        Tips for making the implementation smoother!
                    </h2>
                </div>
            </div>

            <div className="tips-list-col">
                {items.map((item, index) => (
                    <div key={item.id || index} className="tip-item">
                        <div className="tip-number">{index + 1}</div>
                        <div className="tip-content">
                            <div className="tip-text-block">
                                <p className="tip-text"><RichText>{item.text}</RichText></p>
                                {(item.isNew || item.is_new) && <span className="new-badge">NEW</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
