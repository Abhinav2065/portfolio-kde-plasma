import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable';
import './Firefox.css'

const Firefox = ({onClose}) => {

    const [url, setUrl] = useState("https://www.ask.com/"); // Initial Url (the page that shows up when u first open the browser)
    const [currentUrl, setCurrentUrl] = useState("https://www.ask.com/");


    const nodeRef = useRef(null);

    const handleUrlSubmit = (e) => {
        e.preventDefault();

        let newUrl = url;
        if (!newUrl.startsWith('https://') && !newUrl.startsWith('https://')) {
            newUrl = "https://" + newUrl;
        }
        setCurrentUrl(newUrl);
    }

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    }

    const handleRefresh = () => {
        setCurrentUrl(currentUrl + '?refresh=' + Math.random());
    }

    const handleHome = () => {
        setUrl("https://www.ask.com/");
        setCurrentUrl("https://www.ask.com/");
    }


  return (
    <Draggable nodeRef={nodeRef} handle='.firefox-header' defaultPosition={{x:100, y:50}} >
        <div ref={nodeRef} className="firefox-window">
           <div className="firefox-header">
                <div className="header-icons">
                    <div className="header-icon" onClick={() => window.history.back()}> &larr;</div>
                    <div className="header-icon" onClick={() => window.history.forward()}> &rarr;</div>
                    <div className="btn btn-default btn-sm" onClick={handleRefresh}><i className='material-icon'>⟳</i></div> 
                    <div className="home-icon" onClick={handleHome}>⌂</div>
                </div>

                <div className="url-bar-section">
                    <form onSubmit={handleUrlSubmit} className="url-form">
                    <div className="url-bar">
                        <div className="lock-icon">🔒</div>
                        <input 
                            type="text" 
                            onSubmit={handleUrlChange}
                            value={url}
                            className='url-input'
                            placeholder='Enter Url'
                        />
                        <button type='submit' className="go-button">Go</button>
                    </div>
                    </form>
                </div>

                <div className="firefox-header-icons-left-side">
                    <div className="hamberg-icon">☰</div>
                    <div className="cross-icon" onClick={onClose}>X</div>
                </div>
            </div> 


            <div className="firefox-content">
                <iframe 
                    src={url} 
                    title='Browser'
                    className='browser-frame'
                    >
                </iframe> {/* This loads the website */}
            </div>
        </div>
    </Draggable>
  )
}

export default Firefox