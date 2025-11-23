import React from 'react'
import './Desktop.css'
import { Link } from 'react-router-dom'
import firefox from '../assets/firefox.png'
import terminal from '../assets/terminal.png'
import file from '../assets/file.png'
import arch from '../assets/arch.png'


const Desktop = () => {
  return (
    <div>
       <div className="desktop">
            <div className="taskbar">
                <ul>
                    <li><Link><img src={arch} className='arch' /></Link></li>
                    <li ><Link><img src={firefox} alt="" className='firefox' /></Link></li>
                    <li><Link><img src={terminal} alt="" className='terminal' /></Link></li>
                    <li><Link><img src={file} alt="" className='file' /></Link></li>
                </ul>
            </div>
        </div> 
    </div>
  )
}

export default Desktop;