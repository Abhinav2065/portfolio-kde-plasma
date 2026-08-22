import React, { useEffect, useState } from 'react'
import './Desktop.css'
import firefox from '../assets/firefox.png'
import terminal from '../assets/terminal.png'
import arch from '../assets/arch.png'
import notepadImg from '../assets/notepad.png'
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
  const [terminalMinimized, setTerminalMinimized] = useState(false);

  const [showStartMenu, setShowStartMenu] = useState(false);

  const [showFirefox, setShowFirefox] = useState(false);
  const [firefoxMinimized, setFirefoxMinimized] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [settingsMinimized, setSettingsMinimized] = useState(false);

  const [notepad, setNotepad] = useState(null);
  const [notepadMinimized, setNotepadMinimized] = useState(false);

  const [zIndexes, setZIndexes] = useState({
    terminal: 10,
    firefox: 11,
    settings: 12,
    notepad: 13,
  });
  const [topZIndex, setTopZIndex] = useState(20);

  const bringToFront = (appName) => {
    setTopZIndex(prev => {
      const nextZ = prev + 1;
      setZIndexes(current => ({
        ...current,
        [appName]: nextZ
      }));
      return nextZ;
    });
  };

  const isTopWindow = (appName) => {
    const appZ = zIndexes[appName] || 0;
    const openApps = [];
    if (showterminal && !terminalMinimized) openApps.push('terminal');
    if (showFirefox && !firefoxMinimized) openApps.push('firefox');
    if (showSettings && !settingsMinimized) openApps.push('settings');
    if (notepad && !notepadMinimized) openApps.push('notepad');

    if (!openApps.includes(appName)) return false;
    return openApps.every(name => name === appName || appZ >= (zIndexes[name] || 0));
  };

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
    setTerminalMinimized(false);
  }

  const handleTerminalMinimize = () => {
    setTerminalMinimized(true);
  }

  const handleTerminalOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowTerminal(true);
    setTerminalMinimized(false);
    bringToFront('terminal');
  }

  const handleTerminalTaskbarClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!showterminal) {
      setShowTerminal(true);
      setTerminalMinimized(false);
      bringToFront('terminal');
    } else if (terminalMinimized) {
      setTerminalMinimized(false);
      bringToFront('terminal');
    } else if (isTopWindow('terminal')) {
      setTerminalMinimized(true);
    } else {
      bringToFront('terminal');
    }
  }

  const handleFirefoxClose = () => {
    setShowFirefox(false);
    setFirefoxMinimized(false);
  }

  const handleFirefoxMinimize = () => {
    setFirefoxMinimized(true);
  }

  const [firefoxUrl, setFirefoxUrl] = useState(null);

  const handleFirefoxOpen = (target) => {
    if (target && target.preventDefault) {
      target.preventDefault();
      target.stopPropagation();
    }
    setShowFirefox(true);
    setFirefoxMinimized(false);
    bringToFront('firefox');
    if (typeof target === 'string') {
      setFirefoxUrl({ url: target, time: Date.now() });
    }
  }

  const handleFirefoxTaskbarClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!showFirefox) {
      setShowFirefox(true);
      setFirefoxMinimized(false);
      bringToFront('firefox');
    } else if (firefoxMinimized) {
      setFirefoxMinimized(false);
      bringToFront('firefox');
    } else if (isTopWindow('firefox')) {
      setFirefoxMinimized(true);
    } else {
      bringToFront('firefox');
    }
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
    setSettingsMinimized(false);
  }

  const handleSettingsMinimize = () => {
    setSettingsMinimized(true);
  }

  const handleSettingsOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowSettings(true);
    setSettingsMinimized(false);
    bringToFront('settings');
  }

  const handleSettingsTaskbarClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!showSettings) {
      setShowSettings(true);
      setSettingsMinimized(false);
      bringToFront('settings');
    } else if (settingsMinimized) {
      setSettingsMinimized(false);
      bringToFront('settings');
    } else if (isTopWindow('settings')) {
      setSettingsMinimized(true);
    } else {
      bringToFront('settings');
    }
  }

  const handleNotepadOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setNotepad({ name: 'Notepad', content: 'Welcome to my portfolio desktop! Double-click the desktop icons to read about me, my projects, and my links.' });
    setNotepadMinimized(false);
    bringToFront('notepad');
  }

  const handleIconNotepadOpen = (icon) => {
    setNotepad({ name: icon.name, content: icon.content });
    setNotepadMinimized(false);
    bringToFront('notepad');
  }

  const handleNotepadClose = () => {
    setNotepad(null);
    setNotepadMinimized(false);
  }

  const handleNotepadMinimize = () => {
    setNotepadMinimized(true);
  }

  const handleNotepadTaskbarClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!notepad) {
      handleNotepadOpen(e);
    } else if (notepadMinimized) {
      setNotepadMinimized(false);
      bringToFront('notepad');
    } else if (isTopWindow('notepad')) {
      setNotepadMinimized(true);
    } else {
      bringToFront('notepad');
    }
  }

  return (
    <div>
       <div className="desktop" onClick={handleDesktopClick}>
            {showterminal && (
              <Terminal
                onClose={handleTerminalClose}
                onMinimize={handleTerminalMinimize}
                isMinimized={terminalMinimized}
                zIndex={zIndexes.terminal}
                isFocused={isTopWindow('terminal')}
                onFocus={() => bringToFront('terminal')}
                onOpenFirefox={handleFirefoxOpen}
              />
            )}
            {showFirefox && (
              <Firefox
                onClose={handleFirefoxClose}
                onMinimize={handleFirefoxMinimize}
                isMinimized={firefoxMinimized}
                zIndex={zIndexes.firefox}
                isFocused={isTopWindow('firefox')}
                onFocus={() => bringToFront('firefox')}
                externalUrl={firefoxUrl}
              />
            )}
            {notepad && (
              <Notepad
                title={notepad.name}
                content={notepad.content}
                onClose={handleNotepadClose}
                onMinimize={handleNotepadMinimize}
                isMinimized={notepadMinimized}
                zIndex={zIndexes.notepad}
                isFocused={isTopWindow('notepad')}
                onFocus={() => bringToFront('notepad')}
              />
            )}
           <Icons onOpenNotepad={handleIconNotepadOpen}></Icons>

          {showStartMenu && (
            <StartMenu
              onClick={handleStartMenuClick}
              onOpenFirefox={handleFirefoxOpen}
              onOpenTerminal={handleTerminalOpen}
              onOpenNotepad={handleNotepadOpen}
            />
          )}

          {showSettings && (
            <Settings
              onClose={handleSettingsClose}
              onMinimize={handleSettingsMinimize}
              isMinimized={settingsMinimized}
              zIndex={zIndexes.settings}
              isFocused={isTopWindow('settings')}
              onFocus={() => bringToFront('settings')}
            />
          )}

            <div className="taskbar">
                    <button type="button" className={`taskbar-btn start-btn ${showStartMenu ? 'active' : ''}`} onClick={handleStartButtonClick} title="Start Menu">
                        <img src={arch} alt="Start Menu" className='tb-arch' />
                    </button>
                    <button type="button" className={`taskbar-btn ${showFirefox ? 'active' : ''} ${showFirefox && !firefoxMinimized && isTopWindow('firefox') ? 'focused' : ''}`} onClick={handleFirefoxTaskbarClick} title="Firefox">
                        <img src={firefox} alt="Firefox" className='tb-firefox' />
                    </button>
                    <button type="button" className={`taskbar-btn ${showterminal ? 'active' : ''} ${showterminal && !terminalMinimized && isTopWindow('terminal') ? 'focused' : ''}`} onClick={handleTerminalTaskbarClick} title="Terminal">
                        <img src={terminal} alt="Terminal" className='tb-terminal' />
                    </button>
                    <button type="button" className={`taskbar-btn ${showSettings ? 'active' : ''} ${showSettings && !settingsMinimized && isTopWindow('settings') ? 'focused' : ''}`} onClick={handleSettingsTaskbarClick} title="Settings">
                        <img src={settings} alt="Settings" className='tb-settings' />
                    </button>
                    <button type="button" className={`taskbar-btn ${notepad ? 'active' : ''} ${notepad && !notepadMinimized && isTopWindow('notepad') ? 'focused' : ''}`} onClick={handleNotepadTaskbarClick} title="Notepad">
                        <img src={notepadImg} alt="Notepad" className='tb-notepad' />
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