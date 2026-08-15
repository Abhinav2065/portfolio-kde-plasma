import React, { useEffect, useState } from 'react'
import './Desktop.css'
import firefox from '../assets/firefox.png'
import terminal from '../assets/terminal.png'
import arch from '../assets/arch.png'
import Terminal from '../terminal/Terminal'
import Icons from './Icons'
import settings from '../assets/settings.png'
import './Icons.css'
import Firefox from './Firefox'
import StartMenu from '../DesktopFeatures/StartMenu'
import Settings from '../DesktopFeatures/Settings'
import Notepad from './Notepad'


const Desktop = () => {

  const [showterminal, setShowTerminal] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showFirefox, setShowFirefox] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hours12: true
  });
  const dateString = now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

  const handleTerminalClose = () => {
    setShowTerminal(false);
  }

  const handleTerminalOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowTerminal(true);
  }


  const handleFirefoxClose = () => {
    setShowFirefox(false);
  }

  const handleFirefoxOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowFirefox(true);
  }



  const handleStartButtonClick = (e) => {
    e.stopPropagation();
    setShowStartMenu(prev => !prev);
  }


  const handleDesktopClick = () => {
    if (showStartMenu) {
      setShowStartMenu(false);
    }
  }

  const handleStartMenuClick = (e) => {
    e.stopPropagation();
  }

  const handleSettingsClose = () => {
    setShowSettings(false);
  }

  const handleSettingsOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowSettings(true);
  }

  const handleNotepadOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowNotepad(true);
  }

  const handleNotepadClose = () => {
    setShowNotepad(false);
  }

  return (
    <div>
       <div className="desktop" onClick={handleDesktopClick}>
            {showterminal && <Terminal onClose={handleTerminalClose}/>}
            {showFirefox && <Firefox onClose={handleFirefoxClose} />}
            {showNotepad && (
              <Notepad
                title="Notepad"
                content="Welcome to my portfolio desktop! Double-click the desktop icons to read about me, my projects, and my links."
                onClose={handleNotepadClose}
              />
            )}
           <Icons></Icons>

          {showStartMenu && (
            <StartMenu
              onClick={handleStartMenuClick}
              onOpenFirefox = {handleFirefoxOpen}
              onOpenTerminal={handleTerminalOpen}
              onOpenNotepad={handleNotepadOpen}
            />
          )}

          {showSettings && (
            <Settings onClose={handleSettingsClose}/>
          )}

            <div className="taskbar">
                    <button type="button" className={`taskbar-btn start-btn ${showStartMenu ? 'active' : ''}`} onClick={handleStartButtonClick} title="Start Menu">
                        <img src={arch} alt="Start Menu" className='tb-arch' />
                    </button>
                    <button type="button" className={`taskbar-btn ${showFirefox ? 'active' : ''}`} onClick={handleFirefoxOpen} title="Firefox">
                        <img src={firefox} alt="Firefox" className='tb-firefox' />
                    </button>
                    <button type="button" className={`taskbar-btn ${showterminal ? 'active' : ''}`} onClick={handleTerminalOpen} title="Terminal">
                        <img src={terminal} alt="Terminal" className='tb-terminal' />
                    </button>
                    <button type="button" className={`taskbar-btn ${showSettings ? 'active' : ''}`} onClick={handleSettingsOpen} title="Settings">
                        <img src={settings} alt="Settings" className='tb-settings' />
                    </button>

                    <div className="taskbar-clock">
                        <span className="tb-time">{timeString}</span>
                        <span className="tb-date">{dateString}</span>
                    </div>
            </div>
        </div>
    </div>
  )
}

export default Desktop;