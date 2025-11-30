import React, { useState } from 'react'
import './Desktop.css'
import { Link } from 'react-router-dom'
import firefox from '../assets/firefox.png'
import terminal from '../assets/terminal.png'
import file from '../assets/file.png'
import arch from '../assets/arch.png'
import Terminal from '../terminal/Terminal'
import Icons from './Icons'
import './Icons.css'
import StartMenu from './StartMenu'
import Firefox from './Firefox'




const Desktop = () => {

 const [showterminal, setShowTerminal] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);

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



  const handleStartButtonClick = () => {
    setShowStartMenu(true);
  }

  const handleCloseStartButtonClick = () => {
    setShowStartMenu(false);
  }

  const handleDesktopClick = () => {
    if (showStartMenu) {
      setShowStartMenu(false);
    }
  }

  return (
    <div>
       <div className="desktop" onClick={handleDesktopClick}>
            {showterminal && <Terminal onClose={handleTerminalClose}/>}

           <Icons></Icons> 

          {showStartMenu && (
            <StartMenu 
              onClose={handleCloseStartButtonClick}
            
            />
          )} 

            <div className="taskbar">
                <ul>
               <li><Link><img src={arch} className='arch'  onClick={handleStartButtonClick}/></Link></li>
                    <li ><Link><img src={firefox} alt="" className='firefox' /></Link></li>
                    <li><Link onClick={handleTerminalOpen} ><img src={terminal} alt="" className='terminal' /></Link></li>
                    <li><Link><img src={file} alt="" className='file' /></Link></li>
                </ul>
            </div>
        </div> 
    </div>
  )
}

export default Desktop;
