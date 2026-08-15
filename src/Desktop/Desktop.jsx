import React, { useState } from 'react'
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





  
  const handleTerminalClose = () => {
    console.log('Closing The Terminal');
    setShowTerminal(false);
  }  

  const handleTerminalOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Opening The Terminal');
    setShowTerminal(true);
  }


  const handleFirefoxClose = () => {
    console.log('Closing Firefox');
    setShowFirefox(false);
  }

  const handleFirefoxOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Opening Firefox');
    setShowFirefox(true);
  }



  const handleStartButtonClick = () => {
    setShowStartMenu(true);
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
    console.log('Closing Settings');
    setShowSettings(false);
  }

  const handleSettingsOpen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('Opening Settings');
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
                <ul>
                    <li><button type="button" className="taskbar-btn" onClick={handleStartButtonClick}><img src={arch} alt="Start Menu" className='arch' /></button></li>
                    <li><button type="button" className="taskbar-btn" onClick={handleFirefoxOpen}><img src={firefox} alt="Firefox" className='firefox' /></button></li>
                    <li><button type="button" className="taskbar-btn" onClick={handleTerminalOpen}><img src={terminal} alt="Terminal" className='terminal' /></button></li>
                    <li><button type="button" className="taskbar-btn" onClick={handleSettingsOpen}><img src={settings} alt="Settings" className='file' /></button></li>
                </ul>
            </div>
        </div> 
    </div>
  )
}

export default Desktop;
