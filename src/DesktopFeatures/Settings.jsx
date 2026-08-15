import React, { useCallback, useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable';
import Display from './SettingsPages/Display'

const Settings = ({onClose}) => {
    const nodeRef = useRef(null);
    const [activePage, setActivePage] = useState('display');
    const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem('desktop-brightness')) || 100);
    const [nightLight, setNightLight] = useState(() => localStorage.getItem('desktop-night-light') === 'on');

    const createSnowEffect = useCallback(() => {
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        snowContainer.className = 'snow-container';

        for (let i = 0; i < 50; i++) {
            const snowFlake = document.createElement('div');
            snowFlake.className = 'snowflake';
            snowFlake.innerHTML = '❄';

            const size = Math.random() * 20 + 10;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 5 + 5;
            const animationDelay = Math.random() * 5;

            snowFlake.style.cssText = `
                left: ${left}%;
                font-size: ${size}px;
                animation-duration: ${animationDuration}s;
                animation-delay: ${animationDelay}s;
                opacity: ${Math.random() * 0.7 + 0.3};
            `;

            snowContainer.appendChild(snowFlake);
        }
        document.querySelector('.desktop').appendChild(snowContainer);
    }, []);

    const applyTheme = useCallback((theme) => {
        const desktop = document.querySelector('.desktop');
        if (!desktop) return;

        desktop.classList.remove('theme-normal', 'theme-christmas');
        desktop.classList.add(`theme-${theme}`);

        const existingSnow = document.getElementById('snow-container');
        if (existingSnow) {
            existingSnow.remove();
        }

        if (theme === 'christmas') {
            createSnowEffect();
        }
    }, [createSnowEffect]);

    const setTheme = (theme) => {
        applyTheme(theme);
        localStorage.setItem('desktop-theme', theme);
    }

    useEffect(() => {
        applyTheme(localStorage.getItem('desktop-theme') || 'normal');
    }, [applyTheme]);

    useEffect(() => {
        const desktop = document.querySelector('.desktop');
        if (!desktop) return;

        const filters = [`brightness(${brightness / 100})`];
        if (nightLight) filters.push('sepia(0.5) hue-rotate(-15deg) saturate(0.9)');
        desktop.style.filter = filters.join(' ');

        localStorage.setItem('desktop-brightness', brightness);
        localStorage.setItem('desktop-night-light', nightLight ? 'on' : 'off');
    }, [brightness, nightLight]);

    const pages = [
        { id: 'display', label: 'Display Settings' },
        { id: 'appearance', label: 'Appearance Settings' },
        { id: 'action', label: 'Action Settings' },
        { id: 'internet', label: 'Internet Settings' },
        { id: 'bluetooth', label: 'Bluetooth Settings' },
    ];

    const renderPage = () => {
        switch (activePage) {
            case 'display':
                return (
                    <Display
                        brightness={brightness}
                        onChangeBrightness={setBrightness}
                        nightLight={nightLight}
                        onToggleNightLight={() => setNightLight(!nightLight)}
                    />
                );
            case 'appearance':
                return (
                    <div>
                        <h3>Appearance</h3>
                        <div className="theme-options">
                            <button className="settings-btn" onClick={() => setTheme('normal')}>Normal</button>
                            <button className="settings-btn" onClick={() => setTheme('christmas')}>Christmas</button>
                        </div>
                    </div>
                );
            default:
                return <h3>Coming soon</h3>;
        }
    }

    return (
        <Draggable nodeRef={nodeRef} handle='.settings-header' defaultPosition={{x: 100, y: -100}}>
            <div ref={nodeRef} className="settings-window">
                <div className="settings-header">
                    <div className="settings-title">Settings</div>
                    <button className="settings-close-btn" onClick={onClose}>X</button>
                </div>
                <div className="settings-content">
                    <div className="settings-list">
                        <ul>
                            {pages.map(page => (
                                <li
                                    key={page.id}
                                    className={activePage === page.id ? 'active' : ''}
                                    onClick={() => setActivePage(page.id)}
                                >
                                    {page.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="settings-page">
                        {renderPage()}
                    </div>
                </div>
            </div>
        </Draggable>
    )
}

export default Settings