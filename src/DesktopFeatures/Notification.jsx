import React, { useEffect } from 'react'
import './Features.css'


const Notification = ({title, onClose}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className='notifications-main'>
        <div className="notifications">
            <div className="notification-header">
              <h3 className="notification-title">{title}</h3>
              <button className='notification-close-btn' onClick={onClose}>x</button>
            </div>
        </div>
    </div>
  )
}

export default Notification