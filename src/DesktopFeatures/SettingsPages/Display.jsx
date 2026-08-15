import React from 'react'

const Display = ({brightness, onChangeBrightness, nightLight, onToggleNightLight}) => {
  return (
    <div className="display">
        <h3>Display</h3>
        <label htmlFor="brightness">Brightness</label>
        <input
          type="range"
          min="1"
          max="100"
          value={brightness}
          className="slider"
          id="brightness"
          onChange={(e) => onChangeBrightness(e.target.value)}
        />
        <label htmlFor="night-light">Night Light</label>
        <input type="button" value={nightLight ? 'On' : 'Off'} id='night-light' onClick={onToggleNightLight} />
        <h4>Scale and Layout</h4>
    </div>
  )
}

export default Display