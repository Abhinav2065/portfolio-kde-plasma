import React, { useState } from 'react'
import './Features.css'
import firefox from '../assets/firefox.png'
import terminal from '../assets/terminal.png'
import notepad from '../assets/notepad.png'
import pfp from '../assets/pfp.png'


const StartMenu = ({onClick, onOpenFirefox, onOpenTerminal, onOpenNotepad}) => {
    const [query, setQuery] = useState('');

    const apps = [
        { name: 'Firefox', open: onOpenFirefox, icon: firefox },
        { name: 'Notepad', open: onOpenNotepad, icon: notepad },
        { name: 'Terminal', open: onOpenTerminal, icon: terminal },
    ];

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleAppClick = (e, openFunction) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        openFunction();
    }

    return (
        <div className='start-window'>
            <div className="start-menu" onClick={onClick}>
                <div className="start-menu-header">
                    <img src={pfp} alt="user" className="start-menu-pfp" />
                    <span className="start-menu-username">ablag</span>
                </div>

                <div className="search-apps-box">
                    <input
                        type="text"
                        className='app-search-box'
                        placeholder='Search...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="apps-list">
                    {filteredApps.map(app => (
                        <button
                            key={app.name}
                            className="app-item"
                            onClick={(e) => handleAppClick(e, app.open)}
                        >
                            <img src={app.icon} alt={app.name} className="app-item-icon" />
                            <span>{app.name}</span>
                        </button>
                    ))}
                    {filteredApps.length === 0 && <div className="no-apps">No apps found</div>}
                </div>

                <div className="start-menu-footer">
                    <button type="button" className="footer-btn" title="Lock">
                        <span className="material-symbol">🔒</span>
                    </button>
                    <button type="button" className="footer-btn" title="Restart">
                        <span className="material-symbol">⟳</span>
                    </button>
                    <button type="button" className="footer-btn" title="Shut down">
                        <span className="material-symbol">⏻</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StartMenu