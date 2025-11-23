import React from 'react'
import './Login.css'
import pfp from '../assets/pfp.png'
import { Link } from 'react-router-dom'

const Login = () => {

  const today = new Date();
  const dateString = today.toLocaleDateString();
  const timeString = today.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hours12: true 
  });
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div>
      <div className="header-text">
        <h1>Hi! I am</h1>
      </div>
      <div className="pfp">
        <Link to="/desktop">
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