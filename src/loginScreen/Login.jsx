import React, { useEffect, useState } from 'react'
import './Login.css'
import pfp from '../assets/pfp.png'
import { Link } from 'react-router-dom'
import Notification from '../DesktopFeatures/Notification'

const Login = () => {


  const [pfpClick, setPfpClick] = useState(false);
  const [notification, setNotification] = useState(null); 

  const today = new Date();
  const dateString = today.toLocaleDateString();
  const timeString = today.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hours12: true 
  });
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });


  const handleClick = (e) => {
    const isPfpClick = e.target.closest('.pfp') != null;


    if (!isPfpClick && !pfpClick) {
      setNotification({
        title: "Click on the Picture to Login"
      })
    }
 
  }

  const handlePfpClick = () => {
    setPfpClick(true);
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
  }, [notification]);

  return (
    <div onClick={handleClick} class="login-screen">

      {notification && (
        <Notification
          title={notification.title}
          onClose={handleNotificationBtnClose}
        
        
        />
      )}      

      <div className="header-text">
        <h1>Hi! I am</h1>
      </div>
      <div className="pfp-container">
        <Link to="/desktop" onClick={handlePfpClick}> 
          <img src={pfp} height="100vh" className='pfp'/>
        </Link>
      </div>
      
      <div className="name">
        Abhinav
      </div>

      
      <div className="info">
        <div className="time">
          {timeString}
        </div>
        <div className="date-day">
          <div className="day">
            {dayName}
          </div>
          <div className="date">
            {dateString}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login