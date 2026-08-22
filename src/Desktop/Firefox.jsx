import React, { useRef, useState, useEffect } from 'react'
import Draggable from 'react-draggable';
import './Firefox.css'

const HOME_URL = 'about:newtab';
const SEARCH_URL = 'https://search.marginalia.nu/search?query=';

const isUrl = (input) => {
    const trimmed = input.trim();
    return /^https?:\/\//.test(trimmed) || (trimmed.includes('.') && !trimmed.includes(' '));
}

const StartPage = ({onSearch}) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) onSearch(query.trim());
    }

    return (
        <div className="start-page">
            <div className="start-page-logo">🔎</div>
            <h1 className="start-page-title">Web Search</h1>
            <form className="start-page-search" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="start-page-input"
                    placeholder="Search the web..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
            </form>
        </div>
    )
}

const Firefox = ({ onClose, onMinimize, isMinimized, zIndex, isFocused, onFocus, externalUrl }) => {
    const [tabs, setTabs] = useState([{ id: 1, url: HOME_URL, history: [HOME_URL], index: 0 }]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [urlInput, setUrlInput] = useState(HOME_URL);
    const [nextId, setNextId] = useState(2);
    const [isMaximized, setIsMaximized] = useState(false);

    const nodeRef = useRef(null);

    useEffect(() => {
        if (externalUrl && externalUrl.url) {
            const target = externalUrl.url;
            setTabs(prev => {
                const newId = Date.now();
                return [...prev, { id: newId, url: target, history: [target], index: 0 }];
            });
            setActiveTabId(Date.now());
            setUrlInput(target);
        }
    }, [externalUrl]);

    const toggleMaximize = () => {
        setIsMaximized(prev => !prev);
    }

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
    const currentUrl = activeTab ? activeTab.url : HOME_URL;
    const isHome = currentUrl === HOME_URL;
    const isImg = Boolean(
        typeof currentUrl === 'string' && (
            currentUrl.match(/\.(png|jpg|jpeg|gif|svg|webp)($|\?)/i) ||
            currentUrl.startsWith('data:image') ||
            currentUrl.startsWith('/assets/') ||
            currentUrl.startsWith('/src/assets/') ||
            currentUrl.includes('/assets/')
        )
    );

    const patchTab = (id, patch) => {
        setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    }

    const goTo = (nextUrl) => {
        const trimmed = activeTab.history.slice(0, activeTab.index + 1);
        trimmed.push(nextUrl);
        patchTab(activeTab.id, { url: nextUrl, history: trimmed, index: trimmed.length - 1 });
        setUrlInput(nextUrl);
    }

    const handleUrlSubmit = (e) => {
        e.preventDefault();
        if (isUrl(urlInput)) {
            goTo(urlInput.trim());
        } else {
            goTo(SEARCH_URL + encodeURIComponent(urlInput.trim()));
        }
    }

    const handleSearch = (query) => {
        goTo(SEARCH_URL + encodeURIComponent(query));
    }

    const handleBack = () => {
        if (activeTab.index > 0) {
            const prev = activeTab.history[activeTab.index - 1];
            patchTab(activeTab.id, { url: prev, index: activeTab.index - 1 });
            setUrlInput(prev);
        }
    }

    const handleForward = () => {
        if (activeTab.index < activeTab.history.length - 1) {
            const next = activeTab.history[activeTab.index + 1];
            patchTab(activeTab.id, { url: next, index: activeTab.index + 1 });
            setUrlInput(next);
        }
    }

    const handleRefresh = () => {
        const refreshed = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'refresh=' + Math.random();
        patchTab(activeTab.id, { url: refreshed });
        setUrlInput(refreshed);
    }

    const handleHome = () => {
        goTo(HOME_URL);
    }

    const newTab = () => {
        const id = nextId;
        setNextId(nextId + 1);
        setTabs(prev => [...prev, { id, url: HOME_URL, history: [HOME_URL], index: 0 }]);
        setActiveTabId(id);
        setUrlInput(HOME_URL);
    }

    const switchTab = (id) => {
        const tab = tabs.find(t => t.id === id);
        setActiveTabId(id);
        setUrlInput(tab.url);
    }

    const closeTab = (id) => {
        if (tabs.length <= 1) {
            onClose();
            return;
        }
        const remaining = tabs.filter(t => t.id !== id);
        setTabs(remaining);
        if (id === activeTabId) {
            const nextActive = remaining[remaining.length - 1];
            setActiveTabId(nextActive.id);
            setUrlInput(nextActive.url);
        }
    }


  return (
    <Draggable bounds="parent" nodeRef={nodeRef} handle='.firefox-tabstrip' disabled={isMaximized} defaultPosition={{x:100, y:50}} >
        <div
            ref={nodeRef}
            className={`firefox-window ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}
            onMouseDownCapture={onFocus}
            onClickCapture={onFocus}
            onMouseDown={onFocus}
            style={{ zIndex }}
        >
            <div className="firefox-tabstrip">
                <div className="tabs-container">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`firefox-tab ${tab.id === activeTabId ? 'active' : ''}`}
                            onClick={() => switchTab(tab.id)}
                        >
                            <span className="tab-title">{tab.url === HOME_URL ? 'New Tab' : tab.url.replace(/^https?:\/\//, '')}</span>
                            <button
                                type="button"
                                className="tab-close"
                                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                            >×</button>
                        </div>
                    ))}
                    <button type="button" className="new-tab-btn" onClick={newTab} title="New Tab">+</button>
                </div>
                <div className="window-controls" onMouseDown={(e) => e.stopPropagation()}>
                    <button type="button" className="wc-btn" title="Minimize" onClick={onMinimize}>—</button>
                    <button type="button" className="wc-btn" title={isMaximized ? "Restore" : "Maximize"} onClick={toggleMaximize}>
                        {isMaximized ? "❐" : "▢"}
                    </button>
                    <button type="button" className="wc-btn wc-close" title="Close" onClick={onClose}>✕</button>
                </div>
            </div>

            <div className="firefox-toolbar">
                <button type="button" className="toolbar-btn" onClick={handleBack} title="Back" disabled={activeTab.index === 0}>←</button>
                <button type="button" className="toolbar-btn" onClick={handleForward} title="Forward" disabled={activeTab.index >= activeTab.history.length - 1}>→</button>
                <button type="button" className="toolbar-btn" onClick={handleRefresh} title="Reload">⟳</button>
                <button type="button" className="toolbar-btn" onClick={handleHome} title="Home">⌂</button>

                <form onSubmit={handleUrlSubmit} className="url-form">
                    <div className="url-bar">
                        <div className="lock-icon">🔒</div>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className='url-input'
                            placeholder='Search or enter address'
                        />
                    </div>
                </form>

                <button type="button" className="toolbar-btn" title="Menu">☰</button>
            </div>

            <div className="firefox-content" style={{ position: 'relative' }}>
                {!isFocused && (
                    <div
                        className="browser-focus-overlay"
                        onMouseDown={onFocus}
                        onClick={onFocus}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 20,
                            cursor: 'default'
                        }}
                    />
                )}
                {isHome ? (
                    <StartPage onSearch={handleSearch} />
                ) : isImg ? (
                    <div className="browser-image-viewer" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e1017', overflow: 'auto', padding: '24px', boxSizing: 'border-box' }}>
                        <img
                            src={currentUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}
                        />
                    </div>
                ) : (
                    <iframe
                        src={currentUrl}
                        title='Browser'
                        className='browser-frame'
                    />
                )}
            </div>
        </div>
    </Draggable>
  )
}

export default Firefox