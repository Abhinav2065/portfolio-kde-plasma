import React, { useEffect, useState } from 'react'
import './Login.css'
import pfp from '../assets/pfp.png'
import { Link, useNavigate } from 'react-router-dom'
import Notification from '../DesktopFeatures/Notification'
import archLinuxLoginPic from '../assets/archLinuxLoginAnimation.png'

const Login = () => {


  const [pfpClick, setPfpClick] = useState(false);
  const [notification, setNotification] = useState(null); 
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

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

  const handlePfpClick = (e) => {
    e.preventDefault();
    setShowLoginAnimation(true);
    setPfpClick(true);
    setTimeout(() => {
      navigate('/desktop');
    },2000)
  };

  const handleNotificationBtnClose = () => {
    setNotification(null);
  }

// Dismiss the Notification after 2 second
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);


      return () => clearTimeout(timer);
    }
  }, [notification]);


  useEffect(() => {
    if (showLoginAnimation) {
      const duration = 1500;
      const interval = 10;
      const steps = duration/interval;
      const increment = 100 / steps;


      let currentProgress = 0;

      const progressTimer = setInterval(() => {
        currentProgress += increment;
        setProgress(Math.min(currentProgress, 100));


        if (currentProgress >= 100) {
          clearInterval(progressTimer);

          setTimeout(() => {
            navigate('/desktop');
          }, 200);
        }
      })
    }
  }, [showLoginAnimation, navigate]);



  return (
    <div onClick={handleClick} class="login-screen">

      {notification && (
        <Notification
          title={notification.title}
          onClose={handleNotificationBtnClose}
        
        
        />
      )}      
      

      {showLoginAnimation && (
        <div className="login-animation-overlay">
          <div className="animation-content">
            <img src={archLinuxLoginPic}  className="arch-logo" />

            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      <div className="header-text">
        <h1>Hi! I am</h1>
      </div>
      <div className="pfp-container">
          <img src={pfp} height="100vh" className='pfp' onClick={handlePfpClick}/>
      </div>
      
      <div className="name">
        Abhinav Siluwal
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