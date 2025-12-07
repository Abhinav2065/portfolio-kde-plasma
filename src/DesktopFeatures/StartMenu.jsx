import React, { useEffect, useState } from 'react'
import Notification from './Notification'
import Firefox from '../Desktop/Firefox'
import Notepad from '../Desktop/Notepad'
import Terminal from '../terminal/Terminal'
import { Link } from 'react-router-dom'

import './Features.css'

const StartMenu = ({onClick}) => {
    const [notification, setNotification] = useState(null);
    const [showFirefox, setShowFirefox] = useState(false);
    const [showNotepad, setShowNotepad] = useState(false);


    const handleAppsClick = () => {
        setNotification({
            title: "Please Open Apps through Taskbar"
        })
    }

    const handleNotificationBtnClose = () => {
        setNotification(null);
    }

    const handleFirefoxOpen = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log('Opening Firefox');
        setShowFirefox(true);
    }

    const handleFirefoxClose = () => {
        console.log("Closing Firefox");
        setShowFirefox(false);
    }


    const handleNotepadOpen = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('Opening Notepad');
        setShowNotepad(true);
    }

    const handleNotepadClose = () => {
        console.log("Closing Notepad")
        setShowNotepad(false);
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
            {showFirefox && <Firefox onClose={handleFirefoxClose} />}

            {showNotepad && (
                <Noteapad
                    title="Untitled.txt"
                    content=""
                    onClose={handleNotepadClose}
                />
            )}
        
        <div className="start-menu" onClick={onClick}>
            <div className="search-apps-box">
                <input type="text" className='app-search-box' />
            </div>
            <div className="apps-list">
                <ul onClick={handleAppsClick}>
                    <li><Link onClick={handleFirefoxOpen} className='start-menu-link'>Firefox</Link></li>
                    <li><Link onClick={handleNotepadOpen} className='start-menu-link'>Notepad</Link></li>
                    <li>Meow (Terminal)</li>
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