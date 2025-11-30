import React from 'react'

const Settings = ({onClose}) => {
  return (
    <div className="settings-window">
        <div className="settings-header">
            <div className="settings-title">Settings</div>
            <button className="settings-close-btn" onClick={onClose}>X</button>
        </div>
        <div className="settings-content">
            <h3>Change Theme</h3>
            <div className="theme-select">
            <input type="radio" name="theme" id="normal" />
            <label htmlFor="normal">Normal Theme</label>
            <input type="radio" name="theme" id="christmas" />
            <label htmlFor="christmas">Christmas Theme</label>
            </div>
        </div>
    </div>
)
}

export default Settings