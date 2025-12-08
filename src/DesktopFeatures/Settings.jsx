import React, { useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable';

const Settings = ({onClose}) => {
    const [currentTheme, setCurentTheme] = useState('normal');
    const nodeRef = useRef(null);

    const applyTheme = (theme) => {
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
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('desktop-theme') || 'normal';
        setCurentTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    
    const createSnowEffect = () => {
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        snowContainer.className = 'snow-container';


        for (let i = 0; i < 50; i++) {
            const snowFlake = document.createElement('div');
            snowFlake.className = 'snowFlake';
            snowFlake.innerHTML = '❄';


            const size = Math.random() *20 +10;
            const left = Math.random() *100;
            const animationDuration = Math.random() *5 + 5;
            const animationDelay = Math.random()*5;


            snowFlake.style.cssText = `
                left: ${left}%;
                font-size: ${size}px;
                animation-duration: ${animationDuration}s;
                animation-delay: ${animationDelay}s;
                opacity: ${Math.random()*0.7 + 0.3};
            `;

            snowContainer.appendChild(snowFlake);
        }
        document.querySelector('.desktop').appendChild(snowContainer);
    };



    const handleCristmasTheme = () => {
        setCurentTheme('christmas');
        applyTheme('christmas');
        localStorage.setItem('desktop-theme', 'christmas');        
    };

    const handleDefaultTheme = () => {
        setCurentTheme('normal');
        applyTheme('normal');
        localStorage.setItem('desktop-theme', 'normal');
    };
  return (
    <Draggable nodeRef={nodeRef} handle='.settings-header' defaultPosition={{x:100, y:-100}}>
    <div ref={nodeRef} className="settings-window">
        <div className="settings-header">
            <div className="settings-title">Settings</div>
            <button className="settings-close-btn" onClick={onClose}>X</button>
        </div>
        <div className="settings-content">
            <div className="settings-list">
                <ul>
                    <li>Display Settings</li>
                    <li>Appereance Settings</li>
                    <li>Action Settings</li>
                    <li>Internet Settings</li>
                    <li>Bluetooth Setings</li>
                </ul>
            </div>

            
        </div>
    </div>
    </Draggable>
)
}

export default Settings