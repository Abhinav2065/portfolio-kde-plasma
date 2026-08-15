import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Features.css'


const StartMenu = ({onClick, onOpenFirefox, onOpenTerminal, onOpenNotepad}) => {
    const [query, setQuery] = useState('');

    const apps = [
        { name: 'Firefox', open: onOpenFirefox },
        { name: 'Notepad', open: onOpenNotepad },
        { name: 'Meow (Terminal)', open: onOpenTerminal },
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
                    <ul>
                        {filteredApps.map(app => (
                            <li key={app.name}>
                                <Link
                                    onClick={(e) => handleAppClick(e, app.open)}
                                    className='start-menu-link'
                                >
                                    {app.name}
                                </Link>
                            </li>
                        ))}
                        {filteredApps.length === 0 && <li>No apps found</li>}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default StartMenu