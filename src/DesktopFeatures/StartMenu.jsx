import React, { useEffect, useState } from 'react'
import Notification from './Notification'
import { Link } from 'react-router-dom'
import './Features.css'



const StartMenu = ({onClick, onOpenFirefox, onOpenTerminal, onOpenNotepad}) => {
    const [notification, setNotification] = useState(null);

    const handleLickClick = (e, openFunction) => {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        openFunction();
    }

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [notification])
  return (
    <div className='start-window'>
        <div className="start-menu" onClick={onClick}>
            <div className="search-apps-box">
                <input type="text" className='app-search-box' />
            </div>
            <div className="apps-list">
                <ul>
                    <li><Link onClick={(e) => handleLickClick(e, onOpenFirefox)} className='start-menu-link'>Firefox</Link></li>
                    <li><Link onClick={(e) => handleLickClick(e, onOpenNotepad)} className='start-menu-link'>Notepad</Link></li>
                    <li><Link onClick={(e) => handleLickClick(e, onOpenTerminal)} className='start-menu-link'>Meow (Terminal)</Link></li>
                    <li>Dolphin (File Manager)</li>
                    <li>VS Code</li>
                    <li>Calculator</li>
                </ul>    
            </div> 
        </div>
    </div>
  )
}

export default StartMenu