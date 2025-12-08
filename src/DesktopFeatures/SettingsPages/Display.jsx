import React from 'react'

const Display = () => {
  return (
    <div>
        <div className="display">
            <h3>Display</h3>
            <label htmlFor="myRange">Brightness</label>
            <input type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
            <label htmlFor="night-light">Night Light</label>
            <input type="button" value="Night-light" id='night-light' />
            <h4>Scale and Layout</h4>
            
        </div>
    </div>
  )
}

export default Display