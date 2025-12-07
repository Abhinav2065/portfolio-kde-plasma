import React, { useState } from 'react'
import './Desktop.css'
import { Link } from 'react-router-dom'
import firefox from '../assets/firefox.png'
import terminal from '../assets/terminal.png'
import file from '../assets/file.png'
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
  const [startClick, setStartClick] = useState(false);
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
    if (showStartMenu && !startClick) {
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

  return (
    <div>
       <div className="desktop" onClick={handleDesktopClick}>
            {showterminal && <Terminal onClose={handleTerminalClose}/>}
            {showFirefox && <Firefox onClose={handleFirefoxClose} />}
           <Icons></Icons> 

          {showStartMenu && (
            <StartMenu 
              onClick={handleStartMenuClick} 
              onOpenFirefox = {handleFirefoxOpen}
              onOpenTerminal={handleTerminalOpen}
            />
          )}

          {showSettings && (
            <Settings onClose={handleSettingsClose}/>
          )} 

            <div className="taskbar">
                <ul>
               <li><Link><img src={arch} className='arch'  onClick={handleStartButtonClick}/></Link></li>
                    <li ><Link onClick={handleFirefoxOpen}><img src={firefox} alt="" className='firefox' /></Link></li>
                    <li><Link onClick={handleTerminalOpen} ><img src={terminal} alt="" className='terminal' /></Link></li>
                    <li><Link onClick={handleSettingsOpen}><img src={settings} alt="Settings" className='file' /></Link></li>
                </ul>
            </div>
        </div> 
    </div>
  )
}

export default Desktop;
