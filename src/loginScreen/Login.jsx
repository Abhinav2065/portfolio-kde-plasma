import React, { useEffect, useState } from 'react'
import './Login.css'
import pfp from '../assets/pfp.png'
import { useNavigate } from 'react-router-dom'
import Notification from '../DesktopFeatures/Notification'
import archLinuxLoginPic from '../assets/archLinuxLoginAnimation.png'

const Login = () => {

  const [pfpClick, setPfpClick] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showLoginAnimation, setShowLoginAnimation] = useState(false);
  const [password, setPassword] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [now, setNow] = useState(new Date());

  const navigate = useNavigate();

  const dateString = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hours12: true
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = (e) => {
    const isInteractive = e.target.closest('.pfp, .login-form') != null;

    if (!isInteractive && !pfpClick) {
      setNotification({
        title: "Enter your password to login"
      })
    }
  }

  const login = () => {
    setShowLoginAnimation(true);
    setPfpClick(true);
  }

  const handlePfpClick = (e) => {
    e.preventDefault();
    login();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    login();
  }

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

        if (currentProgress >= 100) {
          clearInterval(progressTimer);
          navigate('/desktop');
        }
      })

      return () => clearInterval(progressTimer);
    }
  }, [showLoginAnimation, navigate]);



  return (
    <div onClick={handleClick} className="login-screen">

      {notification && (
        <Notification
          title={notification.title}
          onClose={handleNotificationBtnClose}
        />
      )}


      {showLoginAnimation && (
        <div className="login-animation-overlay">
          <div className="animation-content">
            <img src={archLinuxLoginPic} className="arch-logo" />

            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      )}

      <div className="login-user-area">
        <div className="pfp-container">
          <img src={pfp} className='pfp' onClick={handlePfpClick}/>
        </div>

        <div className="name">
          Abhinav Siluwal
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="password"
            className="password-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" className="login-btn" title="Log in">→</button>
        </form>

        <button className="login-hint" onClick={() => setShowHint(!showHint)}>Need help?</button>
        {showHint && (
          <div className="login-hint-text">
            Any password works — it's a portfolio, not a real login!
          </div>
        )}
      </div>

      <div className="login-clock">
        <div className="time">
          {timeString}
        </div>
        <div className="date-day">
          {dateString}
        </div>
      </div>
    </div>
  )
}

export default Login