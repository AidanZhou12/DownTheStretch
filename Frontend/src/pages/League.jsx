import { useRef, useState } from 'react';
import './pages.css';

const TABS = ['Team', 'Matchup', 'Waivers', 'Standings'];

function LeaguePage() {
    const [activeTab, setActiveTab] = useState(0);
    const tabRefs = useRef([]);

    function handleTabKeyDown(event, index) {
        let nextTab;
        if (event.key === 'ArrowRight') nextTab = (index + 1) % TABS.length;
        else if (event.key === 'ArrowLeft') nextTab = (index - 1 + TABS.length) % TABS.length;
        else if (event.key === 'Home') nextTab = 0;
        else if (event.key === 'End') nextTab = TABS.length - 1;
        else return;

        event.preventDefault();
        setActiveTab(nextTab);
        tabRefs.current[nextTab].focus();
    }

    return (
        <main className="league-page">
            <div className="league-tabs" role="tablist" aria-label="League sections">
                {TABS.map((label, index) => (
                    <button
                        key={label}
                        ref={element => { tabRefs.current[index] = element; }}
                        type="button"
                        role="tab"
                        id={`league-tab-${index}`}
                        aria-controls={`league-panel-${index}`}
                        aria-selected={activeTab === index}
                        tabIndex={activeTab === index ? 0 : -1}
                        onClick={() => setActiveTab(index)}
                        onKeyDown={event => handleTabKeyDown(event, index)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            {TABS.map((label, index) => (
                <section
                    key={label}
                    role="tabpanel"
                    id={`league-panel-${index}`}
                    aria-labelledby={`league-tab-${index}`}
                    hidden={activeTab !== index}
                    tabIndex={0}
                >
                    <h1>{label}</h1>
                </section>
            ))}
        </main>
    );
}

export default LeaguePage;
