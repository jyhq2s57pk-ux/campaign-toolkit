
import React from 'react';
import './ImplementationTips.css';


export default function ImplementationTips() {
    const items = [
        {
            id: 1,
            title: "Sustainability is a systems problem",
            text: "Specific ticket type was created under Ecommerce Trading Toolkit DCR to manage toolkits implementation."
        },
        {
            id: 2,
            title: "Sustainability is a systems problem",
            text: "Please include the desired level of activation in the ticket as a first step. All components from this level will be included to streamline the implementation."
        },
        {
            id: 3,
            title: "Sustainability is a systems problem",
            text: "Start and end date are essential to schedule the updates."
        },
        {
            id: 4,
            title: "Sustainability is a systems problem",
            text: "Remember, ensure to check the visuals to be used in your region."
        },
        {
            id: 5,
            title: "Sustainability is a systems problem",
            text: "Translations must also be checked."
        },
        {
            id: 6,
            title: "Sustainability is a systems problem",
            text: "Once the ticket has been properly completed and checked, please assign it to the content team."
        },
        {
            id: 7,
            title: "Sustainability is a systems problem",
            text: "A global proposal mock-up in excel, with copy by component and AI generated translations, will be included in the JIRA tickets.",
            isNew: true
        },
        {
            id: 8,
            title: "Sustainability is a systems problem",
            text: "If you need support with visuals, copy, or translations, please open a JIRA ticket in the DCCR board."
        }
    ];

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
                {items.map((item) => (
                    <div key={item.id} className="tip-item">
                        <div className="tip-number">{item.id}</div>
                        <div className="tip-content">
                            {/* Note: The user provided copy doesn't have titles, so we use the text as main content 
                  and hide the placeholder title unless user asks for it. 
                  Based on screenshot, there IS a title (white) and subtitle (grey).
                  But user provided copy is just blocks of text.
                  I will use the user's text as the "Subtitle/Description" and maybe format the first few words or context?
                  Actually, looking at the screenshot: 'Sustainability is a systems problem' is the white title. 'We build tools...' is grey.
                  The user provided: 'Specific ticket type was created...'
                  I'll use the user text as the main content (white) for now as they didn't provide titles. */}

                            <div className="tip-text-block">
                                <p className="tip-text">{item.text}</p>
                                {item.isNew && <span className="new-badge">NEW</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
