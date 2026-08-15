import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable';
import './Firefox.css'

const HOME_URL = 'https://www.ask.com/';

const Firefox = ({onClose}) => {

    const [url, setUrl] = useState(HOME_URL);
    const [history, setHistory] = useState([HOME_URL]);
    const [index, setIndex] = useState(0);

    const nodeRef = useRef(null);
    const currentUrl = history[index];

    const goTo = (nextUrl, replace = false) => {
        if (replace) {
            setHistory(prev => {
                const next = [...prev];
                next[index] = nextUrl;
                return next;
            });
        } else {
            const trimmed = history.slice(0, index + 1);
            trimmed.push(nextUrl);
            setHistory(trimmed);
            setIndex(trimmed.length - 1);
        }
        setUrl(nextUrl);
    }

    const handleUrlSubmit = (e) => {
        e.preventDefault();

        let newUrl = url;
        if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            newUrl = "https://" + newUrl;
        }
        goTo(newUrl);
    }

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    }

    const handleBack = () => {
        if (index > 0) {
            setIndex(index - 1);
            setUrl(history[index - 1]);
        }
    }

    const handleForward = () => {
        if (index < history.length - 1) {
            setIndex(index + 1);
            setUrl(history[index + 1]);
        }
    }

    const handleRefresh = () => {
        goTo(currentUrl + '?refresh=' + Math.random(), true);
    }

    const handleHome = () => {
        goTo(HOME_URL);
    }


  return (
    <Draggable nodeRef={nodeRef} handle='.firefox-header' defaultPosition={{x:100, y:50}} >
        <div ref={nodeRef} className="firefox-window">
           <div className="firefox-header">
                <div className="header-icons">
                    <div className="header-icon" onClick={handleBack}> &larr;</div>
                    <div className="header-icon" onClick={handleForward}> &rarr;</div>
                    <div className="btn btn-default btn-sm" onClick={handleRefresh}><i className='material-icon'>⟳</i></div>
                    <div className="home-icon" onClick={handleHome}>⌂</div>
                </div>

                <div className="url-bar-section">
                    <form onSubmit={handleUrlSubmit} className="url-form">
                    <div className="url-bar">
                        <div className="lock-icon">🔒</div>
                        <input
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
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
                    src={currentUrl}
                    title='Browser'
                    className='browser-frame'
                />
            </div>
        </div>
    </Draggable>
  )
}

export default Firefox