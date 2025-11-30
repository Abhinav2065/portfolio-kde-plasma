import React, { useEffect, useState } from 'react'
import Notification from './Notification'
import './Features.css'

const StartMenu = ({onClick}) => {
    const [notification, setNotification] = useState(null);


    const handleAppsClick = () => {
        setNotification({
            title: "Please Open Apps through Taskbar"
        })
    }

    const handleNotificationBtnClose = () => {
        setNotification(null);
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
                <ul onClick={handleAppsClick}>
                    <li>Firefox</li>
                    <li>Notepad</li>
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